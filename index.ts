import { Response, Request } from "express";
import authRoute from "./src/routes/authRoutes";
import userRoute from "./src/routes/userRoutes";
import 'dotenv/config';
const express = require('express');
const rateLimit = require('express-rate-limit');
const app = express();
const PORT = 3000;

// Express Body Parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiter middleware (100 requests per 15 minutes per IP)
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    standardHeaders: true,
    legacyHeaders: false,
    message: 'Too many requests from this IP, please try again later.',
});

app.use(limiter); // apply to all requests

app.use('/api/auth', authRoute);
app.use('/api/user', userRoute);

app.get('/', (_: Request, res: Response) => {
    res.send('Hello, world!');
});

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
