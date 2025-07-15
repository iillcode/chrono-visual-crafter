-- Drop the upsert_user_subscription function since we're using direct database operations
-- This migration removes the problematic function that was causing issues

-- Drop all versions of the function
DROP FUNCTION IF EXISTS public.upsert_user_subscription(TEXT, UUID, TEXT, TEXT, TIMESTAMP WITH TIME ZONE, TIMESTAMP WITH TIME ZONE, TEXT, JSONB, TEXT) CASCADE;
DROP FUNCTION IF EXISTS public.upsert_user_subscription(text, uuid, text, text, timestamptz, timestamptz, text, jsonb) CASCADE;
DROP FUNCTION IF EXISTS upsert_user_subscription CASCADE;