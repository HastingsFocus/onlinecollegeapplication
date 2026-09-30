import express from "express";
import {
  getApplicationsByIntake,
  getApplicationDetails,
  reviewApplication,
  acceptApplication,
  rejectApplication,
  getIntakeStatistics
} from "../controllers/admissionController.js";
import { protect } from "../middleware/authMiddleware.js";
import authorize from "../middleware/roleMiddleware.js";

const router = express.Router();

router.get(
  "/intakes/:intakeId/statistics",
  protect,
  authorize("lecturer"),
  getIntakeStatistics
);

router.get(
  "/intakes/:intakeId/applications",
  protect,
  authorize("lecturer"),
  getApplicationsByIntake
);

router.get(
  "/applications/:id",
  protect,
  authorize("lecturer"),
  getApplicationDetails
);

router.patch(
  "/applications/:id/review",
  protect,
  authorize("lecturer"),
  reviewApplication
);

router.patch(
  "/applications/:id/accept",
  protect,
  authorize("lecturer"),
  acceptApplication
);

router.patch(
  "/applications/:id/reject",
  protect,
  authorize("lecturer"),
  rejectApplication
);

export default router;