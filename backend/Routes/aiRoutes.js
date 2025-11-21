import express from 'express';
import callGemini from '../Controllers/Utilities/callAI.js';

const router = express.Router();

// Make sure the path is /callai
router.post('/callai', callGemini);

export default router;
