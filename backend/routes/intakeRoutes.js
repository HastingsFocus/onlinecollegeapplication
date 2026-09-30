import express from "express";

import {
  createIntake,
  getAllIntakes,
  getActiveIntake,
  getSingleIntake,
  updateIntake,
  publishIntake,
  closeIntake,
  archiveIntake,
} from "../controllers/intakeController.js";

import { protect } from "../middleware/authMiddleware.js";
import authorize from "../middleware/roleMiddleware.js";

const router = express.Router();

/*
|--------------------------------------------------------------------------
| Public Routes
|--------------------------------------------------------------------------
*/

// Students use this to check whether applications are open
router.get("/active", getActiveIntake);

/*
|--------------------------------------------------------------------------
| Lecturer Routes
|--------------------------------------------------------------------------
*/

// Create a new intake
router.post("/", protect, authorize("lecturer"), createIntake);

// Get all intakes
router.get("/", protect, authorize("lecturer"), getAllIntakes);

// Get a single intake
router.get("/:id", protect, authorize("lecturer"), getSingleIntake);

// Update a draft intake
router.put("/:id", protect, authorize("lecturer"), updateIntake);

// Publish an intake
router.patch("/:id/publish", protect, authorize("lecturer"), publishIntake);

// Close an intake
router.patch("/:id/close", protect, authorize("lecturer"), closeIntake);

// Archive an intake
router.patch("/:id/archive", protect, authorize("lecturer"), archiveIntake);

export default router;