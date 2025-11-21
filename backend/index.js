import express from 'express'
import authRoutes from './routes/auth.js'
import dotenv from 'dotenv'
dotenv.config()

const app = express()

//Test
app.listen('/',
    (req, res) => {
        res.send('<h1>Server Online</h1>')
    }
)

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use('/auth',require(authRoutes))

const PORT = process.env.PORT

//Server listening
app.listen(PORT,
    () => {
        console.log(`Server is running on  http://localhost:${PORT}`);
    }
)