-- Fix function conflicts and Paddle API error handling

-- 1. Drop all versions of cancel_user_subscription function to resolve overloading
DROP FUNCTION IF EXISTS public.cancel_user_subscription(TEXT, TEXT, TEXT);
DROP FUNCTION IF EXISTS public.cancel_user_subscription(TEXT, TEXT, TEXT, JSONB);

-- 2. Create a single, clean version of cancel_user_subscription
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
    status,
    paddle_data
  ) VALUES (
    p_user_id,
    p_paddle_subscription_id,
    'subscription.cancelled',
    'cancelled',
    jsonb_build_object('reason', p_reason, 'cancelled_at', now())
  );
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;