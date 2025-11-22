import express from 'express';
import callGemini from '../Controllers/Utilities/callAI.js';
import getInvestmentAdvice from '../Controllers/investmentController.js';

const router = express.Router();

router.post('/callai',  callGemini);

router.post('/investment-advice',  getInvestmentAdvice);

export default router;
