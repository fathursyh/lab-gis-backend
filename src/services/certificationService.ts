import { Certification, Registration } from "../models";
import puppeteer from "puppeteer";
import fs from "fs";
import ejs from "ejs";

import path from "path";
import dayjs from "dayjs";
export const certificationService = {
    createCertificate: async (eventId: string, registrationId: string) => {
        const count = await Certification.count({
            attributes: ["registrationId"],
            include: {
                model: Registration,
                as: "registration",
                attributes: ["eventId", "id"],
                where: {
                    eventId,
                },
            },
        });
        const certificateNumber = `${count < 10 && "0"}${count < 100 && "0"}${count + 1}-iGIS-${eventId}`;
        const certificate = await Certification.create({
            certificateNumber,
            registrationId,
        });
        return certificate;
    },
    generateCertificate: async (certificate: any) => {
        // buat render logo
        const logoPath = path.join(process.cwd(), "public", "gis-logo.jpeg");
        const logoBase64 = fs.readFileSync(logoPath, { encoding: "base64" });
        const logoDataUri = `data:image/jpeg;base64,${logoBase64}`;

        // susun data
        const data = {
            name: certificate.registration.user.fullName,
            course: certificate.registration.event.title,
            date: dayjs(certificate.registration?.updatedAt).format("DD-MM-YYYY"),
            certificateNumber: "001-GIS-202141",
            instructor: certificate.registration.event.mentor,
            logo: logoDataUri,
        };

        const html = await ejs.renderFile("views/certificate.ejs", data);

        // Convert HTML -> PDF pakai Puppeteer
        const browser = await puppeteer.launch({ headless: true });
        const page = await browser.newPage();
        await page.setContent(html, { waitUntil: "networkidle0" });
        const pdfBuffer = await page.pdf({ format: "A4", printBackground: true, landscape: true, margin: { top: 0, right: 0, bottom: 0, left: 0 } });
        await browser.close();
        return pdfBuffer;
    },
};
