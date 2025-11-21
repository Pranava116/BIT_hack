# Quick Fix for RapidAPI Network Error

## The Problem
Your frontend can't connect to the backend because:
1. You're testing on a physical device (phone) and using `localhost`
2. The backend server needs to be restarted to apply changes

## The Solution

### Step 1: Restart Backend Server
```bash
cd BIT_hack/backend
# Stop the current server (Ctrl+C if running)
npm start
```

Wait for the message: `Server is running on http://localhost:3000`

### Step 2: Update Frontend Configuration

**If testing on PHYSICAL DEVICE (phone):**
Your `frontend/.env` is already updated to:
```
EXPO_PUBLIC_API_URL="http://10.14.217.51:3000"
```

**If testing on EMULATOR:**
Change `frontend/.env` to:
```
EXPO_PUBLIC_API_URL="http://localhost:3000"
```

### Step 3: Restart Frontend App
```bash
cd BIT_hack/frontend
# Stop the current app (Ctrl+C if running)
npm start
# Or press 'r' in the Expo terminal to reload
```

### Step 4: Test
1. Open the app on your device
2. Enter product name: "laptop"
3. Enter balance: "50000"
4. Click Search
5. You should see products!

## Troubleshooting

### Error: "Cannot connect to backend"
- Make sure backend is running (`npm start` in backend folder)
- Make sure your phone and computer are on the SAME WiFi network
- Check that you're using the correct IP address (10.14.217.51)

### Error: "Invalid RapidAPI key"
- Your API key might be expired
- Check your RapidAPI subscription at rapidapi.com

### Error: "Rate limit exceeded"
- You've made too many requests
- Wait a few minutes and try again

### Still not working?
1. Check backend console for errors
2. Check frontend console (in Expo) for errors
3. Make sure Windows Firewall allows connections on port 3000

## Quick Test Commands

Test if backend is running:
```bash
curl http://localhost:3000
```
Should show: "Server Online"

Test API endpoint:
```bash
curl "http://localhost:3000/api/compare?q=laptop"
```
Should return JSON with products
