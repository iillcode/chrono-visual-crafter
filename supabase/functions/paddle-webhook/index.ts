import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import {
  createHmac,
  decodeHex,
} from "https://deno.land/std@0.168.0/node/crypto.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, paddle-signature",
};

const PADDLE_WEBHOOK_SIGNING_SECRET = Deno.env.get(
  "PADDLE_WEBHOOK_SIGNING_SECRET"
);
const APP_ENVIRONMENT = Deno.env.get("APP_ENVIRONMENT") || "development"; // Default to development
const WEBHOOK_TIMESTAMP_TOLERANCE_SECONDS = 300; // 5 minutes

async function verifyPaddleSignature(
  req: Request,
  rawBody: string
): Promise<boolean> {
  if (APP_ENVIRONMENT !== "production") {
    console.warn(
      `SECURITY_BYPASS: Paddle signature verification is BYPASSED in ${APP_ENVIRONMENT} environment. THIS SHOULD NOT HAPPEN IN PRODUCTION.`
    );
    return true; // Bypass verification for non-production environments
  }

  // Production environment: proceed with signature verification
  if (!PADDLE_WEBHOOK_SIGNING_SECRET) {
    console.error(
      "CRITICAL_CONFIG_ERROR: Paddle webhook signing secret is NOT CONFIGURED for PRODUCTION environment."
    );
    return false; // Verification fails if secret is missing in production
  }

  const signatureHeader = req.headers.get("Paddle-Signature");
  if (!signatureHeader) {
    console.warn("Missing Paddle-Signature header.");
    return false;
  }

  const parts = signatureHeader.split(";");
  const timestampStr = parts
    .find((part) => part.startsWith("ts="))
    ?.split("=")[1];
  const h1Hash = parts.find((part) => part.startsWith("h1="))?.split("=")[1];

  if (!timestampStr || !h1Hash) {
    console.warn("Invalid Paddle-Signature header format.");
    return false;
  }

  const timestamp = parseInt(timestampStr, 10);
  if (isNaN(timestamp)) {
    console.warn("Invalid timestamp in Paddle-Signature header.");
    return false;
  }

  const currentTimestamp = Math.floor(Date.now() / 1000);
  if (
    Math.abs(currentTimestamp - timestamp) > WEBHOOK_TIMESTAMP_TOLERANCE_SECONDS
  ) {
    console.warn(
      `Timestamp validation failed. Header ts: ${timestamp}, Current ts: ${currentTimestamp}, Tolerance: ${WEBHOOK_TIMESTAMP_TOLERANCE_SECONDS}s`
    );
    return false; // Timestamp too old or too far in the future
  }

  const signedPayload = `${timestampStr}:${rawBody}`;

  const hmac = createHmac("sha256", PADDLE_WEBHOOK_SIGNING_SECRET);
  hmac.update(signedPayload);
  const computedHash = hmac.digest("hex");

  return computedHash.toLowerCase() === h1Hash.toLowerCase();
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const rawBody = await req.text();

  try {
    const isVerified = await verifyPaddleSignature(req, rawBody);
    if (!isVerified) {
      console.error("Paddle webhook signature verification failed.");
      return new Response(
        JSON.stringify({ error: "Signature verification failed" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 401, // Unauthorized
        }
      );
    }

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Parse the webhook payload
    const payload = JSON.parse(rawBody);

    // It's good practice to log after verification, to avoid logging unverified payloads
    console.log("Paddle webhook received and verified:", payload.event_type);

    let result: HandlerResult = {
      success: false,
      message: "Event type not handled by any dedicated handler.",
    };
    // Handle different webhook events
    switch (payload.event_type) {
      case "subscription.created":
      case "subscription.updated":
        result = await handleSubscriptionEvent(supabaseClient, payload);
        break;
      case "transaction.completed":
        result = await handleTransactionCompleted(supabaseClient, payload);
        break;
      case "subscription.canceled":
        result = await handleSubscriptionCanceled(supabaseClient, payload);
        break;
      default:
        console.warn(`Received unhandled event_type: ${payload.event_type}`);
        // Acknowledge receipt to Paddle, but log that it wasn't specifically handled.
        result = {
          success: true,
          message: `Unhandled event_type: ${payload.event_type} was acknowledged.`,
        };
    }

    // If a handler explicitly threw an error for a 500-type situation, it would be caught by the main catch.
    // If a handler returned success:false for a business logic issue (e.g. user_id missing), we return 200.
    return new Response(
      JSON.stringify({
        received: result.success,
        message: result.message || "Event processed.",
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200, // We send 200 to Paddle if we've handled it, even if it's a "business logic error" on our side.
      }
    );
  } catch (error) {
    // This catch block is for truly unexpected errors or those explicitly thrown by handlers for 500-level issues.
    console.error(
      "Unhandled Webhook processing error:",
      error.message,
      error.stack
    );
    return new Response(
      JSON.stringify({
        error: "An unexpected error occurred processing the webhook.",
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});

interface HandlerResult {
  success: boolean;
  message?: string;
  // status field removed as we'll rely on throwing for 500s, and always return 200 for non-exceptions.
}

async function handleSubscriptionEvent(
  supabaseClient: any,
  payload: any
): Promise<HandlerResult> {
  const subscription = payload.data;
  const eventId = payload.event_id || "N/A";
  const customData = subscription.custom_data || {};
  const userId = customData.userId;

  console.log("=== SUBSCRIPTION EVENT DEBUG START ===");
  console.log("Event ID:", eventId);
  console.log("User ID from custom_data:", userId);
  // console.log("Full subscription data:", JSON.stringify(subscription, null, 2)); // Can be very verbose
  console.log("Subscription custom_data:", JSON.stringify(customData, null, 2));
  console.log("Subscription items from payload:", JSON.stringify(subscription.items, null, 2));


  if (!userId) {
    const errorMessage = `EVENT_PROCESSING_FAILURE: No userId found in custom_data for subscription event. Event ID: ${eventId}.`;
    console.error(errorMessage, "Payload data:", JSON.stringify(payload.data));
    return {
      success: false,
      message:
        "User ID missing in custom_data. Cannot process subscription event.",
    };
  }

  // Check different possible locations for product_id
  let productId = subscription.items?.[0]?.product_id;
  if (!productId) {
    productId = subscription.items?.[0]?.price_id;
  }
  if (!productId) {
    productId = subscription.product_id;
  }

  console.log("Chosen Product ID for lookup:", productId);
  // console.log( // Already logged above
  //   "Subscription items:",
  //   JSON.stringify(subscription.items, null, 2)
  // );

  if (!productId) {
    const errorMessage = `EVENT_PROCESSING_FAILURE: No product_id found in subscription items for event ID: ${eventId}. User: ${userId}.`;
    console.error(
      errorMessage,
      "Payload items:",
      JSON.stringify(subscription.items)
    );
    return {
      success: false,
      message:
        "Product ID missing in subscription items. Cannot process event.",
    };
  }

  // Get the plan details
  console.log(`Querying 'subscription_plans' table for paddle_product_id: '${productId}'`);
  const { data: plan, error: planError } = await supabaseClient
    .from("subscription_plans")
    .select("*")
    .eq("paddle_product_id", productId)
    .single();

  if (planError) {
    console.error(
      `DB_ERROR: Error fetching plan for product ${productId}. User: ${userId}. Event ID: ${eventId}. Error:`,
      planError
    );
    throw new Error(
      `Database error fetching plan details for product ${productId}.`
    ); // Caught by main try-catch, results in 500
  }

  if (!plan) {
    const errorMessage = `EVENT_PROCESSING_FAILURE: Plan not found in 'subscription_plans' for paddle_product_id: '${productId}'. Subscription for user ${userId} (Event ID: ${eventId}) cannot be processed. Please verify this ID exists in your 'subscription_plans' table and matches Paddle's product/price ID exactly.`;
    console.error(errorMessage);
    return {
      success: false,
      message: `Plan not found for product ID: '${productId}'.`,
    }; // 200 OK to Paddle
  }

  console.log("Plan found:", JSON.stringify(plan, null, 2));
  console.log("=== SUBSCRIPTION EVENT DEBUG END ===");


  // Check if profile exists, create if it doesn't
  console.log("Checking if profile exists for user:", userId);
  const { data: existingProfile, error: profileFetchError } = await supabaseClient
    .from("profiles")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (profileFetchError && profileFetchError.code === 'PGRST116') {
    // Profile doesn't exist, create it
    console.log("Profile doesn't exist, creating new profile for user:", userId);
    const { data: newProfile, error: profileCreateError } = await supabaseClient
      .from("profiles")
      .insert({
        user_id: userId,
        email: customData.email || 'unknown@example.com',
        full_name: customData.full_name || 'Unknown User',
        subscription_status: 'free',
        subscription_plan: 'free',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (profileCreateError) {
      console.error(
        `DB_ERROR: Error creating profile for user ${userId}. Event ID: ${eventId}. Error:`,
        profileCreateError
      );
      throw new Error(`Database error creating profile for user ${userId}.`);
    }

    console.log("Profile created successfully:", JSON.stringify(newProfile, null, 2));
  } else if (profileFetchError) {
    console.error(
      `DB_ERROR: Error fetching profile for user ${userId}. Event ID: ${eventId}. Error:`,
      profileFetchError
    );
    throw new Error(`Database error fetching profile for user ${userId}.`);
  } else {
    console.log("Profile exists:", JSON.stringify(existingProfile, null, 2));
  }

  // Update user profile
  const profileUpdateData = {
    subscription_status: subscription.status,
    subscription_plan: plan.name.toLowerCase(),
    paddle_customer_id: subscription.customer_id,
    updated_at: new Date().toISOString(),
  };

  console.log(
    "Updating profile with data:",
    JSON.stringify(profileUpdateData, null, 2)
  );
  console.log("For user ID:", userId);

  const { data: updatedProfile, error: profileUpdateError } =
    await supabaseClient
      .from("profiles")
      .update(profileUpdateData)
      .eq("user_id", userId)
      .select()
      .single();

  if (profileUpdateError) {
    console.error(
      `DB_ERROR: Error updating profile for user ${userId}. Event ID: ${eventId}. Error:`,
      profileUpdateError
    );
    throw new Error(`Database error updating profile for user ${userId}.`); // Caught by main try-catch, results in 500
  }

  console.log(
    "Profile updated successfully:",
    JSON.stringify(updatedProfile, null, 2)
  );

  // Create or update subscription record
  const subscriptionData = {
    user_id: userId,
    plan_id: plan.id,
    paddle_subscription_id: subscription.id,
    status: subscription.status,
    current_period_start: subscription.current_billing_period?.starts_at,
    current_period_end: subscription.current_billing_period?.ends_at,
    updated_at: new Date().toISOString(),
  };

  console.log(
    "Upserting subscription with data:",
    JSON.stringify(subscriptionData, null, 2)
  );

  const { data: upsertedSubscription, error: subscriptionUpsertError } =
    await supabaseClient
      .from("user_subscriptions")
      .upsert(subscriptionData)
      .select()
      .single();

  if (subscriptionUpsertError) {
    console.error(
      `DB_ERROR: Error upserting subscription for user ${userId}. Event ID: ${eventId}. Error:`,
      subscriptionUpsertError
    );
    throw new Error(
      `Database error upserting subscription for user ${userId}.`
    ); // Caught by main try-catch, results in 500
  }

  console.log(
    "Subscription upserted successfully:",
    JSON.stringify(upsertedSubscription, null, 2)
  );

  console.log(
    `EVENT_PROCESSED: Subscription event for user: ${userId}, plan: ${plan.name}, status: ${subscription.status}. Event ID: ${eventId}`
  );
  return {
    success: true,
    message: "Subscription event processed successfully.",
  };
}

async function handleTransactionCompleted(
  supabaseClient: any,
  payload: any
): Promise<HandlerResult> {
  const transaction = payload.data;
  const eventId = payload.event_id || "N/A";
  const customData = transaction.custom_data || {};
  const userId = customData.userId;

  console.log("=== TRANSACTION COMPLETED DEBUG START ===");
  console.log("Event ID:", eventId);
  console.log("User ID from custom_data:", userId);
  // console.log("Full transaction data:", JSON.stringify(transaction, null, 2)); // Can be very verbose
  console.log("Transaction custom_data:", JSON.stringify(customData, null, 2));
  console.log("Transaction items from payload:", JSON.stringify(transaction.items, null, 2));


  if (!userId) {
    const errorMessage = `EVENT_PROCESSING_FAILURE: No userId found in transaction custom_data. Event ID: ${eventId}.`;
    console.error(errorMessage, "Payload data:", JSON.stringify(payload.data));
    return {
      success: false,
      message: "User ID missing in transaction custom_data. Cannot process.",
    }; // 200 OK to Paddle
  }

  // Check if profile exists, create if it doesn't
  console.log("Checking if profile exists for user:", userId);
  const { data: existingProfile, error: profileFetchError } = await supabaseClient
    .from("profiles")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (profileFetchError && profileFetchError.code === 'PGRST116') {
    // Profile doesn't exist, create it
    console.log("Profile doesn't exist, creating new profile for user:", userId);
    const { data: newProfile, error: profileCreateError } = await supabaseClient
      .from("profiles")
      .insert({
        user_id: userId,
        email: customData.email || 'unknown@example.com',
        full_name: customData.full_name || 'Unknown User',
        subscription_status: 'free',
        subscription_plan: 'free',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (profileCreateError) {
      console.error(
        `DB_ERROR: Error creating profile for user ${userId}. Event ID: ${eventId}. Error:`,
        profileCreateError
      );
      throw new Error(`Database error creating profile for user ${userId}.`);
    }

    console.log("Profile created successfully:", JSON.stringify(newProfile, null, 2));
  } else if (profileFetchError) {
    console.error(
      `DB_ERROR: Error fetching profile for user ${userId}. Event ID: ${eventId}. Error:`,
      profileFetchError
    );
    throw new Error(`Database error fetching profile for user ${userId}.`);
  } else {
    console.log("Profile exists:", JSON.stringify(existingProfile, null, 2));
  }

  // If this is a one-time payment, update the user's profile
  if (
    !transaction.subscription_id &&
    transaction.items &&
    transaction.items.length > 0
  ) {
    const item = transaction.items[0]; // Assuming one item or primary item
    let productId = item.product_id;
    if (!productId) {
      productId = item.price_id;
    }

    console.log("Chosen Product ID for lookup from transaction item:", productId);

    if (!productId) {
      const errorMessage = `EVENT_PROCESSING_FAILURE: No product_id in transaction item. Event ID: ${eventId}. User: ${userId}.`;
      console.error(errorMessage, "Transaction item:", JSON.stringify(item));
      return {
        success: false,
        message:
          "Product ID missing in transaction item. Cannot process profile update for this item.",
      };
    }
    console.log(`Querying 'subscription_plans' table for paddle_product_id: '${productId}' (from transaction)`);
    const { data: plan, error: planError } = await supabaseClient
      .from("subscription_plans")
      .select("*")
      .eq("paddle_product_id", productId)
      .single();

    if (planError) {
      console.error(
        `DB_ERROR: Error fetching plan for product ${productId} in transaction. User: ${userId}. Event ID: ${eventId}. Error:`,
        planError
      );
      throw new Error(
        `Database error fetching plan for transaction product ${productId}.`
      ); // Caught, results in 500
    }

    if (plan) {
      console.log("Plan found for transaction item:", JSON.stringify(plan, null, 2));
      const { error: profileUpdateError } = await supabaseClient
        .from("profiles")
        .update({
          subscription_status: "active",
          subscription_plan: plan.name.toLowerCase(),
          paddle_customer_id: transaction.customer_id,
          updated_at: new Date().toISOString(),
        })
        .eq("user_id", userId);

      if (profileUpdateError) {
        console.error(
          `DB_ERROR: Error updating profile for user ${userId} after one-time transaction. Event ID: ${eventId}. Error:`,
          profileUpdateError
        );
        throw new Error(
          `Database error updating profile for transaction for user ${userId}.`
        ); // Caught, results in 500
      }
      console.log(
        `EVENT_PROCESSED: Profile updated for user ${userId} from one-time transaction, plan: ${plan.name}. Event ID: ${eventId}`
      );
    } else {
      console.warn(
         `EVENT_PROCESSING_FAILURE: Plan not found in 'subscription_plans' for paddle_product_id: '${productId}' (from transaction item). User: ${userId}, Event ID: ${eventId}. Profile not updated for this item. Please verify this ID exists in your 'subscription_plans' table and matches Paddle's product/price ID exactly.`
      );
    }
  } else {
    console.log(
      `EVENT_PROCESSING_INFO: Transaction for user ${userId} (Event ID: ${eventId}) is related to a subscription or has no items to process for profile update.`
    );
  }
   console.log("=== TRANSACTION COMPLETED DEBUG END ===");
  return { success: true, message: "Transaction completed event processed." };
}

async function handleSubscriptionCanceled(
  supabaseClient: any,
  payload: any
): Promise<HandlerResult> {
  const subscription = payload.data;
  const eventId = payload.event_id || "N/A";
  const customData = subscription.custom_data || {};
  const userId = customData.userId;

  if (!userId) {
    const errorMessage = `EVENT_PROCESSING_FAILURE: No userId found in custom_data for subscription cancellation. Event ID: ${eventId}.`;
    console.error(errorMessage, "Payload data:", JSON.stringify(payload.data));
    return {
      success: false,
      message: "User ID missing. Cannot process cancellation.",
    }; // 200 OK to Paddle
  }

  // Update user profile to free plan
  const { error: profileUpdateError } = await supabaseClient
    .from("profiles")
    .update({
      // VALIDATION POINT: Ensure subscription.status (or 'canceled') is an expected value.
      subscription_status: subscription.status || "canceled",
      // VALIDATION POINT: Ensure 'free' is the correct plan to assign on cancellation.
      subscription_plan: "free",
      updated_at: new Date().toISOString(),
    })
    .eq("user_id", userId);

  if (profileUpdateError) {
    console.error(
      `DB_ERROR: Error updating profile to 'free' for user ${userId} on cancellation. Event ID: ${eventId}. Error:`,
      profileUpdateError
    );
    throw new Error(
      `Database error updating profile on cancellation for user ${userId}.`
    ); // Caught, results in 500
  }

  // Update subscription record
  const { error: subscriptionUpdateError } = await supabaseClient
    .from("user_subscriptions")
    .update({
      status: subscription.status || "canceled",
      updated_at: new Date().toISOString(),
      current_period_end:
        subscription.current_billing_period?.ends_at ||
        new Date().toISOString(), // Reflect cancellation time
    })
    .eq("paddle_subscription_id", subscription.id);

  if (subscriptionUpdateError) {
    // If the profile update succeeded but this failed, it's a partial success.
    // Depending on business logic, this might still throw to retry, or log and return success.
    // For consistency, we'll throw, assuming subscription record accuracy is critical.
    console.error(
      `DB_ERROR: Error updating subscription record to '${
        subscription.status || "canceled"
      }' for user ${userId}. Event ID: ${eventId}. Error:`,
      subscriptionUpdateError
    );
    throw new Error(
      `Database error updating subscription record on cancellation for user ${userId}.`
    ); // Caught, results in 500
  }

  console.log(
    `EVENT_PROCESSED: Subscription cancellation for user: ${userId}, status: ${
      subscription.status || "canceled"
    }. Event ID: ${eventId}`
  );
  return {
    success: true,
    message: "Subscription cancellation processed successfully.",
  };
}
