import { Router, Response, Request } from 'express';
import passport from 'passport';
import User from '../models/userModel';
import { checkAdmin } from '../middlewares/checkAdmin';
const router = Router({strict: true});

router.patch('/change-role', passport.authenticate('jwt', {session: false}), checkAdmin, async(req: Request, res: Response) => {
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