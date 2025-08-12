import { Request, Response } from "express";

import { Event } from "../models";
import { EventInterface } from "../interfaces/EventInterface";
import { paymentService } from "../services/paymentService";

export const paymentController = {
    generatePayment: async (req: Request, res: Response) => {
        try {
            const { eventId, userDetail, orderId } = req.body;

            const event: EventInterface | null = await Event.findByPk(eventId, {
                attributes: ['id', 'title', 'price'],
            })

            if (!event) {
                res.status(404).json({ message: "Event tidak ditemukan" });
            }

            const response = await paymentService.requestPaymentLink(event!, userDetail, orderId);
            
            res.json({
                paymentLink: response.data.payment_url
            });

        } catch (err) {
            console.log((err as any).response);
            res.status(500).json({ message: 'Internal server error' })
        }
    },
    checkPayment: async (req: Request, res: Response) => {
        try {
            const { orderId } = req.body;
            const payment = await paymentService.checkPayment(orderId);

            res.json(payment)
        } catch (err) {
            res.status(500).json({ message: 'Internal server error' })

        }
    }
}