-- Fix payment_history event_type check constraint to allow all Paddle webhook events

-- 1. Drop the existing restrictive check constraint
ALTER TABLE public.payment_history DROP CONSTRAINT IF EXISTS payment_history_event_type_check;

-- 2. Add a more comprehensive check constraint that allows all Paddle webhook event types
ALTER TABLE public.payment_history 
ADD CONSTRAINT payment_history_event_type_check 
CHECK (event_type IN (
  -- Subscription events
  'subscription.created',
  'subscription.updated', 
  'subscription.cancelled',
  'subscription.canceled',
  'subscription.paused',
  'subscription.resumed',
  'subscription.payment_succeeded',
  'subscription.payment_failed',
  
  -- Transaction events
  'transaction.completed',
  'transaction.created',
  'transaction.updated',
  'transaction.payment_failed',
  
  -- Customer events
  'customer.created',
  'customer.updated',
  
  -- Invoice events
  'invoice.paid',
  'invoice.payment_failed',
  'invoice.created',
  'invoice.updated',
  
  -- Payment method events
  'payment_method.saved',
  'payment_method.deleted',
  
  -- Legacy event types for backward compatibility
  'subscription_created',
  'subscription_updated',
  'subscription_cancelled',
  'payment_succeeded',
  'payment_failed'
));