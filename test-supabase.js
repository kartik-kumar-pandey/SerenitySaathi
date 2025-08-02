// Test script to verify Supabase setup
// Run this with: node test-supabase.js

const { createClient } = require('@supabase/supabase-js');

// Replace these with your actual Supabase credentials
const supabaseUrl = 'https://bkqjnjtpeeyrmtiplkxx.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJrcWpuanRwZWV5cm10aXBsa3h4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQwMjc4NzksImV4cCI6MjA2OTYwMzg3OX0.Ew8Ya1_VFlxgsIlVLXimDS8NcvD4568DPHhPEjk-gzg';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testSupabaseConnection() {
  console.log('🔍 Testing Supabase connection...\n');

  try {
    // Test 1: Check if we can connect to Supabase
    console.log('1. Testing basic connection...');
    const { data, error } = await supabase.from('user_data').select('count').limit(1);
    
    if (error) {
      console.log('❌ Connection failed:', error.message);
      return false;
    }
    
    console.log('✅ Connection successful!');
    
    // Test 2: Check if user_data table exists
    console.log('\n2. Testing user_data table...');
    const { data: tableData, error: tableError } = await supabase
      .from('user_data')
      .select('*')
      .limit(1);
    
    if (tableError) {
      console.log('❌ user_data table not found or not accessible:', tableError.message);
      console.log('💡 Make sure you have run the SQL setup commands from SUPABASE_SETUP.md');
      return false;
    }
    
    console.log('✅ user_data table exists and is accessible!');
    
    // Test 3: Test authentication (this will fail but should give us info)
    console.log('\n3. Testing authentication setup...');
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: 'test@example.com',
      password: 'testpassword'
    });
    
    if (authError) {
      if (authError.message.includes('Invalid login credentials')) {
        console.log('✅ Authentication is working (expected failure for non-existent user)');
      } else {
        console.log('❌ Authentication setup issue:', authError.message);
        return false;
      }
    }
    
    console.log('\n🎉 All tests passed! Your Supabase setup looks good.');
    console.log('\n📝 Next steps:');
    console.log('1. Make sure email confirmation is DISABLED in Supabase Auth settings');
    console.log('2. Set your site URL to http://localhost:3000 in Auth settings');
    console.log('3. Try creating a new account in your React app');
    
    return true;
    
  } catch (error) {
    console.log('❌ Unexpected error:', error.message);
    return false;
  }
}

// Run the test
testSupabaseConnection().then(success => {
  if (!success) {
    console.log('\n🔧 Troubleshooting tips:');
    console.log('1. Check your Supabase project URL and API key');
    console.log('2. Make sure your project is not paused');
    console.log('3. Run the SQL commands from SUPABASE_SETUP.md');
    console.log('4. Check the Supabase dashboard for any error messages');
  }
  process.exit(success ? 0 : 1);
}); 