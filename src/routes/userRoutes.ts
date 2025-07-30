import { Router, Response, Request } from 'express';
import passport from 'passport';
import { userController } from '../controllers/userController';

const router = Router({strict: true}).use(passport.authenticate('jwt', {session: false}));

// * cek token di client
router.get('/token-check', (_: Request, res: Response) => res.sendStatus(200));

// * fetch semua user
router.get('/all-users', userController.getUsers);

export default router;