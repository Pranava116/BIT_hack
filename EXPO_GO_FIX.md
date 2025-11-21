# 📱 Expo Go Network Fix

## The Problem
Expo Go on physical devices has trouble connecting to localhost backends. You need to:
1. Use your computer's IP address (not localhost)
2. Make sure both devices are on the same WiFi
3. Ensure Windows Firewall allows the connection

## Your Setup
- Computer IP: `10.14.217.51`
- Backend Port: `3000`
- Frontend already configured with: `http://10.14.217.51:3000`

## Steps to Fix:

### 1️⃣ Restart Backend Server
In your backend terminal:
```bash
cd BIT_hack/backend
# Press Ctrl+C to stop
npm start
```

Wait for: "Server is running on http://localhost:3000"

### 2️⃣ Test Backend from Computer
Open a NEW terminal:
```bash
curl http://localhost:3000
```
Should show: "Server Online - Updated Version"

```bash
curl "http://localhost:3000/api/compare?q=laptop"
```
Should return JSON with products

### 3️⃣ Allow Firewall Access
When you restart the backend, Windows might ask:
"Allow Node.js to communicate on these networks?"
✅ **Check BOTH boxes** (Private and Public networks)
✅ Click "Allow access"

If you didn't see this popup, manually allow it:
1. Open Windows Firewall
2. Click "Allow an app through firewall"
3. Find "Node.js" or "node.exe"
4. Check both Private and Public
5. Click OK

### 4️⃣ Test from Your Phone's Network
On your computer, test if the IP address works:
```bash
curl http://10.14.217.51:3000
```
Should show: "Server Online - Updated Version"

```bash
curl "http://10.14.217.51:3000/api/compare?q=laptop"
```
Should return products

### 5️⃣ Restart Expo App
In your Expo terminal, press `r` to reload

Or shake your phone and tap "Reload"

### 6️⃣ Test in App
1. Enter product: "laptop"
2. Enter balance: "50000"
3. Click Search

## Still Not Working?

### Check 1: Are you on the same WiFi?
- Computer and phone MUST be on the same WiFi network
- Not mobile data, not different WiFi

### Check 2: Is your IP still the same?
Run this to check:
```bash
ipconfig
```
Look for "IPv4 Address" under your WiFi adapter
If it changed, update `frontend/.env`

### Check 3: Can you ping your computer from phone?
Install a network tool app on your phone and ping `10.14.217.51`

### Check 4: Is backend actually running?
In backend terminal, you should see it running
Test with: `curl http://localhost:3000`

### Check 5: Firewall blocking?
Temporarily disable Windows Firewall to test:
- If it works with firewall off, you need to add a rule for port 3000

## Alternative: Use ngrok (if nothing else works)

If firewall/network issues persist, use ngrok to expose your backend:

1. Install ngrok: https://ngrok.com/download
2. Run: `ngrok http 3000`
3. Copy the https URL (e.g., `https://abc123.ngrok.io`)
4. Update `frontend/.env`:
   ```
   EXPO_PUBLIC_API_URL="https://abc123.ngrok.io"
   ```
5. Restart Expo app

## Debug Checklist

✅ Backend server restarted
✅ Backend responds to `curl http://localhost:3000`
✅ Backend responds to `curl http://10.14.217.51:3000`
✅ Backend responds to `curl "http://10.14.217.51:3000/api/compare?q=laptop"`
✅ Windows Firewall allows Node.js
✅ Phone and computer on same WiFi
✅ Frontend `.env` has correct IP: `http://10.14.217.51:3000`
✅ Expo app reloaded after changes

If ALL checkmarks are done and it still doesn't work, use ngrok.
