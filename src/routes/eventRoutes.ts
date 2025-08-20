import { Router } from "express";
import passport from "passport";
import { eventController } from "../controllers/eventController";
import { upload } from "../middlewares/upload";
import { checkAdmin } from "../middlewares/checkAdmin";

const router = Router({ strict: true })
.use(passport.authenticate("jwt", { session: false }));

// * fetch semua event
router.get('/', eventController.getEvent);

router.get('/five-banners', eventController.getFiveBanners);

// * fetch semua event tagged user
router.get('/event', eventController.getEventTagged)

// * fetch event dalam registrasi user
router.get('/user-event', eventController.getUserEvent);

// * show event
router.get('/detail/:id', eventController.detailEvent);

// * register event
router.post("/:id/register", eventController.registerEvent);

// * buat absen event
router.post('/mark-attendance', eventController.markAttendance);

/* ADMIN ONLY ROUTES */
router.use(checkAdmin);

// * buat event
router.post('/store', upload.single('banner'), eventController.newEvent)

// * update event
router.put("/:id", upload.single('banner'), eventController.updateEvent)

// * delete event
router.delete("/:id", eventController.deleteEvent);

// * cek peserta per event
router.get('/:id/attendees', eventController.checkAttendees);

// * buat generate QR
router.get('/:id/generate-qr', eventController.generateEventQR);

export default router;
