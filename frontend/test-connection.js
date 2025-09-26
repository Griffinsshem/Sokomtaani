const axios = require('axios');

async function testConnection() {
  console.log('Testing frontend-backend connection...\n');

  try {
    // Test 1: Basic connection
    console.log('1. Testing basic connection to categories...');
    const response1 = await axios.get('http://127.0.0.1:5000/api/categories/', {
      timeout: 5000
    });
    console.log('✅ Categories endpoint: SUCCESS');
    console.log('   Status:', response1.status);
    console.log('   Categories count:', response1.data.length);

    // Test 2: Listings endpoint
    console.log('\n2. Testing listings endpoint...');
    const response2 = await axios.get('http://127.0.0.1:5000/api/listings/', {
      timeout: 5000
    });
    console.log('✅ Listings endpoint: SUCCESS');
    console.log('   Status:', response2.status);
    console.log('   Listings count:', response2.data.length);

    // Test 3: Check CORS headers
    console.log('\n3. Checking CORS headers...');
    const response3 = await axios.options('http://127.0.0.1:5000/api/categories/', {
      timeout: 5000
    });
    console.log('✅ CORS preflight: SUCCESS');
    console.log('   Access-Control-Allow-Origin:', response3.headers['access-control-allow-origin']);

    console.log('\n🎉 All tests passed! The backend is properly configured.');

  } catch (error) {
    console.log('❌ Connection failed:');
    console.log('   Error:', error.message);
    
    if (error.response) {
      console.log('   Status:', error.response.status);
      console.log('   Headers:', error.response.headers);
    }
    
    if (error.code === 'ECONNREFUSED') {
      console.log('   Make sure the backend is running on port 5000');
    }
  }
}

testConnection();
