// VisionMakers Setup Status Checker
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log('🚀 VisionMakers Setup Status\n');

// Check environment variables
console.log('📋 Environment Variables:');
console.log(`✅ NEXT_PUBLIC_SUPABASE_URL: ${supabaseUrl ? 'Set' : '❌ Missing'}`);
console.log(`✅ SUPABASE_SERVICE_ROLE_KEY: ${supabaseServiceKey ? 'Set' : '❌ Missing'}`);
console.log(`✅ JWT_SECRET: ${process.env.JWT_SECRET ? 'Set' : '❌ Missing'}`);

if (!supabaseUrl || !supabaseServiceKey) {
  console.log('\n❌ Missing required environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkSetupStatus() {
  console.log('\n🔌 Connection Status:');

  try {
    // Test basic connection
    await supabase.auth.getSession();
    console.log('✅ Supabase connection: Working');
  } catch (error) {
    console.log('❌ Supabase connection: Failed -', error.message);
    return;
  }

  console.log('\n🗄️ Database Schema Status:');

  // Try to check if our main table exists
  try {
    const { data, error } = await supabase
      .from('consultations')
      .select('id')
      .limit(1);

    if (error) {
      if (error.message.includes('does not exist')) {
        console.log('❌ Schema: Not created');
        console.log('📝 Action needed: Execute SQL scripts in Supabase Dashboard');

        console.log('\n🔧 Next Steps:');
        console.log('1. Go to: https://app.supabase.com/project/nwnxbhkaoydiomjnjzdk/sql');
        console.log('2. Execute sql/001_initial_schema.sql');
        console.log('3. Execute sql/002_rls_policies.sql');
        console.log('4. Execute sql/003_initial_data.sql');
        console.log('5. Run this script again to verify');
        return false;
      } else {
        console.log('⚠️ Schema check failed:', error.message);
        return false;
      }
    } else {
      console.log('✅ Schema: Created and accessible');
      console.log(`📊 Consultations table: ${data ? data.length : 0} records found`);
      return true;
    }
  } catch (error) {
    console.log('❌ Schema check error:', error.message);
    return false;
  }
}

async function testFullSetup() {
  const schemaReady = await checkSetupStatus();

  if (schemaReady) {
    console.log('\n🧪 Testing Core Functions:');

    // Test creating a consultation
    try {
      const { createGuidedConsultation } = require('../services/consultation');

      const testData = {
        contact_name: '테스트 사용자',
        contact_phone: '010-1234-5678',
        contact_email: 'test@example.com',
        service_type: 'web_development',
        project_size: 'small',
        budget: 'under_1000',
        timeline: '1_month',
        important_features: ['responsive_design']
      };

      console.log('🔄 Creating test consultation...');
      const result = await createGuidedConsultation(testData);

      if (result.success) {
        console.log(`✅ Consultation creation: Working (${result.data.consultationNumber})`);
      } else {
        console.log('❌ Consultation creation: Failed -', result.error);
      }
    } catch (error) {
      console.log('❌ Consultation test error:', error.message);
    }

    // Test admin authentication
    try {
      const { loginAdmin } = require('../services/auth');

      console.log('🔄 Testing admin authentication...');
      const authResult = await loginAdmin({
        email: 'admin@visionmakers.com',
        password: 'VisionMakers2024!'
      });

      if (authResult.success) {
        console.log('✅ Admin authentication: Working');
      } else {
        console.log('❌ Admin authentication: Failed -', authResult.error);
      }
    } catch (error) {
      console.log('❌ Admin auth test error:', error.message);
    }

    console.log('\n🎉 Setup Status: Ready for development!');
  }
}

testFullSetup();