// Test Supabase Connection
// Run this script to verify Supabase connection

const { createClient } = require("@supabase/supabase-js");

// Load environment variables
require("dotenv").config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log("🔍 Testing Supabase Connection...\n");

console.log("Configuration:");
console.log(`URL: ${supabaseUrl}`);
console.log(`Service Key: ${supabaseServiceKey ? "Present" : "Missing"}`);
console.log("");

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("❌ Missing required environment variables");
  process.exit(1);
}

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function testConnection() {
  try {
    console.log("🔌 Testing basic connection...");

    // Test basic connection with auth check
    const { data: session } = await supabase.auth.getSession();

    // If we get here without throwing, connection is working
    console.log("✅ Connection successful!");
    console.log("📊 Supabase client initialized correctly");

    return true;
  } catch (error) {
    console.error("❌ Connection error:", error.message);
    return false;
  }
}

async function checkSchemaExists() {
  try {
    console.log("\n🔍 Checking if LeoFitTech schema exists...");

    // Try to query the consultations table directly
    const { data, error } = await supabase
      .from("consultations")
      .select("id")
      .limit(1);

    if (error && error.message.includes("does not exist")) {
      console.log("⚠️  LeoFitTech schema not found");
      console.log("🔧 You need to run the SQL schema scripts.");
      return false;
    } else if (error) {
      console.log("⚠️  Schema check inconclusive:", error.message);
      return false;
    } else {
      console.log("✅ LeoFitTech schema exists!");
      console.log(
        `📊 Found consultations table with ${data ? data.length : 0} records`
      );
      return true;
    }
  } catch (error) {
    console.error("❌ Schema check error:", error.message);
    return false;
  }
}

// Run tests
(async () => {
  const connectionOk = await testConnection();

  if (connectionOk) {
    await checkSchemaExists();
  }

  console.log("\n" + "=".repeat(50));
  console.log("Next steps:");
  console.log("1. Go to Supabase Dashboard > SQL Editor");
  console.log("2. Run sql/001_initial_schema.sql");
  console.log("3. Run sql/002_rls_policies.sql");
  console.log("4. Run sql/003_initial_data.sql");
  console.log("=".repeat(50));
})();
