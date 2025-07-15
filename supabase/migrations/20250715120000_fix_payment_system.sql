-- Fix Payment System: Create proper structure with history table and fix current issues

-- 1. First, let's add the missing subscription_plan column to user_subscriptions
ALTER TABLE public.user_subscriptions 
ADD COLUMN IF NOT EXISTS subscription_plan TEXT DEFAULT 'free';

-- 2. Create payment history table for tracking all payment events (matches existing structure)
CREATE TABLE IF NOT EXISTS public.payment_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  subscription_id TEXT,
  transaction_id TEXT,
  event_type TEXT NOT NULL,
  amount DECIMAL(10,2),
  currency TEXT DEFAULT 'USD',
  plan_name TEXT,
  paddle_data JSONB DEFAULT '{}',
  status TEXT NOT NULL,
  processed_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- 3. Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_payment_history_user_id ON public.payment_history(user_id);
CREATE INDEX IF NOT EXISTS idx_payment_history_subscription_id ON public.payment_history(subscription_id);
-- Event ID index skipped as column doesn't exist in current schema
CREATE INDEX IF NOT EXISTS idx_payment_history_created_at ON public.payment_history(created_at DESC);

-- 4. Enable RLS on payment_history
ALTER TABLE public.payment_history ENABLE ROW LEVEL SECURITY;

-- 5. Create RLS policies for payment_history
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'payment_history' 
    AND policyname = 'Users can view their own payment history'
  ) THEN
    CREATE POLICY "Users can view their own payment history" 
    ON public.payment_history 
    FOR SELECT 
    USING (user_id = current_setting('request.jwt.claims', true)::json->>'sub');
  END IF;
END $$;

-- 6. Add trigger for payment_history updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_payment_history_updated_at ON public.payment_history;
CREATE TRIGGER update_payment_history_updated_at
  BEFORE UPDATE ON public.payment_history
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- 7. Create function to handle subscription upserts with proper deduplication
CREATE OR REPLACE FUNCTION public.upsert_user_subscription(
  p_user_id TEXT,
  p_plan_id UUID,
  p_paddle_subscription_id TEXT,
  p_status TEXT,
  p_current_period_start TIMESTAMP WITH TIME ZONE,
  p_current_period_end TIMESTAMP WITH TIME ZONE,
  p_event_type TEXT DEFAULT NULL,
  p_paddle_data JSONB DEFAULT NULL,
  p_subscription_plan TEXT DEFAULT NULL
) RETURNS UUID AS $$
DECLARE
  v_subscription_id UUID;
  v_plan_name TEXT;
BEGIN
  -- Get plan name for subscription_plan field
  SELECT name INTO v_plan_name FROM public.subscription_plans WHERE id = p_plan_id;
  
  -- Insert or update user subscription (only one record per user)
  INSERT INTO public.user_subscriptions (
    user_id,
    plan_id,
    paddle_subscription_id,
    status,
    current_period_start,
    current_period_end,
    subscription_plan,
    updated_at
  ) VALUES (
    p_user_id,
    p_plan_id,
    p_paddle_subscription_id,
    p_status,
    p_current_period_start,
    p_current_period_end,
    COALESCE(p_subscription_plan, LOWER(v_plan_name), 'free'),
    now()
  )
  ON CONFLICT (user_id) 
  DO UPDATE SET
    plan_id = EXCLUDED.plan_id,
    paddle_subscription_id = EXCLUDED.paddle_subscription_id,
    status = EXCLUDED.status,
    current_period_start = EXCLUDED.current_period_start,
    current_period_end = EXCLUDED.current_period_end,
    subscription_plan = COALESCE(EXCLUDED.subscription_plan, LOWER(v_plan_name), 'free'),
    updated_at = now()
  RETURNING id INTO v_subscription_id;

  -- Add entry to payment history for tracking
  IF p_event_type IS NOT NULL THEN
    INSERT INTO public.payment_history (
      user_id,
      subscription_id,
      event_type,
      plan_id,
      status,
      paddle_data,
      processed_at,
      created_at
    ) VALUES (
      p_user_id,
      p_paddle_subscription_id,
      p_event_type,
      p_plan_id,
      p_status,
      p_paddle_data,
      p_current_period_start,
      p_current_period_end
    );
  END IF;

  RETURN v_subscription_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 8. Create function to handle subscription cancellation
CREATE OR REPLACE FUNCTION public.cancel_user_subscription(
  p_user_id TEXT,
  p_paddle_subscription_id TEXT,
  p_reason TEXT DEFAULT 'user_initiated'
) RETURNS BOOLEAN AS $$
DECLARE
  v_subscription_record RECORD;
BEGIN
  -- Get current subscription
  SELECT * INTO v_subscription_record 
  FROM public.user_subscriptions 
  WHERE user_id = p_user_id AND paddle_subscription_id = p_paddle_subscription_id;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Subscription not found for user % with paddle_subscription_id %', p_user_id, p_paddle_subscription_id;
  END IF;
  
  -- Update subscription to cancelled and set plan to free
  UPDATE public.user_subscriptions 
  SET 
    status = 'cancelled',
    subscription_plan = 'free',
    updated_at = now()
  WHERE user_id = p_user_id AND paddle_subscription_id = p_paddle_subscription_id;
  
  -- Update user profile
  UPDATE public.profiles 
  SET 
    subscription_status = 'cancelled',
    subscription_plan = 'free',
    updated_at = now()
  WHERE user_id = p_user_id;
  
  -- Add cancellation entry to payment history
  INSERT INTO public.payment_history (
    user_id,
    subscription_id,
    event_type,
    plan_id,
    status,
    paddle_data
  ) VALUES (
    p_user_id,
    p_paddle_subscription_id,
    'subscription.cancelled',
    v_subscription_record.plan_id,
    'cancelled',
    jsonb_build_object('reason', p_reason, 'cancelled_at', now())
  );
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 9. Add unique constraint to prevent duplicate subscriptions per user
-- First, let's clean up any existing duplicates
WITH ranked_subscriptions AS (
  SELECT id, user_id, 
         ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY updated_at DESC) as rn
  FROM public.user_subscriptions
)
DELETE FROM public.user_subscriptions 
WHERE id IN (
  SELECT id FROM ranked_subscriptions WHERE rn > 1
);

-- Now add the unique constraint
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'unique_user_subscription'
  ) THEN
    ALTER TABLE public.user_subscriptions 
    ADD CONSTRAINT unique_user_subscription UNIQUE (user_id);
  END IF;
END $$;

-- 10. Create audit log table for subscription changes
CREATE TABLE IF NOT EXISTS public.subscription_audit_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  subscription_id TEXT, -- This is paddle_subscription_id
  action TEXT NOT NULL, -- cancel, create, update, etc.
  reason TEXT,
  details JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add index for audit logs
CREATE INDEX IF NOT EXISTS idx_subscription_audit_logs_user_id ON public.subscription_audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_subscription_audit_logs_created_at ON public.subscription_audit_logs(created_at DESC);

-- Enable RLS on audit logs
ALTER TABLE public.subscription_audit_logs ENABLE ROW LEVEL SECURITY;

-- Create RLS policy for audit logs
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'subscription_audit_logs' 
    AND policyname = 'Users can view their own audit logs'
  ) THEN
    CREATE POLICY "Users can view their own audit logs" 
    ON public.subscription_audit_logs 
    FOR SELECT 
    USING (user_id = current_setting('request.jwt.claims', true)::json->>'sub');
  END IF;
END $$;

-- 11. Drop existing function and create function to handle subscription cancellation with audit
DROP FUNCTION IF EXISTS public.handle_subscription_cancellation(TEXT, TEXT, TEXT);
CREATE OR REPLACE FUNCTION public.handle_subscription_cancellation(
  p_user_id TEXT,
  p_subscription_id TEXT,
  p_reason TEXT DEFAULT 'user_initiated'
) RETURNS BOOLEAN AS $$
BEGIN
  -- Call the cancel function
  PERFORM public.cancel_user_subscription(p_user_id, p_subscription_id, p_reason);
  
  -- Log the cancellation
  INSERT INTO public.subscription_audit_logs (
    user_id,
    subscription_id,
    action,
    reason,
    details
  ) VALUES (
    p_user_id,
    p_subscription_id,
    'cancel',
    p_reason,
    jsonb_build_object('cancelled_at', now(), 'method', 'webhook')
  );
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 12. Update existing user_subscriptions to have proper subscription_plan values
UPDATE public.user_subscriptions us
SET subscription_plan = LOWER(sp.name)
FROM public.subscription_plans sp
WHERE us.plan_id = sp.id AND us.subscription_plan IS NULL;

-- Set any remaining null subscription_plan values to 'free'
UPDATE public.user_subscriptions 
SET subscription_plan = 'free' 
WHERE subscription_plan IS NULL;

-- 13. Create view for easy subscription status checking
CREATE OR REPLACE VIEW public.user_subscription_status AS
SELECT 
  p.user_id,
  p.email,
  p.full_name,
  p.subscription_status,
  p.subscription_plan as profile_plan,
  us.subscription_plan as current_plan,
  us.status as subscription_status_detail,
  us.current_period_start,
  us.current_period_end,
  us.paddle_subscription_id,
  sp.name as plan_name,
  sp.price as plan_price,
  sp.currency,
  CASE 
    WHEN us.current_period_end > now() AND us.status = 'active' THEN true
    ELSE false
  END as is_active_subscription
FROM public.profiles p
LEFT JOIN public.user_subscriptions us ON p.user_id = us.user_id
LEFT JOIN public.subscription_plans sp ON us.plan_id = sp.id;

-- Grant necessary permissions
GRANT SELECT ON public.user_subscription_status TO authenticated;
GRANT SELECT ON public.payment_history TO authenticated;
GRANT SELECT ON public.subscription_audit_logs TO authenticated;