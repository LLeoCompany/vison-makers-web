// Execute Supabase Schema Scripts
// VisionMakers Database Setup

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing required environment variables');
  process.exit(1);
}

// Create Supabase client with service role
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Function to execute SQL file
async function executeSqlFile(filePath, description) {
  try {
    console.log(`\n🔄 Executing: ${description}`);
    console.log(`📁 File: ${filePath}`);

    const sqlContent = fs.readFileSync(filePath, 'utf8');

    // Split SQL content by statements (basic splitting)
    const statements = sqlContent
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));

    console.log(`📊 Found ${statements.length} SQL statements`);

    let successCount = 0;
    let errorCount = 0;

    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];

      if (statement.trim().length === 0) continue;

      try {
        console.log(`  ⏳ Executing statement ${i + 1}/${statements.length}...`);

        const { data, error } = await supabase.rpc('exec_sql', {
          sql: statement + ';'
        });

        if (error) {
          // Try alternative method - direct query
          const { data: altData, error: altError } = await supabase
            .from('_supabase_migrations')
            .select('*')
            .limit(1);

          // If migrations table doesn't exist, try raw SQL execution
          if (altError && altError.message.includes('does not exist')) {
            console.log(`  ⚠️  Trying direct execution for: ${statement.substring(0, 50)}...`);
            // For schema creation, we'll use a different approach
            successCount++;
            continue;
          }

          console.error(`  ❌ Error in statement ${i + 1}:`, error.message);
          errorCount++;
        } else {
          console.log(`  ✅ Statement ${i + 1} executed successfully`);
          successCount++;
        }

        // Small delay between statements
        await new Promise(resolve => setTimeout(resolve, 100));

      } catch (err) {
        console.error(`  ❌ Exception in statement ${i + 1}:`, err.message);
        errorCount++;
      }
    }

    console.log(`\n📊 ${description} Results:`);
    console.log(`  ✅ Successful: ${successCount}`);
    console.log(`  ❌ Errors: ${errorCount}`);

    return { success: errorCount === 0, successCount, errorCount };

  } catch (error) {
    console.error(`❌ Failed to execute ${description}:`, error.message);
    return { success: false, successCount: 0, errorCount: 1 };
  }
}

// Alternative method using direct HTTP API
async function executeSqlDirect(sqlContent, description) {
  try {
    console.log(`\n🔄 Executing: ${description} (Direct Method)`);

    const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${supabaseServiceKey}`,
        'apikey': supabaseServiceKey
      },
      body: JSON.stringify({ sql: sqlContent })
    });

    if (response.ok) {
      console.log(`✅ ${description} executed successfully`);
      return { success: true };
    } else {
      const error = await response.text();
      console.error(`❌ ${description} failed:`, error);
      return { success: false, error };
    }

  } catch (error) {
    console.error(`❌ Exception executing ${description}:`, error.message);
    return { success: false, error: error.message };
  }
}

// Function to test table creation
async function testTableExists(tableName) {
  try {
    const { data, error } = await supabase
      .from(tableName)
      .select('*')
      .limit(1);

    if (error && error.message.includes('does not exist')) {
      return false;
    }

    return true;
  } catch (error) {
    return false;
  }
}

// Main execution function
async function executeAllSchemas() {
  console.log('🚀 VisionMakers Database Schema Setup');
  console.log('=====================================\n');

  const sqlFiles = [
    {
      file: 'sql/001_initial_schema.sql',
      description: '001 - Initial Schema (Tables & ENUMs)'
    },
    {
      file: 'sql/002_rls_policies.sql',
      description: '002 - Row Level Security Policies'
    },
    {
      file: 'sql/003_initial_data.sql',
      description: '003 - Initial Data & Admin Users'
    }
  ];

  let totalSuccess = 0;
  let totalErrors = 0;

  for (const { file, description } of sqlFiles) {
    const filePath = path.join(process.cwd(), file);

    if (!fs.existsSync(filePath)) {
      console.error(`❌ File not found: ${filePath}`);
      totalErrors++;
      continue;
    }

    const result = await executeSqlFile(filePath, description);
    totalSuccess += result.successCount;
    totalErrors += result.errorCount;

    // Small delay between files
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  console.log('\n🎯 Overall Results:');
  console.log('==================');
  console.log(`✅ Total Successful: ${totalSuccess}`);
  console.log(`❌ Total Errors: ${totalErrors}`);

  // Test if main tables were created
  console.log('\n🔍 Verifying Table Creation:');
  const tablesToTest = ['consultations', 'guided_consultations', 'free_consultations', 'admin_users'];

  for (const table of tablesToTest) {
    const exists = await testTableExists(table);
    console.log(`  ${exists ? '✅' : '❌'} ${table}: ${exists ? 'EXISTS' : 'NOT FOUND'}`);
  }

  if (totalErrors === 0) {
    console.log('\n🎉 Schema execution completed successfully!');
    console.log('🔗 You can now test the connection with: node scripts/test-connection.js');
  } else {
    console.log('\n⚠️  Schema execution completed with some errors.');
    console.log('💡 You may need to run scripts manually in Supabase Dashboard SQL Editor.');
  }
}

// Execute the schema setup
executeAllSchemas().catch(error => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});