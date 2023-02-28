import express from 'express';
const router = express.Router();
import { auth } from '../middleware/auth';
import { adminAuth } from '../middleware/adminAuth';

import { createTicket, getAllTicket } from '../controller/TicketController';

router.post('/create-ticket', auth || adminAuth, createTicket);
router.get('/get-all-ticket', getAllTicket);

export default router;
