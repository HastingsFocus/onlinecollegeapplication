import express from "express";
import {
    registerStudent,
    loginUser,
    getCurrentUser,
    forgotPassword,
    resetPassword,
    activateLecturerAccount
} from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";


const router = express.Router();

router.post("/register", registerStudent);
router.post("/login", loginUser);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

router.post("/activate-account/:token", activateLecturerAccount);

router.get("/me", protect, getCurrentUser);

export default router;