import axios from 'axios';

async function testBackendEndpoint() {
  console.log('Testing backend /api/compare endpoint...');
  console.log('Make sure your backend server is running on port 3000');
  console.log('---');

  try {
    const response = await axios.get('http://localhost:3000/api/compare', {
      params: { q: 'laptop' },
      timeout: 20000
    });

    console.log('✅ SUCCESS!');
    console.log('Status:', response.status);
    console.log('Number of products:', response.data.length);
    
    if (response.data.length > 0) {
      console.log('\nFirst 3 products:');
      response.data.slice(0, 3).forEach((product, index) => {
        console.log(`\n${index + 1}. ${product.name}`);
        console.log(`   Price: ₹${product.price}`);
        console.log(`   Site: ${product.site}`);
      });
    }
    
  } catch (error) {
    console.log('❌ ERROR!');
    
    if (error.code === 'ECONNREFUSED') {
      console.log('Backend server is not running!');
      console.log('Start it with: npm start');
    } else if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Error:', error.response.data);
    } else {
      console.log('Error:', error.message);
    }
  }
}

testBackendEndpoint();
