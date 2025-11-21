import express from 'express';
import callGemini from '../Controllers/Utilities/callAI.js';
import getInvestmentAdvice from '../Controllers/investmentController.js';

const router = express.Router();

// Make sure the path is /callai
router.post('/callai',  callGemini);

// Investment advice route
router.post('/investment-advice',  getInvestmentAdvice);

export default router;
