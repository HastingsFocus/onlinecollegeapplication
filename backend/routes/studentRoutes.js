import express from "express";
import {
  createApplication,
  getMyApplication,
  updatePersonalInfo,
  updateContactInfo,
  updateNextOfKin,
  updateAcademicInfo,
  selectPrograms,
  uploadDocuments,
  submitApplication
} from "../controllers/studentController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/application", protect, createApplication);
router.get("/application", protect, getMyApplication);
router.put("/application/personal", protect, updatePersonalInfo);
router.put("/application/contact", protect, updateContactInfo);
router.put("/application/next-of-kin", protect, updateNextOfKin);
router.put("/application/academic", protect, updateAcademicInfo);
router.put("/application/programs", protect, selectPrograms);
router.put("/application/documents", protect, uploadDocuments);
router.put("/application/submit", protect, submitApplication);

export default router;