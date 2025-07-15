// @ts-ignore -- Deno environment
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
// @ts-ignore -- Deno environment
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// @ts-ignore -- Deno environment
declare const Deno: {
  env: {
    get(key: string): string | undefined;
  };
};

// SECURITY: Restrict CORS to only necessary origins
const corsHeaders = {
  "Access-Control-Allow-Origin": "*", // Should be restricted in production
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Max-Age": "86400", // Cache preflight request for 24 hours
};

const PADDLE_API_KEY = Deno.env.get("PADDLE_API_KEY");
const PADDLE_API_URL =
  Deno.env.get("PADDLE_API_URL") || "https://api.paddle.com";
const APP_ENVIRONMENT = Deno.env.get("APP_ENVIRONMENT") || "development";
const API_VERSION = Deno.env.get("PADDLE_API_VERSION") || "v2";

// Helper function to make Paddle API calls
async function callPaddleAPI(endpoint: string, method = "GET", body?: any) {
  if (!PADDLE_API_KEY) {
    throw new Error("PADDLE_API_KEY not configured");
  }

  const url = `${PADDLE_API_URL}${endpoint}`;
  console.log(`Making ${method} request to: ${url}`);

  const options: RequestInit = {
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${PADDLE_API_KEY}`,
    },
  };

  if (body && method !== "GET") {
    options.body = JSON.stringify(body);
  }

  const response = await fetch(url, options);

  // Try to parse the JSON response
  let data;
  try {
    data = await response.json();
  } catch (error) {
    console.error("Error parsing Paddle API response:", error);
    throw new Error(`Failed to parse Paddle response: ${error.message}`);
  }

  // Check if the response was successful
  if (!response.ok) {
    console.error(`Paddle API error (${method} ${endpoint}):`, data);
    throw new Error(
      `Paddle API error: ${data.error?.message || response.statusText}`
    );
  }

  return { data, response };
}

// Get subscription details
async function getSubscriptionDetails(subscriptionId: string) {
  try {
    const { data } = await callPaddleAPI(`/subscriptions/${subscriptionId}`);
    return data;
  } catch (error) {
    console.error("Error fetching subscription details:", error);
    throw error;
  }
}

// Check for pending changes
function hasPendingChanges(subscriptionData: any): boolean {
  return (
    subscriptionData.scheduled_change !== undefined &&
    subscriptionData.scheduled_change !== null
  );
}

// Cancel pending changes
async function cancelPendingChanges(subscriptionId: string) {
  try {
    const { data } = await callPaddleAPI(
      `/subscriptions/${subscriptionId}/cancel-scheduled-changes`,
      "POST"
    );
    console.log("Successfully canceled pending changes:", data);
    return data;
  } catch (error) {
    console.error("Error canceling pending changes:", error);
    throw error;
  }
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Check request method
    if (req.method !== "POST") {
      return new Response(JSON.stringify({ error: "Method not allowed" }), {
        status: 405,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Extract JWT token from auth header for Supabase client
    const authHeader = req.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const token = authHeader.substring(7);

    // Parse request body
    let payload;
    try {
      payload = await req.json();
    } catch (error) {
      return new Response(JSON.stringify({ error: "Invalid request body" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Validate required fields
    const { subscriptionId, userId, reason = "user_initiated" } = payload;
    if (!subscriptionId || !userId) {
      return new Response(
        JSON.stringify({
          error: "Missing required fields",
          details: "subscriptionId and userId are required",
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );

    // Verify user has permission to cancel this subscription
    console.log("Verifying subscription ownership for userId:", userId);
    const { data: subscription, error: subscriptionError } =
      await supabaseClient
        .from("user_subscriptions")
        .select("id, status")
        .eq("user_id", userId)
        .eq("paddle_subscription_id", subscriptionId)
        .order("created_at", { ascending: false })
        .limit(1);

    if (subscriptionError || !subscription) {
      console.error("Error verifying subscription:", subscriptionError);
      return new Response(
        JSON.stringify({
          error: "Subscription verification failed",
          details: subscriptionError?.message || "Subscription not found",
        }),
        {
          status: 404,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Check if subscription is already cancelled - handle both spelling variants
    if (
      subscription.status === "cancelled" ||
      subscription.status === "canceled"
    ) {
      console.log("Subscription is already cancelled:", subscriptionId);
      return new Response(
        JSON.stringify({
          message: "Subscription is already cancelled",
          success: true,
        }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Check subscription status with Paddle API
    console.log(
      `Checking current subscription status with Paddle API: ${subscriptionId}`
    );

    if (!PADDLE_API_KEY) {
      console.error("PADDLE_API_KEY not configured");
      return new Response(
        JSON.stringify({
          error: "Server configuration error",
          details: "Paddle API key is not configured",
        }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    try {
      // Step 1: Get current subscription details from Paddle
      const subscriptionDetails = await getSubscriptionDetails(subscriptionId);
      console.log("Current subscription details:", {
        status: subscriptionDetails.status,
        hasPendingChanges: hasPendingChanges(subscriptionDetails),
      });

      // Step 2: Handle pending changes if they exist
      if (hasPendingChanges(subscriptionDetails)) {
        console.log("Subscription has pending changes. Canceling them first.");
        await cancelPendingChanges(subscriptionId);
        console.log("Pending changes canceled successfully.");
      }

      // Step 3: Now proceed with cancellation
      const { data: paddleData, response: paddleResponse } =
        await callPaddleAPI(`/subscriptions/${subscriptionId}/cancel`, "POST", {
          effective_from: "immediately",
        });

      // Update subscription in database
      console.log("Updating subscription status in database:", subscriptionId);
      const { error: updateError } = await supabaseClient
        .from("user_subscriptions")
        .update({
          status: "cancelled", // Using British spelling to match database constraint
          subscription_plan: "free", // Set plan to free on cancel
          updated_at: new Date().toISOString(),
        })
        .eq("paddle_subscription_id", subscriptionId);

      if (updateError) {
        console.error("Error updating subscription in database:", updateError);
        return new Response(
          JSON.stringify({
            error: "Database update failed",
            details: updateError.message,
            paddleStatus:
              "Subscription was canceled in Paddle but database update failed",
          }),
          {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }

      // Update user profile status
      console.log("Updating user profile for user:", userId);
      const { error: profileUpdateError } = await supabaseClient
        .from("profiles")
        .update({
          subscription_status: "cancelled", // Using British spelling to match database constraint
          subscription_plan: "free", // Set plan to free on cancel
          updated_at: new Date().toISOString(),
        })
        .eq("user_id", userId);

      if (profileUpdateError) {
        console.error("Error updating user profile:", profileUpdateError);
        // Continue despite profile update error - the webhook will fix it
      }

      // Log to audit table
      try {
        const { error: auditError } = await supabaseClient
          .from("subscription_audit_logs")
          .insert({
            user_id: userId,
            subscription_id: subscriptionId,
            action: "cancel",
            reason: reason,
            details: JSON.stringify(paddleData),
            created_at: new Date().toISOString(),
          });

        if (auditError) {
          console.error("Error logging to audit table:", auditError);
          // Non-critical error, continue
        }
      } catch (error) {
        console.error("Error inserting audit log:", error);
        // Non-critical error, continue
      }

      // Return success response
      return new Response(
        JSON.stringify({
          success: true,
          message: "Subscription canceled successfully",
          data: paddleData,
        }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    } catch (error) {
      console.error("Error during Paddle API operations:", error);
      return new Response(
        JSON.stringify({
          error: "Paddle API operation failed",
          details: error.message,
        }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }
  } catch (error) {
    console.error("Unhandled error in cancel-subscription function:", error);
    return new Response(
      JSON.stringify({
        error: "An unexpected error occurred",
        details: error.message,
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
