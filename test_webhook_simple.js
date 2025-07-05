// Simple webhook test with realistic Paddle payload
const fetch = require("node-fetch");

const webhookUrl =
  "https://ummxlnjjrnwqvuxpkdfc.supabase.co/functions/v1/paddle-webhook";

// Realistic Paddle subscription.created payload
const testPayload = {
  event_type: "subscription.created",
  event_id: "evt_01jzd18ccw9bacpda72n20z7c8",
  occurred_at: "2025-07-05T15:00:00Z",
  data: {
    id: "sub_01jzd18ccw9bacpda72n20z7c8",
    customer_id: "ctm_01jzd18ccw9bacpda72n20z7c8",
    status: "active",
    items: [
      {
        price_id: "pri_01jzd18ccw9bacpda72n20z7c8", // Premium plan
        quantity: 1,
      },
    ],
    current_billing_period: {
      starts_at: "2025-07-05T15:00:00Z",
      ends_at: "2025-08-05T15:00:00Z",
    },
    custom_data: {
      userId: "user_test_789", // Replace with actual user ID
    },
  },
};

async function testWebhook() {
  try {
    console.log("=== Testing Paddle Webhook ===");
    console.log("Webhook URL:", webhookUrl);
    console.log("Payload:", JSON.stringify(testPayload, null, 2));

    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Paddle-Signature": "ts=1234567890;h1=test_signature", // Mock signature for development
      },
      body: JSON.stringify(testPayload),
    });

    console.log("Response status:", response.status);
    console.log(
      "Response headers:",
      Object.fromEntries(response.headers.entries())
    );

    const result = await response.text();
    console.log("Response body:", result);

    if (response.ok) {
      console.log("✅ Webhook test successful!");
    } else {
      console.log("❌ Webhook test failed!");
    }
  } catch (error) {
    console.error("❌ Error testing webhook:", error);
  }
}

testWebhook();
