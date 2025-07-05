// Test script to simulate Paddle webhook
const fetch = require("node-fetch");

const webhookUrl =
  "https://ummxlnjjrnwqvuxpkdfc.supabase.co/functions/v1/paddle-webhook";

const testPayload = {
  event_type: "subscription.created",
  event_id: "test_event_123",
  data: {
    id: "sub_test_123",
    customer_id: "ctm_test_456",
    status: "active",
    items: [
      {
        product_id: "pri_01jzd18ccw9bacpda72n20z7c8", // Premium plan
      },
    ],
    current_billing_period: {
      starts_at: "2025-07-05T10:00:00Z",
      ends_at: "2025-08-05T10:00:00Z",
    },
    custom_data: {
      userId: "user_test_789", // Replace with actual user ID
    },
  },
};

async function testWebhook() {
  try {
    console.log(
      "Testing webhook with payload:",
      JSON.stringify(testPayload, null, 2)
    );

    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Paddle-Signature": "ts=1234567890;h1=test_signature", // Mock signature for testing
      },
      body: JSON.stringify(testPayload),
    });

    const result = await response.text();
    console.log("Response status:", response.status);
    console.log("Response body:", result);
  } catch (error) {
    console.error("Error testing webhook:", error);
  }
}

testWebhook();
