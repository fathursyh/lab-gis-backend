import { Request, Response, Router } from "express";
import passport from "passport";
import { Payment, Registration } from "../models";

const router = Router({ strict: true })
.use(passport.authenticate("jwt", { session: false }));

router.get("/getRegistration/:eventId", async (req: Request, res: Response) => {
    try {
        const { id: userId } = req.user as any;
        const { eventId } = req.params;
        const registration = await Registration.findOne({
            where: { userId, eventId },
            include: {
                model: Payment,
                attributes: ["paymentLink", "payments"],
                isSingleAssociation: true,
            },
        });
        if (!registration) return res.status(404).json({ message: "Registrasi tidak ditemukan" });
        return res.status(200).json(registration);
    } catch (err: any) {
        console.error(err.response);
        return res.status(500).json({ message: "Internal server error" });
    }
});

export default router;
