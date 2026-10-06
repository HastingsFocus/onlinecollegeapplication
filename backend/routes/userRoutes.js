import express from "express";

import { protect } from "../middleware/authMiddleware.js";
import authorize from "../middleware/roleMiddleware.js";
import {
  createLecturer,
  getLecturers,
  getLecturerById,
  disableLecturer,
  enableLecturer,
  getUsers,
getUserById

} from "../controllers/userController.js";

const router = express.Router();

const adminOnly = [protect, authorize("admin")];

// Admin User Directory
router.get("/", ...adminOnly, getUsers);
router.get("/:id", ...adminOnly, getUserById);
// Lecturer Management
router.post("/lecturers", ...adminOnly, createLecturer);
router.get("/lecturers", ...adminOnly, getLecturers);
router.get("/lecturers/:id", ...adminOnly, getLecturerById);

router.patch("/lecturers/:id/disable", ...adminOnly, disableLecturer);
router.patch("/lecturers/:id/enable", ...adminOnly, enableLecturer);

export default router;