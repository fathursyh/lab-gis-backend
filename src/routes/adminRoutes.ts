import { Router, Response, Request } from 'express';
import passport from 'passport';
import { checkAdmin } from '../middlewares/checkAdmin';
import { User } from '../models';
const router = Router({strict: true}).use( passport.authenticate('jwt', {session: false})).use(checkAdmin);

router.patch('/change-role', async(req: Request, res: Response) => {
    const {id, role} = req.body;
    try {
        await User.update(
            {role: role},
            {where: {id: id}}
        );
        return res.status(200).json({message: 'User role has been updated.'});
    } catch(e) {
        res.status(400).json({error: 'Request has failed.'});
    }
});

export default router;