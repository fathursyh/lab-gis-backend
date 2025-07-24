import { Router, Response, Request } from 'express';
import Project from '../models/projectModel';
import { Op } from 'sequelize';
import { User } from '../models';
import passport from 'passport';

const router = Router({strict: true});

router.get(
  '/all-projects',
  passport.authenticate('jwt', {session: false}),
  async (req: Request, res: Response) => {
    try {
      const page = parseInt((req.query.page as string) || '1', 10);
      const limit = parseInt((req.query.limit as string) || '10', 10);
      const search = (req.query.search as string) || '';
      const offset = (page - 1) * limit;

      // Filter logic
      const where = search
        ? {
            [Op.or]: [
              { name: { [Op.like]: `%${search}%` } },
              { description: { [Op.like]: `%${search}%` } },
            ],
          }
        : {};

      const { rows, count } = await Project.findAndCountAll({
        where,
        limit,
        offset,
        order: [['createdAt', 'DESC']], // newest first
        attributes: ['id', 'title', 'description', 'createdAt'],
        include: [
            {
                as: 'user',
                model: User,
                attributes: ['id', 'fullName']
            }
        ]
      });

      return res.json({
        data: rows,
        pagination: {
          total: count,
          page,
          limit,
          totalPages: Math.ceil(count / limit),
        },
        hasMore: page * limit < count,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
);

export default router;