# How to Start the Backend Server

## Step 1: Stop any running server
Press `Ctrl + C` in the terminal where the server is running

## Step 2: Start the server
```bash
cd BIT_hack/backend
npm start
```

## Step 3: Verify it's working
You should see:
```
Server is running on http://localhost:3000
MongoDB connected successfully
```

## Step 4: Test the endpoints

Open a new terminal and run:

```bash
# Test 1: Check if server is online
curl http://localhost:3000

# Test 2: Check health endpoint
curl http://localhost:3000/health

# Test 3: Check test endpoint
curl http://localhost:3000/test

# Test 4: Check compare endpoint
curl "http://localhost:3000/api/compare?q=laptop"
```

If Test 4 returns product data, everything is working!

## Common Issues

### "Cannot GET /api/compare"
- The route isn't registered
- Make sure you restarted the server after making changes

### "ECONNREFUSED"
- Server isn't running
- Start it with `npm start`

### "Port 3000 is already in use"
- Another process is using port 3000
- Kill it or change PORT in .env file
