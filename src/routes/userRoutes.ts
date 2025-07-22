import { Router, Response, Request } from 'express';
import passport from 'passport';

const router = Router({strict: true});

router.get('/profile', passport.authenticate('jwt', {session: false}), (req: Request, res: Response) => {
    res.send('token diterima');
});

export default router;