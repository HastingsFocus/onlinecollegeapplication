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
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.post("/application", protect, createApplication);
router.get("/application", protect, getMyApplication);
router.put("/application/personal", protect, updatePersonalInfo);
router.put("/application/contact", protect, updateContactInfo);
router.put("/application/next-of-kin", protect, updateNextOfKin);
router.put("/application/academic", protect, updateAcademicInfo);
router.put("/application/programs", protect, selectPrograms);
router.put("/application/submit", protect, submitApplication);
router.put(
  "/application/documents",
  protect,

  // Start timing as soon as the request reaches Express
  (req, res, next) => {
    console.log("✅ Route reached");
    console.time("UPLOAD");
    next();
  },

  // Multer uploads the files to Cloudinary here
  upload.array("documents"),

  // This runs only after Cloudinary has finished uploading
  (req, res, next) => {
    console.log("✅ Multer finished");
    console.timeLog("UPLOAD", "Cloudinary finished");
    next();
  },

  // Your controller
  uploadDocuments
);

export default router;