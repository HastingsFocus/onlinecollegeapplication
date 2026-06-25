import express from "express";
import {
    createApplication,
    getMyApplication,
    updatePersonalInfo,
    updateAcademicInfo,
    selectPrograms,
    submitApplication
} from "../controllers/studentController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

/*
================================
STUDENT APPLICATION ROUTES
================================
*/
// Create application
router.post("/application", protect, createApplication);

// Get my application
router.get("/application", protect, getMyApplication);

// Update personal information
router.put("/application/personal", protect, updatePersonalInfo);

// Update academic information
router.put("/application/academic", protect, updateAcademicInfo);

// Select programs
router.put("/application/programs", protect, selectPrograms);

// Submit application
router.put("/application/submit", protect, submitApplication);

export default router;