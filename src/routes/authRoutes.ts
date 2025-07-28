import { Router } from 'express';
import passport from '../auth/passport';
import { authController } from '../controllers/authController';

const router = Router({strict: true});

// * register user
router.post('/register', authController.register);

// * login user
router.post('/login', passport.authenticate('local', {session: false}), authController.login);

export default router;
