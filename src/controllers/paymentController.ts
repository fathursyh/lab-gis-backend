import { Request, Response } from "express";
import { Registration } from "../models";
import { RegistrationInterface } from "../interfaces/RegistrationInterface";
import { paymentService } from "../services/paymentService";

export const paymentController = {
    checkPayment: async (req: Request, res: Response) => {
        try {
            const { registrationId } = req.body;
            const registration: RegistrationInterface | null = await Registration.findByPk(registrationId);
            if (!registration) return res.status(404).json({ message: 'Registrasi tidak ditemukan' });
            const paymentCheck = await paymentService.checkPayment(registration.paymentId!);
            if (!paymentCheck.paid) return res.status(400).json({ message: "Pembayaran belum selesai" });
            registration.paymentId = paymentCheck.orderId;
            registration.payments = "PAID";
            registration.save();
            res.status(200).json({ message: 'Pembayaran selesai' });

        } catch (err) {
            return res.status(500).json({ message: 'Internal server error' });
        }

    }
}