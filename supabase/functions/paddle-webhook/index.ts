import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const signature = req.headers.get('paddle-signature')
    const body = await req.text()
    
    // Parse the webhook payload
    const payload = JSON.parse(body)
    
    console.log('Paddle webhook received:', payload.event_type)

    // Handle different webhook events
    switch (payload.event_type) {
      case 'subscription.created':
      case 'subscription.updated':
        await handleSubscriptionEvent(supabaseClient, payload)
        break
      case 'transaction.completed':
        await handleTransactionCompleted(supabaseClient, payload)
        break
      case 'subscription.canceled':
        await handleSubscriptionCanceled(supabaseClient, payload)
        break
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    console.error('Webhook error:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})

async function handleSubscriptionEvent(supabaseClient: any, payload: any) {
  const subscription = payload.data
  const customData = subscription.custom_data || {}
  const userId = customData.userId

  if (!userId) {
    console.error('No userId found in custom_data')
    return
  }

  // Get the plan details
  const { data: plan } = await supabaseClient
    .from('subscription_plans')
    .select('*')
    .eq('paddle_product_id', subscription.items[0]?.product_id)
    .single()

  if (!plan) {
    console.error('Plan not found for product:', subscription.items[0]?.product_id)
    return
  }

  // Update user profile
  await supabaseClient
    .from('profiles')
    .update({
      subscription_status: subscription.status,
      subscription_plan: plan.name.toLowerCase(),
      paddle_customer_id: subscription.customer_id,
      updated_at: new Date().toISOString()
    })
    .eq('user_id', userId)

  // Create or update subscription record
  await supabaseClient
    .from('user_subscriptions')
    .upsert({
      user_id: userId,
      plan_id: plan.id,
      paddle_subscription_id: subscription.id,
      status: subscription.status,
      current_period_start: subscription.current_billing_period?.starts_at,
      current_period_end: subscription.current_billing_period?.ends_at,
      updated_at: new Date().toISOString()
    })

  console.log('Subscription updated for user:', userId)
}

async function handleTransactionCompleted(supabaseClient: any, payload: any) {
  const transaction = payload.data
  const customData = transaction.custom_data || {}
  const userId = customData.userId

  if (!userId) {
    console.error('No userId found in transaction custom_data')
    return
  }

  console.log('Transaction completed for user:', userId)
  
  // If this is a one-time payment, update the user's profile
  if (!transaction.subscription_id) {
    const { data: plan } = await supabaseClient
      .from('subscription_plans')
      .select('*')
      .eq('paddle_product_id', transaction.items[0]?.product_id)
      .single()

    if (plan) {
      await supabaseClient
        .from('profiles')
        .update({
          subscription_status: 'active',
          subscription_plan: plan.name.toLowerCase(),
          paddle_customer_id: transaction.customer_id,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId)
    }
  }
}

async function handleSubscriptionCanceled(supabaseClient: any, payload: any) {
  const subscription = payload.data
  const customData = subscription.custom_data || {}
  const userId = customData.userId

  if (!userId) {
    console.error('No userId found in custom_data')
    return
  }

  // Update user profile to free plan
  await supabaseClient
    .from('profiles')
    .update({
      subscription_status: 'canceled',
      subscription_plan: 'free',
      updated_at: new Date().toISOString()
    })
    .eq('user_id', userId)

  // Update subscription record
  await supabaseClient
    .from('user_subscriptions')
    .update({
      status: 'canceled',
      updated_at: new Date().toISOString()
    })
    .eq('paddle_subscription_id', subscription.id)

  console.log('Subscription canceled for user:', userId)
}