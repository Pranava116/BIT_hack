import express from 'express'
import authRoutes from './Routes/authRoutes.js'
import dotenv from 'dotenv'
import ConnectMongoDB from '../Database/connection.js'
import cors from 'cors'
dotenv.config()

const app = express()
app.use(cors())

//Test
app.listen('/',
    (req, res) => {
        res.send('<h1>Server Online</h1>')
    }
)

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

//Routes for Authentication and Authorization
app.use('/auth',require(authRoutes))

const PORT = process.env.PORT

//Server listening
app.listen(PORT,
    () => {
        console.log(`Server is running on  http://localhost:${PORT}`);
        ConnectMongoDB()
    }
)