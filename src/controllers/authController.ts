import { Response, Request } from "express";
import emailValidator from "node-email-verifier";
import { User } from "../models";
import jwt from "jsonwebtoken";
import "dotenv/config";

const SECRET: string = process.env.TOKEN_KEY!;

export const authController = {
    // logic register
    register: async (req: Request, res: Response) => {
        const { email, fullName, password } = req.body;
        try {
            const isValidEmail = await emailValidator(email.split("@")[1], { checkMx: true, timeout: 5000 });
            if (isValidEmail) {
                throw Error();
            }
            const findUser = await User.findOne({ where: { email: email } });
            if (findUser) {
                return res.sendStatus(400);
            }
            const user = await User.create({ email, fullName, password });
            const token = jwt.sign({ id: user.dataValues.id, email: user.dataValues.email, fullName: user.dataValues.fullName }, SECRET, {
                expiresIn: "7d",
            });
            return res.json({ token, user });
        } catch (e) {
            return res.sendStatus(400);
        }
    },
    // logic login
    login: (req: Request, res: Response) => {
        const user: any = req.user;
        const token = jwt.sign({ id: user.id, email: user.email, fullName: user.fullName }, SECRET, {
            expiresIn: "7d",
        });
        delete user.password;
        return res.json({ token, user });
    },
};
