// API Configuration
// Update this IP address to match your computer's local IP address
// To find your IP: 
// Windows: ipconfig (look for IPv4 Address)
// Mac/Linux: ifconfig or ip addr

// For mobile development, use your computer's IP address
// For web development, you can use 'localhost'
const API_BASE_URL = __DEV__ 
  ? 'http://192.168.56.1:3000'  // Change this to your computer's IP address
  : 'https://your-production-api.com'; // Update with your production URL

export default API_BASE_URL;

