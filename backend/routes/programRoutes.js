import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import authorize from "../middleware/roleMiddleware.js";
import {
    createProgram,
    getPrograms,
    getProgramById,
    updateProgram,
    deleteProgram
} from "../controllers/programController.js";

const router = express.Router();

// lecturer creates
router.post("/", protect, authorize("lecturer"), createProgram);

// everyone can view programs
router.get("/", protect, getPrograms);
router.get("/:id", protect, getProgramById);

router.put("/:id", protect, authorize("lecturer"), updateProgram);
router.delete("/:id", protect, authorize("lecturer"), deleteProgram);

export default router;