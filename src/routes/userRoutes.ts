import { Router, Response, Request } from 'express';
import passport from 'passport';

const router = Router({strict: true});

router.get('/token-check', passport.authenticate('jwt', {session: false}), (_: Request, res: Response) => {
    res.sendStatus(200);
});

export default router;