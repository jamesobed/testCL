import express from 'express';
const router = express.Router();
import { createPayment, confirmPayment } from '../controller/paystack';

router.post('/create', createPayment);
router.get('/verify', confirmPayment);

export default router;
