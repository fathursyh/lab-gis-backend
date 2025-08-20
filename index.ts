import { Response, Request } from "express";
import authRoute from "./src/routes/authRoutes";
import userRoute from "./src/routes/userRoutes";
import adminRoute from "./src/routes/adminRoutes";
import eventRoute from "./src/routes/eventRoutes";
import registrationRoute from "./src/routes/registrationRoutes";
import paymentRoute from "./src/routes/paymentRoutes";
import rateLimit from "express-rate-limit";
import express from "express";
import "dotenv/config";
import cors from "cors";
import path from "path";
import multer from "multer";
import { randomUUID } from "crypto";
import { EventInterface } from "./src/interfaces/EventInterface";
import { Event } from "./src/models";
import QRCode from "qrcode";

const PORT = 3000;
const app = express();

// Express Body Parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
    cors({
        origin: "http://192.168.100.8:8081", // Allow requests from this origin
        credentials: true,
    })
);
app.use("/uploads", express.static(path.join(__dirname, "/uploads")));

app.use((err: any, _req: any, res: any, _next: any) => {
    if (err instanceof multer.MulterError) {
        return res.status(400).json({ message: err.message });
    } else if (err.message === "invalid-filetype") {
        return res.status(400).json({ message: "Only .jpg, .jpeg, and .png files are allowed!" });
    }
    return res.status(500).json({ message: "Internal server error" });
});

// Rate limiter middleware (100 requests per 15 minutes per IP)
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    standardHeaders: true,
    legacyHeaders: false,
    message: "Too many requests from this IP, please try again later.",
});

app.use(limiter);

app.use("/api/auth", authRoute);
app.use("/api/user", userRoute);
app.use("/api/event", eventRoute);
app.use("/api/registration", registrationRoute);
app.use("/api/payments", paymentRoute);
app.use("/api/admin-only", adminRoute);

app.get("/", (_: Request, res: Response) => {
    res.send("Hello, world!");
});

// ! temporary QR web
app.get("/:id", async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const event: EventInterface | null = await Event.findByPk(id);
        if (!event) return res.status(404).json({ message: "Event tidak ditemukan" });

        // Payload event id isinya
        const todayCode = randomUUID();
        const payload = JSON.stringify({ eventId: event.id, qrCode: todayCode, date: new Date() });
        event.currentCode = todayCode;
        const qr = await QRCode.toDataURL(payload, { width: 500 });
        await event.save();
        return res.send(
            `
          <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Image Page</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
      background: linear-gradient(135deg, #f0f4f8, #d9e4ec);
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
    }

    .container {
      text-align: center;
      background: white;
      padding: 30px;
      border-radius: 12px;
      box-shadow: 0 6px 15px rgba(0, 0, 0, 0.15);
      max-width: 400px;
    }

    p {
      font-size: 1.2rem;
      margin-bottom: 20px;
      color: #333;
    }

    img {
      max-width: 100%;
      height: auto;
      border-radius: 10px;
      transition: transform 0.3s ease;
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
    }

    img:hover {
      transform: scale(1.05);
    }
  </style>
  </head>
    <body>
      <div class="container">
        <p>${event.title}</p>
        <img src="${qr}" alt="Centered Example">
      </div>
    </body>
  </html>
          `
        );
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
