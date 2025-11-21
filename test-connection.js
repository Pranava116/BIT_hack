import axios from 'axios';
import { networkInterfaces } from 'os';

// Get IP address
function getIPAddress() {
  const nets = networkInterfaces();
  for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
      const familyV4Value = typeof net.family === 'string' ? 'IPv4' : 4;
      if (net.family === familyV4Value && !net.internal) {
        return net.address;
      }
    }
  }
  return 'localhost';
}

const IP = getIPAddress();
const PORT = 3000;

console.log('🔍 Testing Backend Connection...\n');
console.log(`IP Address: ${IP}`);
console.log(`Port: ${PORT}\n`);

async function testEndpoint(url, description) {
  try {
    console.log(`Testing ${description}...`);
    const response = await axios.get(url, { timeout: 5000 });
    console.log(`✅ ${description} - SUCCESS`);
    console.log(`   Status: ${response.status}`);
    if (response.data) {
      console.log(`   Response:`, JSON.stringify(response.data).substring(0, 100));
    }
    console.log('');
    return true;
  } catch (error) {
    console.log(`❌ ${description} - FAILED`);
    if (error.code === 'ECONNREFUSED') {
      console.log(`   Error: Connection refused - Backend is not running!`);
    } else if (error.code === 'ETIMEDOUT' || error.code === 'ECONNABORTED') {
      console.log(`   Error: Timeout - Backend is not responding`);
    } else {
      console.log(`   Error: ${error.message}`);
    }
    console.log('');
    return false;
  }
}

async function runTests() {
  console.log('═══════════════════════════════════════════════\n');
  
  // Test 1: Localhost health check
  const test1 = await testEndpoint(
    `http://localhost:${PORT}/health`,
    'Localhost Health Check'
  );
  
  // Test 2: IP address health check
  const test2 = await testEndpoint(
    `http://${IP}:${PORT}/health`,
    'IP Address Health Check'
  );
  
  // Test 3: Localhost API endpoint
  const test3 = await testEndpoint(
    `http://localhost:${PORT}/api/compare?q=laptop`,
    'Localhost API Endpoint'
  );
  
  // Test 4: IP address API endpoint
  const test4 = await testEndpoint(
    `http://${IP}:${PORT}/api/compare?q=laptop`,
    'IP Address API Endpoint'
  );
  
  console.log('═══════════════════════════════════════════════\n');
  console.log('📊 Test Summary:');
  console.log(`   Localhost Health: ${test1 ? '✅' : '❌'}`);
  console.log(`   IP Health: ${test2 ? '✅' : '❌'}`);
  console.log(`   Localhost API: ${test3 ? '✅' : '❌'}`);
  console.log(`   IP API: ${test4 ? '✅' : '❌'}\n`);
  
  if (!test1 && !test2) {
    console.log('⚠️  Backend server is NOT running!');
    console.log('   Start it with: cd BIT_hack/backend && npm start\n');
  } else if (test1 && !test2) {
    console.log('⚠️  Backend is running but not accessible via IP address');
    console.log('   This might be a firewall issue\n');
  } else if (test1 && test2 && test3 && test4) {
    console.log('✅ Everything is working perfectly!');
    console.log(`\n📱 Use this in your frontend/.env:`);
    console.log(`   EXPO_PUBLIC_API_URL="http://${IP}:${PORT}"\n`);
  } else if (test1 && test2 && (!test3 || !test4)) {
    console.log('⚠️  Backend is running but API endpoint has issues');
    console.log('   Check backend logs for errors\n');
  }
}

runTests();
