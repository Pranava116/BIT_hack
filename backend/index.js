import express from 'express'
import authRoutes from './Routes/authRoutes.js'
import dotenv from 'dotenv'
import ConnectMongoDB from './Database/connection.js'
import cookieParser from 'cookie-parser'
import cors from 'cors'
dotenv.config()

const app = express()

app.use(cors({credentials:true}));
app.use(cookieParser());
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

//Test
app.get('/',
    (req, res) => {
        res.send('<h1>Server Online</h1>')
    }
)


//Routes for Authentication and Authorization
app.use('/auth',authRoutes)

const PORT = process.env.PORT

//Server listening
app.listen(PORT,
    () => {
        console.log(`Server is running on  http://localhost:${PORT}`);
        ConnectMongoDB()
    }
)