import express from 'express';
const router = express.Router();
import { suscribeController } from '../controller/suscribeController';

router.post('/suscribe', suscribeController);

export default router;
