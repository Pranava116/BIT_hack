import express from 'express'
import signupHandler from '../Controllers/authControllers/signupController.js'


const router = express.Router();

router.post('/signup',signupHandler)


export default router


