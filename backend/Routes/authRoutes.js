import express from 'express'
import signupHandler from '../Controllers/authControllers/signupController.js'
import loginHandler from '../Controllers/authControllers/loginController.js'
import sendJWT from '../Controllers/Utilities/sendJWT.js';


const router = express.Router();

router.post('/signup',signupHandler)

router.post('/login',loginHandler,sendJWT)


export default router