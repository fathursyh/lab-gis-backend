import { Certification, Registration } from "../models"

export const certificationService = {
    createCertificate: async (eventId: string, registrationId: string) => {
        const count = await Certification.count({
            attributes: ['registrationId'],
            include: {
                model: Registration,
                as: 'registration',
                attributes: ['eventId', 'id'],
                where: {
                    eventId
                }
            },
        });
        const certificateNumber = `${count < 10 && '0'}${count < 100 && '0'}${count + 1}-iGIS-${eventId}`;
        const certificate = await Certification.create({
            certificateNumber,
            registrationId
        });
        return certificate;
    }
}