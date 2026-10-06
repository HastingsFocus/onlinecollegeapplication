import dotenv from "dotenv";

dotenv.config();

console.log("EMAIL CONFIG:", {
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    user: process.env.EMAIL_USER,
    hasPassword: !!process.env.EMAIL_PASS
});

import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import connectDB from "./config/db.js";
import "./jobs/applicationReminderJob.js";

import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import programRoutes from "./routes/programRoutes.js";
import studentRoutes from "./routes/studentRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import intakeRoutes from "./routes/intakeRoutes.js";
import admissionRoutes from "./routes/admissionsRoutes.js";
import studentRegistryRoutes from "./routes/studentRegistryRoutes.js";

connectDB();

const app = express();

app.use((req, res, next) => {
    console.log("REQUEST:", req.method, req.originalUrl);
    next();
});

app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/programs", programRoutes);
app.use("/api/student", studentRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/intakes", intakeRoutes);
app.use("/api/admissions", admissionRoutes);
app.use("/api/students", studentRegistryRoutes);

app.get("/", (req, res) => {
    res.json({
        message: "Online College Application API Running"
    });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});