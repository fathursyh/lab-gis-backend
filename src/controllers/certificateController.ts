import { Request, Response } from "express";
import { certificationService } from "../services/certificationService";
import { Certification, Event, Registration, User } from "../models";

export const certificateController = {
    generateCertificatePDF: async (req: Request, res: Response) => {
        try {
            const { certificateNumber } = req.params;
            const certificate: any = await Certification.findOne({
                where: { certificateNumber },
                include: {
                    model: Registration,
                    as: 'registration',
                    attributes: ["userId", "eventId", "status"],
                    include: [
                        {
                            model: User,
                            as: "user",
                            attributes: ["fullName"],
                        },
                        {
                            model: Event,
                            as: "event",
                            attributes: ["id", "title", "mentor"],
                        },
                    ],
                },
            });

            if (!certificate) return res.sendStatus(404);
            if (certificate?.registration.status !== "passed") return res.sendStatus(403)

            const pdfBuffer = await certificationService.generateCertificate(certificate);

            res.setHeader("Content-Type", "application/pdf");
            res.setHeader("Content-Disposition", `inline; filename="certificate-keren1.pdf"`);
            res.end(pdfBuffer);
        } catch (err) {
            console.log(err);
            res.status(500).json({ message: "Internal server error." });
        }
    },
    getAllUserCertificates: async (req: Request, res: Response) => {
        try {
            const {id} = req.user as any;
            const {rows, count} = await certificationService.getUserCertificates(id);
            return res.status(200).json({count, data: rows});

        } catch(err) {
            return res.status(500).json({message: 'Internal server error'});
        }
    }
};
