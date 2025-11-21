import express from 'express'
import signupHandler from '../Controllers/authControllers/signupController.js'
import loginHandler from '../Controllers/authControllers/loginController.js'


const router = express.Router();

router.post('/signup',signupHandler)

router.post('/login',loginHandler)


export default router