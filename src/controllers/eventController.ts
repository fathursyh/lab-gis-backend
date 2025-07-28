import { Request, Response } from "express";
import { Registration, Event, User } from "../models";
import { Op } from "sequelize";
import fs from "fs";
import path from "path";
import QRCode from "qrcode";
import { EventInterface } from "../interfaces/EventInterface";
import { RegistrationInterface } from "../interfaces/RegistrationInterface";

export const eventController = {
    // buat fetch semua
    getEvent: async (req: Request, res: Response) => {
        try {
            const page = parseInt((req.query.page as string) || "1", 10);
            const limit = parseInt((req.query.limit as string) || "10", 10);
            const search = (req.query.search as string) || "";
            const offset = (page - 1) * limit;

            // Filter logic
            const where = search
                ? {
                      [Op.or]: [{ name: { [Op.like]: `%${search}%` } }, { description: { [Op.like]: `%${search}%` } }],
                  }
                : {};

            const { rows, count } = await Event.findAndCountAll({
                where,
                limit,
                offset,
                order: [["createdAt", "DESC"]],
                attributes: ["id", "title", "description", "createdAt"],
            });

            return res.json({
                data: rows,
                pagination: {
                    total: count,
                    page,
                    limit,
                    totalPages: Math.ceil(count / limit),
                },
                hasMore: page * limit < count,
            });
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: "Internal server error" });
        }
    },
    // cek detail event
    detailEvent: async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const event : EventInterface | null = await Event.findOne({where: {id}});
            if (!event) {
                return res.status(404).json({message: 'Event tidak ditemukan'});
            }
            return res.json({
                event
            })
        } catch(err) {
            console.error(err);
            res.status(500).json({ message: "Internal server error" });
        }
    },
    // buat event baru
    newEvent: async (req: Request, res: Response) => {
        try {
            const { title, description, location, startDate, endDate, quota } = req.body;

            const banner = (req as any).file ? `/uploads/${(req as any).file.filename}` : null;

            const event = await Event.create({
                title,
                description,
                location,
                startDate,
                endDate,
                banner,
                quota,
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
            const { title, description, location, startDate, endDate, quota } = req.body;

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

            await event.update({ title, description, location, startDate, endDate, quota, banner });

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
            const userId = req.user;

            // 1. Pastikan event ada
            const event = await Event.findByPk(eventId);
            if (!event) return res.status(404).json({ message: "Event tidak ditemukan" });

            // 2. Cek apakah sudah daftar
            const alreadyRegistered = await Registration.findOne({
                where: { eventId, userId },
            });
            if (alreadyRegistered) return res.status(400).json({ message: "Sudah terdaftar" });

            // 3. Cek kuota
            const countRegistered = await Registration.count({ where: { eventId } });
            if (countRegistered >= (event as any).quota) return res.status(400).json({ message: "Quota penuh" });

            // 4. Buat registrasi
            const registration = await Registration.create({
                eventId,
                userId,
            });

            return res.status(201).json({
                message: "Registrasi sukses",
                registration,
            });
        } catch (error) {
            console.error(error);
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
            const payload = JSON.stringify({ eventId: event.id });
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
            const userId = req.user;

            const registration: RegistrationInterface | null = await Registration.findOne({ where: { eventId: id, userId } });
            if (!registration) return res.status(404).json({ message: "Event tidak ada" });

            if (registration.status === "checked-in") {
                return res.status(400).json({ message: "Presensi sudah didata" });
            }
            if (registration.status === "cancelled") {
                return res.status(400).json({ message: "Registrasi sudah dibatalkan" });
            }

            registration.status = "checked-in";
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
                include: { model: User, attributes: ["id", "fullName", "email"], as: 'user' },
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
