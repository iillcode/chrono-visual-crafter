/**
 * Test utility for subscription cancellation
 * This can be used in development to test the cancellation flow
 */

import { supabase } from "@/integrations/supabase/client";

export async function testCancellationAPI(
  subscriptionId: string,
  userId: string
) {
  console.log("🧪 Testing subscription cancellation API...");

  try {
    const { data, error } = await supabase.functions.invoke(
      "cancel-subscription",
      {
        method: "POST",
        body: {
          subscriptionId,
          userId,
          reason: "test_cancellation",
        },
      }
    );

    if (error) {
      console.error("❌ Cancellation API Error:", error);
      return { success: false, error };
    }

    console.log("✅ Cancellation API Response:", data);
    return { success: true, data };
  } catch (exception) {
    console.error("❌ Cancellation API Exception:", exception);
    return { success: false, error: exception };
  }
}

export async function testCORSConfiguration() {
  console.log("🧪 Testing CORS configuration...");

  const testOrigins = [
    "http://localhost:8080",
    "http://localhost:8081",
    "https://chrono-visual-crafter.vercel.app",
  ];

  for (const origin of testOrigins) {
    try {
      const response = await fetch(
        `${supabase.supabaseUrl}/functions/v1/cancel-subscription`,
        {
          method: "OPTIONS",
          headers: {
            Origin: origin,
            "Access-Control-Request-Method": "POST",
            "Access-Control-Request-Headers": "authorization, content-type",
          },
        }
      );

      const allowedOrigin = response.headers.get("Access-Control-Allow-Origin");

      if (allowedOrigin === origin) {
        console.log(`✅ CORS OK for ${origin}`);
      } else {
        console.log(`❌ CORS Failed for ${origin}. Got: ${allowedOrigin}`);
      }
    } catch (error) {
      console.error(`❌ CORS Test Error for ${origin}:`, error);
    }
  }
}

// Development helper - only available in dev mode
if (process.env.NODE_ENV === "development") {
  // @ts-ignore
  window.testCancellation = testCancellationAPI;
  // @ts-ignore
  window.testCORS = testCORSConfiguration;

  console.log("🔧 Development helpers available:");
  console.log("- window.testCancellation(subscriptionId, userId)");
  console.log("- window.testCORS()");
}
