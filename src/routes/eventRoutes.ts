import { Router } from "express";
import passport from "passport";
import { eventController } from "../controllers/eventController";
import { upload } from "../middlewares/upload";

const router = Router({ strict: true }).use(passport.authenticate("jwt", { session: false }));

// * fetch semua event
router.get('/', eventController.getEvent);

// * buat event
router.post('/store', upload.single('banner'), eventController.newEvent)

// * update event
router.put("/:id", upload.single('banner'), eventController.updateEvent)

// * delete event
router.delete("/:id", eventController.deleteEvent);

// * register event
router.post("/:id/register", eventController.registerEvent);

export default router;