import express from 'express';
const router = express.Router();
import { auth } from '../middleware/auth';
import { adminAuth } from '../middleware/adminAuth';

import { createOrder, deleteOrder, getAllOrder, getAllUserOrder, getSingleOrder } from '../controller/orderCOntroller';

router.post('/create-order', auth, createOrder);
router.get('/get-all-user-order', auth, getAllUserOrder);
router.get('/get-all-order', getAllOrder);
router.get('/get-single-order/:id', auth, getSingleOrder);
router.delete('/delete-order/:id', adminAuth, deleteOrder);

export default router;
