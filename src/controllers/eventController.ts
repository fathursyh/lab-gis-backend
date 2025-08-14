import { Request, Response } from "express";
import { Registration, Event, User } from "../models";
import { Op, Sequelize } from "sequelize";
import fs from "fs";
import path from "path";
import QRCode from "qrcode";
import { EventInterface } from "../interfaces/EventInterface";
import { RegistrationInterface } from "../interfaces/RegistrationInterface";
import { dbService } from "../services/dbService";
import { randomUUID } from "crypto";
import dayjs from "dayjs";
import { paymentService } from "../services/paymentService";

const eventAttributes = ["id", "title", "description", "mentor", "price", "banner", "quota", "location", "startDate", "endDate", "createdAt"];

export const eventController = {
    // buat fetch semua
    getEvent: async (req: Request, res: Response) => {
        try {
            const page = parseInt((req.query.page as string) || "1", 10);
            const search = (req.query.search as string) || "";
            const limit = 10;
            const offset = (page - 1) * limit;
            const where = search
                ? {
                      [Op.or]: [
                          Sequelize.where(Sequelize.fn("LOWER", Sequelize.col("title")), { [Op.like]: `%${search.toLowerCase()}%` }),
                          Sequelize.where(Sequelize.fn("LOWER", Sequelize.col("mentor")), { [Op.like]: `%${search.toLowerCase()}%` }),
                      ],
                  }
                : {};
            const params = { where, limit, offset, order: [["createdAt", "DESC"]], attributes: eventAttributes, page };

            // start fetching
            const result = await dbService.findAllFromDb(params, Event);

            return res.json(result);
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: "Internal server error" });
        }
    },
    // get all event tapi tandain yg beres
    getEventTagged: async (req: Request, res: Response) => {
         try {
            const {id: userId} = req.user as any;
            const page = parseInt((req.query.page as string) || "1", 10);
            const search = (req.query.search as string) || "";
            const limit = 10;
            const offset = (page - 1) * limit;
            const where = search
                ? {
                      [Op.or]: [
                          Sequelize.where(Sequelize.fn("LOWER", Sequelize.col("title")), { [Op.like]: `%${search.toLowerCase()}%` }),
                          Sequelize.where(Sequelize.fn("LOWER", Sequelize.col("mentor")), { [Op.like]: `%${search.toLowerCase()}%` }),
                      ],
                  }
                : {};
            const params = { where, limit, offset, order: [["createdAt", "DESC"]], attributes: eventAttributes, page, includeModel: Registration, includeAttributes: ['status'], alias: 'registrations', includeWhere: {userId: userId}, innerJoin: false };

            // start fetching
            const result = await dbService.findAllFromDb(params, Event);

            return res.json(result);
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: "Internal server error" });
        }
    },
    // buat get event based on registration milik user
    getUserEvent: async (req: Request, res: Response) => {
        try {
            const {id: userId} = req.user as any
            const page = parseInt((req.query.page as string) || "1", 10);
            const search = (req.query.search as string) || "";
            const limit = 10;
            const offset = (page - 1) * limit;
            const where = search
                ? {
                      [Op.and]: [
                          {
                              [Op.or]: [
                                  Sequelize.where(Sequelize.fn("LOWER", Sequelize.col("event.title")), { [Op.like]: `%${search.toLowerCase()}%` }),
                                  Sequelize.where(Sequelize.fn("LOWER", Sequelize.col("event.mentor")), { [Op.like]: `%${search.toLowerCase()}%` }),
                              ],
                          },
                          {
                            userId
                          }
                      ],
                  }
                : {
                    userId
                };
            const params = { where, limit, offset, order: [["registeredAt", "DESC"]], attributes: ['status'], page, includeModel: Event, includeAttributes: eventAttributes, alias: 'event' };

            // start fetching
            const result = await dbService.findAllFromDb(params, Registration);

            return res.json(result);
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: "Internal server error" });
        }
    },
    // cek detail event
    detailEvent: async (req: Request, res: Response) => {
        console.log("fetching");
        try {
            const { id } = req.params;
            const event: EventInterface | null = await Event.findOne({ where: { id } });
            if (!event) {
                return res.status(404).json({ message: "Event tidak ditemukan" });
            }
            return res.json(event);
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: "Internal server error" });
        }
    },
    // buat event baru
    newEvent: async (req: Request, res: Response) => {
        try {
            const { title, description, location, startDate, endDate, quota, mentor, price } = req.body;

            const banner = req.file ? `/uploads/${req.file.filename}` : null;

            const event = await Event.create({
                title,
                description,
                location,
                mentor,
                startDate,
                endDate,
                banner,
                quota,
                price,
            });

            return res.status(201).json({
                message: "Event berhasil dibuat!",
                event,
            });
        } catch (e: any) {
            console.log(e);
            return res.status(500).json({ message: "Internal server error" });
        }
    },
    // update event
    updateEvent: async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const { title, description, location, mentor, startDate, endDate, quota, price } = req.body;

            const event = await Event.findByPk(id);
            if (!event) return res.status(404).json({ message: "Event tidak ditemukan" });
            let banner = (event as any).banner;
            if ((req as any).file) {
                if (banner) {
                    const oldPath = path.join(__dirname, "../..", banner);
                    if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
                }
                banner = `/uploads/${(req as any).file.filename}`;
            }

            await event.update({ title, description, mentor, location, startDate, endDate, quota, banner, price });

            return res.json({ message: "Event berhasil diubah", event });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Internal server error" });
        }
    },
    // hapus event
    deleteEvent: async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const event = await Event.findByPk(id);

            if (!event) return res.status(404).json({ message: "Event not found" });

            if ((event as any).banner) {
                const oldPath = path.join(__dirname, "../..", (event as any).banner);
                if (fs.existsSync(oldPath)) {
                    fs.unlink(oldPath, (err) => {
                        if (err) console.error("Error menghapus file", err);
                    });
                }
            }

            await event.destroy();
            return res.json({ message: "Event deleted successfully" });
        } catch (err) {
            console.error(err);
            return res.status(500).json({ message: "Internal server error" });
        }
    },
    // buat register
    registerEvent: async (req: Request, res: Response) => {
        try {
            const eventId = req.params.id;
            const user = req.user as any;

            // 1. Pastikan event ada
            const event = await Event.findByPk(eventId);
            if (!event) return res.status(404).json({ message: "Event tidak ditemukan" });

            // 2. Cek apakah sudah daftar
            const alreadyRegistered = await Registration.findOne({
                where: { eventId, userId: user.id },
            });
            if (alreadyRegistered) return res.status(400).json({ message: "Sudah terdaftar" });

            // 3. Cek kuota
            const countRegistered = await Registration.count({ where: { eventId } });
            if (countRegistered >= (event as any).quota) return res.status(400).json({ message: "Quota penuh" });

            // 4. Buat registrasi
            const today = new Date();
            const orderId = `order-gis-${eventId.slice(0, 6)}-${today.getMonth()}${today.getFullYear()}-${today.getMilliseconds()}`;
            
            const payment = await paymentService.requestPaymentLink(event, user, orderId);

            await Registration.create({
                eventId,
                userId: user.id,
                paymentId: orderId,
                paymentLink: payment.data.payment_url
            });


            return res.status(200).json({
                message: "Registrasi sukses",
                paymentLink: payment.data.payment_url,
            });
        } catch (error: any) {
            console.error(error.response);
            return res.status(500).json({ message: "Internal server error" });
        }
    },
    // bikin code qr
    generateEventQR: async (req: Request, res: Response) => {
        try {
            const { id } = req.params; // eventId
            const event: EventInterface | null = await Event.findByPk(id);
            if (!event) return res.status(404).json({ message: "Event tidak ditemukan" });

            // Payload event id isinya
            const payload = JSON.stringify({ eventId: event.id, qrCode: randomUUID(), date: new Date() });
            const qr = await QRCode.toDataURL(payload);

            return res.json({ qrCode: qr });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Internal server error" });
        }
    },
    // buat absensi
    markAttendance: async (req: Request, res: Response) => {
        try {
            const { id } = req.params; // eventId
            const { qrCode, date } = req.body;
            const { id: userId } = req.user as any;

            const isValidDate = dayjs(new Date()).diff(date ?? null, "d") === 0;

            if (!isValidDate) return res.status(400).json({ message: "QR kadaluarsa" });

            const eventDuration = await Event.findOne({ where: { id }, attributes: ["startDate", "endDate"] }).then((data: EventInterface | null) => data?.duration);

            if (!eventDuration) return res.status(404).json({ message: "Event tidak ditemukan" });

            const registration: RegistrationInterface | null = await Registration.findOne({ where: { eventId: id, userId, status: { [Op.not]: "passed" } } });

            if (!registration) return res.status(404).json({ message: "Data registrasi tidak ada" });

            if (registration.lastQR === qrCode) {
                return res.status(400).json({ message: "Presensi hari ini sudah tercatat." });
            }

            if (registration.status === "registered") {
                if (registration.payments === "UNPAID") {
                    const paymentCheck = await paymentService.checkPayment(registration.paymentId!);
                    if (!paymentCheck.paid) return res.status(400).json({ message: "Pembayaran belum selesai" });
                    registration.paymentId = paymentCheck.orderId;
                    registration.payments = "PAID";
                }
                registration.status = "checked-in";
            }

            registration.attendance = registration.attendance! + 1;
            registration.lastQR = qrCode;

            if (registration.attendance === eventDuration) {
                registration.status = "passed";
            }

            await registration.save();

            return res.json({
                message: "Presensi berhasil dicatat",
                registration: {
                    id: registration.id,
                    status: registration.status,
                    eventId: registration.eventId,
                    userId: registration.userId,
                },
            });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Internal server error" });
        }
    },
    // cek peserta yang ikut
    checkAttendees: async (req: Request, res: Response) => {
        try {
            const { id } = req.params;

            // Validasi event
            const event = await Event.findByPk(id, { attributes: ["id", "title"] });
            if (!event) return res.status(404).json({ message: "Event tidak ditemukan" });

            // Ambil registrasi + user
            const attendees = await Registration.findAll({
                where: { eventId: id },
                attributes: ["id", "status", "registeredAt"],
                include: { model: User, attributes: ["id", "fullName", "email"], as: "user" },
            });

            return res.json({
                event,
                attendees,
            });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Internal server error" });
        }
    },
};
