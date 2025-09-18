// Check existing tables in Supabase
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkTables() {
  try {
    console.log('🔍 Checking existing tables...\n');

    // Use raw SQL query to check tables
    const { data, error } = await supabase.rpc('exec', {
      sql: `
        SELECT table_name
        FROM information_schema.tables
        WHERE table_schema = 'public'
        AND table_type = 'BASE TABLE'
        ORDER BY table_name;
      `
    });

    if (error) {
      console.log('❌ Error querying tables:', error.message);
      return;
    }

    if (data && data.length > 0) {
      console.log('✅ Found tables:');
      data.forEach(table => {
        console.log(`  - ${table.table_name}`);
      });
    } else {
      console.log('⚠️  No tables found in public schema');
      console.log('📋 This means the SQL schema scripts haven\'t been executed yet');
    }

    console.log('\n🔧 To create the schema:');
    console.log('1. Go to https://app.supabase.com/project/nwnxbhkaoydiomjnjzdk/sql');
    console.log('2. Execute sql/001_initial_schema.sql');
    console.log('3. Execute sql/002_rls_policies.sql');
    console.log('4. Execute sql/003_initial_data.sql');

  } catch (error) {
    console.error('❌ Connection error:', error.message);
  }
}

checkTables();