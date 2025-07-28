import { Router, Response, Request } from 'express';
import passport from 'passport';
import { userController } from '../controllers/userController';
import { checkAdmin } from '../middlewares/checkAdmin';

const router = Router({strict: true}).use(passport.authenticate('jwt', {session: false}));

// * cek token di client
router.get('/token-check', (_: Request, res: Response) => res.sendStatus(200));

/* ADMIN ONLY ROUTES */
router.use(checkAdmin);

// * fetch semua user
router.get('/all-users', userController.getUsers);

export default router;