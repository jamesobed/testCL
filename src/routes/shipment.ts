import express from 'express';
const router = express.Router();
import { auth } from '../middleware/auth';

import { createShipment, getAllUserShipment } from '../controller/shipmentCOntroller';

router.post('/create-shipment', auth, createShipment);
router.get('/get-all-user-shipment', auth, getAllUserShipment);

export default router;
