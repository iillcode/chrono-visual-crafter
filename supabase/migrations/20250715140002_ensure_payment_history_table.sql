-- Ensure payment_history table exists with correct schema
-- This migration creates the payment_history table if it doesn't exist

CREATE TABLE IF NOT EXISTS payment_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id text NOT NULL,
  subscription_id text,
  transaction_id text,
  event_type text NOT NULL,
  amount decimal(10,2),
  currency text DEFAULT 'USD',
  plan_name text,
  paddle_data jsonb DEFAULT '{}',
  status text NOT NULL,
  processed_at timestamptz DEFAULT now() NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL
);

-- Enable RLS on payment_history
ALTER TABLE payment_history ENABLE ROW LEVEL SECURITY;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_payment_history_user_id ON payment_history(user_id);
CREATE INDEX IF NOT EXISTS idx_payment_history_subscription_id ON payment_history(subscription_id);
CREATE INDEX IF NOT EXISTS idx_payment_history_processed_at ON payment_history(processed_at DESC);
CREATE INDEX IF NOT EXISTS idx_payment_history_event_type ON payment_history(event_type);

-- RLS Policies for payment_history
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'payment_history' 
    AND policyname = 'Users can view their own payment history'
  ) THEN
    CREATE POLICY "Users can view their own payment history"
      ON payment_history
      FOR SELECT
      TO authenticated
      USING (auth.uid()::text = user_id);
  END IF;
END $$;

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'payment_history' 
    AND policyname = 'Service role can manage all payment history'
  ) THEN
    CREATE POLICY "Service role can manage all payment history"
      ON payment_history
      FOR ALL
      TO service_role
      USING (true)
      WITH CHECK (true);
  END IF;
END $$;