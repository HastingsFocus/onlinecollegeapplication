import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import authorize from "../middleware/roleMiddleware.js";
import {
    createLecturer,
    getLecturers,
    getLecturerById,
    disableLecturer,
    enableLecturer
} from "../controllers/userController.js";

const router = express.Router();

router.post("/lecturers", protect, authorize("admin"), createLecturer);
router.get("/lecturers", protect, authorize("admin"), getLecturers);
router.get("/lecturers/:id", protect, authorize("admin"), getLecturerById);
router.patch("/lecturers/:id/disable", protect, authorize("admin"), disableLecturer);
router.patch("/lecturers/:id/enable", protect, authorize("admin"), enableLecturer);

export default router;