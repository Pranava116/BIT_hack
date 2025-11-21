import express from 'express';
import compareProducts from '../Controllers/compareController.js';

const router = express.Router();

router.get('/compare', compareProducts);

export default router;

