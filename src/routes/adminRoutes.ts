import { Router, Response, Request } from "express";
import passport from "passport";
import { checkAdmin } from "../middlewares/checkAdmin";
import { Event, Payment, User } from "../models";
import { Op, Sequelize } from "sequelize";

const router = Router({ strict: true })
.use(passport.authenticate("jwt", { session: false }))
.use(checkAdmin);

router.patch("/change-role", async (req: Request, res: Response) => {
    const { id, role } = req.body;
    try {
        await User.update({ role: role }, { where: { id: id } });
        return res.status(200).json({ message: "User role has been updated." });
    } catch (e) {
        res.status(400).json({ error: "Request has failed." });
    }
});

router.get("/dashboard", async (_: Request, res: Response) => {
    try {
        const totalUsers = await User.count({ attributes: ["role"], where: { role: "member" } });
        const totalPayments = await Payment.count({ attributes: [], where: { payments: "PAID" } });
        const totalEvents = await Event.count({ attributes: [] });
        const activeEvents = await Event.count({
            attributes: ["endDate"],
            where: {
                endDate: {
                    [Op.gte]: Sequelize.fn("CURDATE"),
                },
            },
        });

        return res.json({
            totalEvents,
            totalPayments,
            totalUsers,
            activeEvents,
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Internal server error." });
    }
});

export default router;
