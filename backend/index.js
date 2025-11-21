import express from 'express'
import authRoutes from './Routes/authRoutes.js'
import compareProducts from './Controllers/compareController.js'
import dotenv from 'dotenv'
import ConnectMongoDB from './Database/connection.js'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import aiRoutes from './Routes/aiRoutes.js'

dotenv.config()

const app = express()

app.use(cors({
    credentials: true,
    origin: true // Allow all origins for development, specify your frontend URL in production
}));
app.use(cookieParser());
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

//Test
app.get('/',
    (req, res) => {
        res.send('<h1>Server Online - Updated Version</h1>')
    }
)

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ 
        status: 'ok', 
        message: 'Backend server is running - UPDATED',
        timestamp: new Date().toISOString()
    });
});

// Test endpoint to verify routing
app.get('/test', (req, res) => {
    res.json({ message: 'Test endpoint working! Server is UPDATED!' });
});

//Routes for Authentication and Authorization
app.use('/auth', authRoutes)

// Direct route for product comparison (bypassing router for now)
app.get('/api/compare', compareProducts);
app.use('/api',aiRoutes)


const PORT = process.env.PORT

//Server listening
app.listen(PORT,
    () => {
        console.log(`\n✅ Server is running on http://localhost:${PORT}`);
        console.log(`\n📍 Available endpoints:`);
        console.log(`   GET  /                    - Server status`);
        console.log(`   GET  /health              - Health check`);
        console.log(`   GET  /test                - Test endpoint`);
        console.log(`   POST /auth/*              - Auth routes`);
        console.log(`   GET  /api/compare?q=...   - Product comparison`);
        console.log(`\n🔗 Test with: curl "http://localhost:${PORT}/api/compare?q=laptop"\n`);
        ConnectMongoDB()
    }
)