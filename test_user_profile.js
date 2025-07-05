// Test script to check user profile and update it manually
const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = "https://ummxlnjjrnwqvuxpkdfc.supabase.co";
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY || "your-service-role-key";

const supabase = createClient(supabaseUrl, supabaseKey);

async function testUserProfile() {
  try {
    // Replace with an actual user ID from your app
    const testUserId = "user_test_789"; // Replace with real user ID

    console.log("=== Testing User Profile ===");
    console.log("User ID:", testUserId);

    // Check if profile exists
    console.log("\n1. Checking if profile exists...");
    const { data: existingProfile, error: fetchError } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", testUserId)
      .single();

    if (fetchError) {
      console.log("Profile does not exist, creating one...");

      // Create profile
      const { data: newProfile, error: createError } = await supabase
        .from("profiles")
        .insert({
          user_id: testUserId,
          email: "test@example.com",
          full_name: "Test User",
          subscription_status: "free",
          subscription_plan: "free",
        })
        .select()
        .single();

      if (createError) {
        console.error("Error creating profile:", createError);
        return;
      }

      console.log("Profile created:", newProfile);
    } else {
      console.log("Profile exists:", existingProfile);
    }

    // Test updating the profile
    console.log("\n2. Testing profile update...");
    const { data: updatedProfile, error: updateError } = await supabase
      .from("profiles")
      .update({
        subscription_status: "active",
        subscription_plan: "premium",
        paddle_customer_id: "ctm_test_456",
        updated_at: new Date().toISOString(),
      })
      .eq("user_id", testUserId)
      .select()
      .single();

    if (updateError) {
      console.error("Error updating profile:", updateError);
    } else {
      console.log("Profile updated successfully:", updatedProfile);
    }

    // Test subscription plans
    console.log("\n3. Checking subscription plans...");
    const { data: plans, error: plansError } = await supabase
      .from("subscription_plans")
      .select("*");

    if (plansError) {
      console.error("Error fetching plans:", plansError);
    } else {
      console.log(
        "Available plans:",
        plans.map((p) => ({
          name: p.name,
          paddle_product_id: p.paddle_product_id,
        }))
      );
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

testUserProfile();
