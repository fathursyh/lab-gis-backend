import { Request, Response, NextFunction } from "express";
import { User } from "../models";

export async function checkAdmin(req: Request, res: Response, next: NextFunction) {
    const {id}: any = req.user;
    const user = await User.findByPk(id, {
        attributes: ['role'],
    })
    if (user?.dataValues.role !== "admin") {
        return res.status(403).json({ message: "Admin only." });
    }
    next();
}
