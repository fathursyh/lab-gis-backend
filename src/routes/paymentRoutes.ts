import { Router } from 'express';
import { paymentController } from '../controllers/paymentController';
import passport from 'passport';

const router = Router({strict: true}).use(passport.authenticate('jwt', { session: false }));

router.post('/check-payment', paymentController.checkPayment);

export default router;
