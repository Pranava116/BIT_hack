import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY;
const RAPIDAPI_HOST = process.env.RAPIDAPI_HOST || 'real-time-amazon-data.p.rapidapi.com';

async function testRapidAPI() {
  console.log('Testing RapidAPI connection...');
  console.log('API Key:', RAPIDAPI_KEY ? `${RAPIDAPI_KEY.substring(0, 10)}...` : 'NOT SET');
  console.log('API Host:', RAPIDAPI_HOST);
  console.log('---');

  try {
    const options = {
      method: 'GET',
      url: `https://${RAPIDAPI_HOST}/search`,
      params: {
        query: 'laptop',
        page: '1',
        country: 'IN'
      },
      headers: {
        'X-RapidAPI-Key': RAPIDAPI_KEY,
        'X-RapidAPI-Host': RAPIDAPI_HOST
      },
      timeout: 15000
    };

    console.log('Making request to:', options.url);
    console.log('With params:', options.params);
    console.log('---');

    const response = await axios.request(options);
    
    console.log('✅ SUCCESS!');
    console.log('Status:', response.status);
    console.log('Response data structure:', Object.keys(response.data));
    console.log('Full response (first 1000 chars):', JSON.stringify(response.data, null, 2).substring(0, 1000));
    
  } catch (error) {
    console.log('❌ ERROR!');
    console.log('Error message:', error.message);
    
    if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Response data:', error.response.data);
      console.log('Response headers:', error.response.headers);
    } else if (error.request) {
      console.log('No response received');
      console.log('Request details:', error.request._header);
    } else {
      console.log('Error setting up request:', error.message);
    }
  }
}

testRapidAPI();
