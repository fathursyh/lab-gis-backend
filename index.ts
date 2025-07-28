import { Response, Request } from "express";
import authRoute from "./src/routes/authRoutes";
import userRoute from "./src/routes/userRoutes";
import adminRoute from "./src/routes/adminRoutes";
import eventRoute from "./src/routes/eventRoutes";
import rateLimit from 'express-rate-limit';
import express from 'express'
import 'dotenv/config';
import cors from 'cors';
import path from "path";
import multer from "multer";

const PORT = 3000;
const app = express();

// Express Body Parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: 'http://192.168.100.8:8081', // Allow requests from this origin
    credentials: true
}));
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

app.use((err: any, _req: any, res: any, _next: any) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ message: err.message });
  } else if (err.message === 'invalid-filetype') {
    return res.status(400).json({ message: 'Only .jpg, .jpeg, and .png files are allowed!' });
  }
  return res.status(500).json({ message: 'Internal server error' });
});

// Rate limiter middleware (100 requests per 15 minutes per IP)
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    standardHeaders: true,
    legacyHeaders: false,
    message: 'Too many requests from this IP, please try again later.',
});

app.use(limiter);

app.use('/api/auth', authRoute);
app.use('/api/user', userRoute);
app.use('/api/event', eventRoute);
app.use('/api/admin-only', adminRoute);

app.get('/', (_: Request, res: Response) => {
    res.send('Hello, world!');
});

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
