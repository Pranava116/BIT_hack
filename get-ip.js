import { networkInterfaces } from 'os';

console.log('Finding your computer\'s IP address for mobile device testing...\n');

const nets = networkInterfaces();
const results = [];

for (const name of Object.keys(nets)) {
  for (const net of nets[name]) {
    // Skip internal (i.e. 127.0.0.1) and non-IPv4 addresses
    const familyV4Value = typeof net.family === 'string' ? 'IPv4' : 4;
    if (net.family === familyV4Value && !net.internal) {
      results.push({
        name: name,
        address: net.address
      });
    }
  }
}

if (results.length === 0) {
  console.log('❌ No network interfaces found');
  console.log('Make sure you are connected to a network');
} else {
  console.log('✅ Found IP addresses:\n');
  results.forEach(result => {
    console.log(`${result.name}: ${result.address}`);
  });
  
  console.log('\n📱 For physical device testing:');
  console.log('Update frontend/.env with:');
  console.log(`EXPO_PUBLIC_API_URL="http://${results[0].address}:3000"`);
  
  console.log('\n💻 For emulator/simulator:');
  console.log('Keep frontend/.env as:');
  console.log('EXPO_PUBLIC_API_URL="http://localhost:3000"');
  
  console.log('\n⚠️  Make sure:');
  console.log('1. Backend is running: cd BIT_hack/backend && npm start');
  console.log('2. Your phone and computer are on the same WiFi network');
  console.log('3. Firewall allows connections on port 3000');
}
