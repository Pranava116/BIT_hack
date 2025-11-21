import axios from 'axios';

export default async function compareProducts(req, res) {
  console.log('=== compareProducts called ===');
  console.log('Query params:', req.query);
  console.log('Environment check:', {
    hasKey: !!process.env.RAPIDAPI_KEY,
    keyPreview: process.env.RAPIDAPI_KEY ? process.env.RAPIDAPI_KEY.substring(0, 10) + '...' : 'NOT SET',
    host: process.env.RAPIDAPI_HOST || 'real-time-amazon-data.p.rapidapi.com'
  });
  
  try {
    const { q } = req.query;

    if (!q) {
      console.log('ERROR: No query parameter provided');
      return res.status(400).json({ 
        success: false, 
        message: 'Product query parameter is required' 
      });
    }

    const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY;
    const RAPIDAPI_HOST = process.env.RAPIDAPI_HOST || 'real-time-amazon-data.p.rapidapi.com';

    if (!RAPIDAPI_KEY) {
      console.log('ERROR: RAPIDAPI_KEY is not set in environment');
      return res.status(500).json({ 
        success: false, 
        message: 'RapidAPI key not configured. Please set RAPIDAPI_KEY in environment variables.' 
      });
    }

    // Fetch products from RapidAPI
    const options = {
      method: 'GET',
      url: `https://${RAPIDAPI_HOST}/search`,
      params: {
        query: q,
        page: '1',
        country: 'IN'
      },
      headers: {
        'X-RapidAPI-Key': RAPIDAPI_KEY,
        'X-RapidAPI-Host': RAPIDAPI_HOST
      },
      timeout: 15000 // 15 second timeout
    };

    console.log(`Fetching products for query: "${q}" from ${RAPIDAPI_HOST}`);
    console.log('Request URL:', options.url);
    console.log('Request params:', options.params);
    
    const response = await axios.request(options);
    console.log('Response status:', response.status);
    console.log('Response headers:', response.headers);
    
    // Transform the response to match frontend expectations
    let products = [];
    
    // Log the response structure for debugging
    console.log('RapidAPI Response Structure:', JSON.stringify(response.data, null, 2).substring(0, 500));
    
    // Helper function to parse price from string
    const parsePrice = (priceStr) => {
      if (!priceStr) return 0;
      // Remove currency symbols and commas, then parse
      const cleaned = String(priceStr).replace(/[₹$,]/g, '').trim();
      return parseFloat(cleaned) || 0;
    };

    // Handle different response structures
    if (response.data) {
      // Structure 1: response.data.data.products (nested structure) - Real-time Amazon Data API
      if (response.data.data && Array.isArray(response.data.data.products)) {
        products = response.data.data.products.map(product => ({
          name: product.product_title || product.title || product.name || 'Unknown Product',
          price: parsePrice(product.product_price || product.price || product.product_price_value),
          site: product.product_source || product.source || product.site || 'Amazon',
          image: product.product_photo || product.image || product.product_main_image_url || null,
          url: product.product_url || product.url || product.product_page_url || null
        }));
      }
      // Structure 2: response.data.products (direct products array)
      else if (Array.isArray(response.data.products)) {
        products = response.data.products.map(product => ({
          name: product.product_title || product.title || product.name || 'Unknown Product',
          price: parsePrice(product.product_price || product.price || product.product_price_value),
          site: product.product_source || product.source || product.site || 'Amazon',
          image: product.product_photo || product.image || product.product_main_image_url || null,
          url: product.product_url || product.url || product.product_page_url || null
        }));
      }
      // Structure 3: response.data is directly an array
      else if (Array.isArray(response.data)) {
        products = response.data.map(product => ({
          name: product.product_title || product.title || product.name || 'Unknown Product',
          price: parsePrice(product.product_price || product.price || product.product_price_value),
          site: product.product_source || product.source || product.site || 'Amazon',
          image: product.product_photo || product.image || product.product_main_image_url || null,
          url: product.product_url || product.url || product.product_page_url || null
        }));
      }
      // Structure 4: response.data.results or response.data.items
      else if (response.data.results && Array.isArray(response.data.results)) {
        products = response.data.results.map(product => ({
          name: product.product_title || product.title || product.name || 'Unknown Product',
          price: parsePrice(product.product_price || product.price || product.product_price_value),
          site: product.product_source || product.source || product.site || 'Amazon',
          image: product.product_photo || product.image || product.product_main_image_url || null,
          url: product.product_url || product.url || product.product_page_url || null
        }));
      }
      else if (response.data.items && Array.isArray(response.data.items)) {
        products = response.data.items.map(product => ({
          name: product.product_title || product.title || product.name || 'Unknown Product',
          price: parsePrice(product.product_price || product.price || product.product_price_value),
          site: product.product_source || product.source || product.site || 'Amazon',
          image: product.product_photo || product.image || product.product_main_image_url || null,
          url: product.product_url || product.url || product.product_page_url || null
        }));
      }
    }

    // Filter out products with invalid prices
    products = products.filter(product => product.price > 0);

    // Limit to top 20 products for better performance
    products = products.slice(0, 20);

    // If no products found, return empty array
    if (products.length === 0) {
      console.log('No products found in RapidAPI response');
      return res.status(200).json([]);
    }

    console.log(`Successfully fetched ${products.length} products`);
    return res.status(200).json(products);

  } catch (error) {
    console.error('Error fetching products from RapidAPI:', error.message);
    
    if (error.response) {
      // RapidAPI returned an error
      console.error('RapidAPI Error Status:', error.response.status);
      console.error('RapidAPI Error Response:', error.response.data);
      
      let errorMessage = 'RapidAPI Error';
      if (error.response.status === 403) {
        errorMessage = 'Invalid RapidAPI key or subscription expired';
      } else if (error.response.status === 429) {
        errorMessage = 'RapidAPI rate limit exceeded. Please try again later.';
      } else if (error.response.data?.message) {
        errorMessage = error.response.data.message;
      }
      
      return res.status(error.response.status || 500).json({ 
        success: false, 
        message: errorMessage
      });
    } else if (error.request) {
      // Request was made but no response received
      console.error('No response received from RapidAPI');
      return res.status(503).json({ 
        success: false, 
        message: 'Unable to reach RapidAPI. Please check your internet connection.' 
      });
    } else if (error.code === 'ECONNABORTED') {
      // Timeout error
      return res.status(504).json({ 
        success: false, 
        message: 'Request timeout. RapidAPI took too long to respond.' 
      });
    } else {
      // Error setting up the request
      return res.status(500).json({ 
        success: false, 
        message: `Internal Server Error: ${error.message}` 
      });
    }
  }
}

