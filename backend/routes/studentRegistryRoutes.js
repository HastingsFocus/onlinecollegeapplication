import express from "express";
import {
  getAcceptedStudents,
  registerStudent,
  getRegisteredStudents,
  getStudentById,
  getRegistrationPreview,
  generateRegistrationNumbers,
  updateStudentStatus,
  getStudentStatistics
} from "../controllers/studentRegistryController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

const adminOrLecturer = (req, res, next) => {
  if (req.user.role !== "admin" && req.user.role !== "lecturer") {
    return res.status(403).json({
      message: "Access denied. Admin or lecturer access required."
    });
  }
  next();
};

router.get("/statistics", protect, adminOrLecturer, getStudentStatistics);
router.get("/accepted", protect, adminOrLecturer, getAcceptedStudents);
router.get("/registration-preview", protect, adminOrLecturer, getRegistrationPreview);
router.post("/generate-registration-numbers", protect, adminOrLecturer, generateRegistrationNumbers);
router.post("/:applicationId/register", protect, adminOrLecturer, registerStudent);
router.get("/", protect, adminOrLecturer, getRegisteredStudents);
router.get("/:id", protect, adminOrLecturer, getStudentById);
router.patch("/:id/status", protect, adminOrLecturer, updateStudentStatus);

export default router;