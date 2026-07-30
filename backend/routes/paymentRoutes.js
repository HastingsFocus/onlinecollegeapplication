import express from "express";

import {
  initiatePayment,
  handleWebhook,
  getPaymentStatus,
  getMyPayments,
  getAllPayments,
  getPaymentById,
  testOperators
} from "../controllers/paymentController.js";

import { protect } from "../middleware/authMiddleware.js";
import authorize from "../middleware/roleMiddleware.js";


const router = express.Router();


// ===============================
// Student Payment Routes
// ===============================


// Initiate payment
router.post(
  "/initiate",
  protect,
  initiatePayment
);


// Student payment history
router.get(
  "/my-payments",
  protect,
  getMyPayments
);


// Check payment status
router.get(
  "/status/:applicationId",
  protect,
  getPaymentStatus
);



// ===============================
// PayChangu Webhook
// ===============================

// PayChangu calls this endpoint
// No protect middleware here
router.post(
  "/webhook",
  handleWebhook
);



// ===============================
// Admin Payment Routes
// ===============================


// View all payments
router.get(
  "/",
  protect,
  authorize("admin"),
  getAllPayments
);


// View one payment
router.get(
  "/:id",
  protect,
  getPaymentById
);



// Test supported operators
router.get(
    "/test/operators",
    testOperators
);



export default router;