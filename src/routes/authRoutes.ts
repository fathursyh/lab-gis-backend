import { Router, Response, Request } from 'express';
import passport from '../auth/passport';
import jwt from 'jsonwebtoken';
import User from '../models/userModel';

const router = Router({strict: true});
export const SECRET = 'kerens-banget1';

router.post('/register', async(req: Request, res: Response) => {
    const {email, fullName, password} = req.body;
    try {
        const [user] = await User.findOrCreate({where: {email: email}, defaults: {
            fullName: fullName, password: password
        }});
        const token = jwt.sign({ id: user.dataValues.id, email: user.dataValues.email }, SECRET, {
          expiresIn: '7d',
        });
        return res.json({token, user});
    } catch(e) {
        return res.sendStatus(400);
    }

});

router.post('/login', passport.authenticate('local', {session: false}), (req: Request, res: Response) => {
    const user : any  = req.user;
    const token = jwt.sign({ id: user.id, email: user.email }, SECRET, {
      expiresIn: '7d',
    });
    delete user.password;
    return res.json({ token, user });
});
export default router;
