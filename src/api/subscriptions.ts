import { supabase } from "@/integrations/supabase/client";

interface CancelSubscriptionParams {
  subscriptionId: string;
  userId: string;
  reason?: string;
}

/**
 * Cancels a subscription via the Supabase Edge Function
 * @param params Object containing subscriptionId and userId
 * @returns Promise that resolves to the result of the cancellation operation
 */
export async function cancelSubscription({
  subscriptionId,
  userId,
  reason = "user_initiated",
}: CancelSubscriptionParams): Promise<{
  success: boolean;
  message: string;
  error?: any;
}> {
  try {
    const { data: functionData, error: functionError } =
      await supabase.functions.invoke("cancel-subscription", {
        method: "POST",
        body: { subscriptionId, userId, reason },
      });

    if (functionError) {
      console.error(
        "Error calling cancel-subscription function:",
        functionError
      );

      // Check if the error indicates the subscription is already cancelled
      const errorMessage = functionError.message || "";
      if (
        errorMessage.includes("subscription_update_when_canceled") ||
        errorMessage.includes("subscription is canceled") ||
        errorMessage.includes("already cancelled")
      ) {
        return {
          success: true,
          message: "Subscription was already cancelled",
        };
      }

      return {
        success: false,
        message: functionError.message || "Failed to cancel subscription",
        error: functionError,
      };
    }

    // Check response structure
    if (functionData?.success === false) {
      console.error("Cancellation function returned error:", functionData);

      // Check if the error indicates the subscription is already cancelled
      const errorMessage =
        functionData.message || functionData.error?.message || "";
      if (
        errorMessage.includes("subscription_update_when_canceled") ||
        errorMessage.includes("subscription is canceled") ||
        errorMessage.includes("already cancelled")
      ) {
        return {
          success: true,
          message: "Subscription was already cancelled",
        };
      }

      return {
        success: false,
        message:
          functionData.message ||
          "Server reported an error during cancellation",
        error: functionData.error || functionData,
      };
    }

    return {
      success: true,
      message: functionData?.message || "Subscription cancelled successfully",
    };
  } catch (error) {
    console.error("Exception during subscription cancellation:", error);
    return {
      success: false,
      message: error.message || "An unexpected error occurred",
      error,
    };
  }
}

/**
 * Gets the customer portal URL for managing billing
 * @param userId The user ID
 * @param subscriptionId The Paddle subscription ID
 * @returns Promise that resolves to the customer portal URL
 */
export async function getCustomerPortalUrl(
  userId: string,
  subscriptionId: string
): Promise<{
  success: boolean;
  portal_url?: string;
  message: string;
  error?: any;
}> {
  try {
    const { data: functionData, error: functionError } =
      await supabase.functions.invoke("get-customer-portal", {
        method: "POST",
        body: { userId, subscriptionId },
      });

    if (functionError) {
      console.error(
        "Error calling get-customer-portal function:",
        functionError
      );
      return {
        success: false,
        message: functionError.message || "Failed to get customer portal URL",
        error: functionError,
      };
    }

    if (!functionData?.success || !functionData?.portal_url) {
      console.error("Customer portal function returned error:", functionData);
      return {
        success: false,
        message:
          functionData?.error || "Failed to generate customer portal URL",
        error: functionData,
      };
    }

    return {
      success: true,
      portal_url: functionData.portal_url,
      message: "Customer portal URL generated successfully",
    };
  } catch (error) {
    console.error("Exception during customer portal URL generation:", error);
    return {
      success: false,
      message: error.message || "An unexpected error occurred",
      error,
    };
  }
}

// Additional subscription-related functions can be added here
