# 🔄 RESTART EVERYTHING - Fix 404 Error

## The 404 error means the backend route isn't found. This happens when:
1. Backend server wasn't restarted after code changes
2. Route isn't properly registered

## Follow These Steps EXACTLY:

### 1️⃣ STOP Everything
- Stop backend server (Ctrl+C in backend terminal)
- Stop frontend app (Ctrl+C in frontend terminal)

### 2️⃣ START Backend
```bash
cd BIT_hack/backend
npm start
```

**Wait for this output:**
```
✅ Server is running on http://localhost:3000

📍 Available endpoints:
   GET  /                    - Server status
   GET  /health              - Health check
   GET  /test                - Test endpoint
   POST /auth/*              - Auth routes
   GET  /api/compare?q=...   - Product comparison

🔗 Test with: curl "http://localhost:3000/api/compare?q=laptop"
```

### 3️⃣ TEST Backend (Open NEW terminal)
```bash
curl "http://localhost:3000/api/compare?q=laptop"
```

**Expected:** JSON array with product data
**If you get 404:** The route isn't registered - check backend console for errors

### 4️⃣ START Frontend
```bash
cd BIT_hack/frontend
npm start
```

Press 'r' to reload the app

### 5️⃣ TEST in App
1. Enter product: "laptop"
2. Enter balance: "50000"
3. Click Search
4. Check console logs in Expo

## If Still Getting 404:

### Check Backend Console
Look for:
- "=== compareProducts called ===" (means route is working)
- Any error messages

### Check Frontend Console (Expo)
Look for:
- "Requesting: http://10.14.217.51:3000/api/compare?q=laptop"
- The exact URL being called

### Verify Route Registration
In backend terminal, you should see the endpoints list when server starts.
If you don't see "/api/compare" listed, there's a problem with route registration.

## Quick Debug:

### Test 1: Is backend running?
```bash
curl http://localhost:3000
```
Should return: "Server Online"

### Test 2: Is test endpoint working?
```bash
curl http://localhost:3000/test
```
Should return: `{"message":"Test endpoint working!"}`

### Test 3: Is compare endpoint working?
```bash
curl "http://localhost:3000/api/compare?q=laptop"
```
Should return: Array of products

### Test 4: Can you reach backend from your IP?
```bash
curl "http://10.14.217.51:3000/test"
```
Should return: `{"message":"Test endpoint working!"}`

If Test 1-3 work but Test 4 doesn't:
- **Firewall is blocking** - Allow port 3000 in Windows Firewall
- **Not on same network** - Connect phone and PC to same WiFi

If Test 3 doesn't work:
- **Route not registered** - Check backend code
- **Server needs restart** - Stop and start again
