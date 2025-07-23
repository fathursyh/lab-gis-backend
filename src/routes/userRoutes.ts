import { Router, Response, Request } from 'express';
import passport from 'passport';
import { Op } from 'sequelize';
import User from '../models/userModel';
import { checkAdmin } from '../middlewares/checkAdmin';
const router = Router({strict: true});

router.get('/token-check', passport.authenticate('jwt', {session: false}), (_: Request, res: Response) => {
    res.sendStatus(200);
});

router.get('/all-users', passport.authenticate('jwt', {session: false}), checkAdmin, async(req: Request, res: Response) => {
    try {
    const page = parseInt((req.query.page as string) || '1', 10);
    const limit = 10;
    const search = (req.query.search as string) || '';
    const offset = (page - 1) * limit;

    // Filter logic
    const where = search
      ? {
          [Op.or]: [
            { fullName: { [Op.like]: `%${search}%` } },
            { email: { [Op.like]: `%${search}%` } },
          ],
        }
      : {};

    const { rows, count } = await User.findAndCountAll({
      where,
      limit,
      offset,
      order: [['createdAt', 'DESC']],
      attributes: ['id', 'fullName', 'email', 'createdAt'],
    });

    return res.json({
      data: rows,
      pagination: {
        total: count,
        page,
        limit,
        totalPages: Math.ceil(count / limit),
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
})

export default router;