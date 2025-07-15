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
      return {
        success: false,
        message: functionError.message || "Failed to cancel subscription",
        error: functionError,
      };
    }

    // Check response structure
    if (functionData?.success === false) {
      console.error("Cancellation function returned error:", functionData);
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

// Additional subscription-related functions can be added here
