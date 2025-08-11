import { Router } from 'express';
import { paymentController } from '../controllers/paymentController';

const router = Router({strict: true});

router.post('/generate-payment', paymentController.generatePayment);
router.post('/check-payment', paymentController.checkPayment);

export default router;
