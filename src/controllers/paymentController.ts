import { Request, Response } from "express";
import { paymentService } from "../services/paymentService";

export const paymentController = {
    checkPayment: async (req: Request, res: Response) => {
        try {
            const { registrationId } = req.body;
            const paymentCheck = await paymentService.checkPayment(registrationId);
            if (!paymentCheck) return res.status(400).json({ message: "Pembayaran belum selesai" });
            res.status(200).json({ message: 'Pembayaran selesai' });

        } catch (err) {
            return res.status(500).json({ message: 'Internal server error' });
        }

    }
}