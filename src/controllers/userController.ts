import { Response, Request } from "express";
import { Op } from "sequelize";
import { User } from "../models";
import { dbService } from "../services/dbService";

export const userController = {
    getUsers: async (req: Request, res: Response) => {
        try {
            const page = parseInt((req.query.page as string) || "1", 10);
            const limit = 10;
            const search = (req.query.search as string) || "";
            const offset = (page - 1) * limit;
            const where = search ? {[Op.or]: [{ fullName: { [Op.like]: `%${search}%` } }, { email: { [Op.like]: `%${search}%` } }]} : {};
            const params = { where, limit, offset, order: [["fullName", "ASC"]], attributes: ["id", "fullName", "email", "createdAt", "role"], page };
          
            // start fetching
            const result = await dbService.findAllFromDb(params, User);

            return res.json(result);
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: "Internal server error" });
        }
    },
};
