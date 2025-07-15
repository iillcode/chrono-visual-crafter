/**
 * Test utility for the "already cancelled" subscription scenario
 * This helps verify that our error handling works correctly
 */

import { supabase } from "@/integrations/supabase/client";

export async function testAlreadyCancelledScenario(
  subscriptionId: string,
  userId: string
) {
  console.log("🧪 Testing 'already cancelled' subscription scenario...");

  try {
    // First, let's check the current subscription status
    console.log("1. Checking current subscription status...");
    const { data: currentSub, error: subError } = await supabase
      .from("user_subscriptions")
      .select("status, paddle_subscription_id")
      .eq("user_id", userId)
      .eq("paddle_subscription_id", subscriptionId)
      .single();

    if (subError) {
      console.error("❌ Error fetching subscription:", subError);
      return { success: false, error: subError };
    }

    console.log("📊 Current subscription status:", currentSub?.status);

    // Now test the cancellation API
    console.log("2. Testing cancellation API...");
    const { data, error } = await supabase.functions.invoke(
      "cancel-subscription",
      {
        method: "POST",
        body: {
          subscriptionId,
          userId,
          reason: "test_already_cancelled",
        },
      }
    );

    if (error) {
      console.log(
        "⚠️ Function returned error (this might be expected):",
        error
      );

      // Check if it's the "already cancelled" error
      const errorMessage = error.message || "";
      if (
        errorMessage.includes("subscription_update_when_canceled") ||
        errorMessage.includes("subscription is canceled") ||
        errorMessage.includes("already cancelled")
      ) {
        console.log("✅ Correctly identified 'already cancelled' scenario");
        return {
          success: true,
          message: "Already cancelled scenario handled correctly",
          handledGracefully: true,
        };
      } else {
        console.log("❌ Unexpected error type:", error);
        return { success: false, error, unexpectedError: true };
      }
    }

    console.log("✅ Cancellation API Response:", data);

    // Check if the response indicates success despite already being cancelled
    if (data?.success) {
      console.log("✅ API handled already-cancelled subscription gracefully");
      return {
        success: true,
        message: "Already cancelled scenario handled gracefully",
        data,
      };
    }

    return { success: true, data };
  } catch (exception) {
    console.error("❌ Exception during test:", exception);
    return { success: false, error: exception };
  }
}

export async function simulateRaceCondition(
  subscriptionId: string,
  userId: string
) {
  console.log("🧪 Simulating race condition scenario...");

  // Simulate multiple cancellation attempts happening simultaneously
  const promises = Array.from({ length: 3 }, (_, index) => {
    return supabase.functions.invoke("cancel-subscription", {
      method: "POST",
      body: {
        subscriptionId,
        userId,
        reason: `race_condition_test_${index + 1}`,
      },
    });
  });

  try {
    const results = await Promise.allSettled(promises);

    console.log("📊 Race condition test results:");
    results.forEach((result, index) => {
      if (result.status === "fulfilled") {
        console.log(`✅ Request ${index + 1}: Success -`, result.value.data);
      } else {
        console.log(`⚠️ Request ${index + 1}: Error -`, result.reason);
      }
    });

    // Check if at least one succeeded or all handled the "already cancelled" gracefully
    const successCount = results.filter(
      (r) => r.status === "fulfilled" && r.value.data?.success
    ).length;

    const gracefulHandlingCount = results.filter((r) => {
      if (r.status === "rejected") return false;
      const error = r.value.error;
      if (!error) return false;
      const errorMessage = error.message || "";
      return (
        errorMessage.includes("subscription_update_when_canceled") ||
        errorMessage.includes("subscription is canceled") ||
        errorMessage.includes("already cancelled")
      );
    }).length;

    console.log(
      `📈 Results: ${successCount} successes, ${gracefulHandlingCount} graceful error handling`
    );

    return {
      success: true,
      successCount,
      gracefulHandlingCount,
      totalRequests: promises.length,
    };
  } catch (error) {
    console.error("❌ Race condition test failed:", error);
    return { success: false, error };
  }
}

// Development helper - only available in dev mode
if (process.env.NODE_ENV === "development") {
  // @ts-ignore
  window.testAlreadyCancelled = testAlreadyCancelledScenario;
  // @ts-ignore
  window.testRaceCondition = simulateRaceCondition;

  console.log("🔧 Additional development helpers available:");
  console.log("- window.testAlreadyCancelled(subscriptionId, userId)");
  console.log("- window.testRaceCondition(subscriptionId, userId)");
}
