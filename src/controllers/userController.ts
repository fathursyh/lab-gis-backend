import { Response, Request } from "express";
import { Op } from "sequelize";
import { User } from "../models";

export const userController = {
    getUsers: async (req: Request, res: Response) => {
        try {
            const page = parseInt((req.query.page as string) || "1", 10);
            const limit = 10;
            const search = (req.query.search as string) || "";
            const offset = (page - 1) * limit;

            // Filter logic
            const where = search
                ? {
                      [Op.or]: [{ fullName: { [Op.like]: `%${search}%` } }, { email: { [Op.like]: `%${search}%` } }],
                  }
                : {};

            const { rows, count } = await User.findAndCountAll({
                where,
                limit,
                offset,
                order: [["fullName", "ASC"]],
                attributes: ["id", "fullName", "email", "createdAt", "role"],
            });
            console.log(count);
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
            res.status(500).json({ message: "Internal server error" });
        }
    },
};
