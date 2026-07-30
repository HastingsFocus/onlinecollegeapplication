import asyncHandler from "express-async-handler";

import Payment from "../models/Payment.js";
import StudentApplication from "../models/StudentApplication.js";

import PAYMENT_STATUS from "../constants/paymentStatus.js";

import * as payChanguService from "../services/payChanguService.js";

/**
 * @desc    Initiate Payment
 * @route   POST /api/payments/initiate
 * @access  Private (Student)
 */
export const initiatePayment = asyncHandler(async (req, res) => {
  const { applicationId, gateway, method, phoneNumber } = req.body;

  if (!applicationId || !gateway || !method || !phoneNumber) {
    res.status(400);
    throw new Error("Please provide all required payment details.");
  }

  // ===========================================
  // Find application
  // ===========================================

  const application = await StudentApplication.findById(applicationId);

  if (!application) {
    res.status(404);
    throw new Error("Application not found.");
  }

  // ===========================================
  // Ensure application belongs to logged-in user
  // ===========================================

  if (application.userId.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error(
      "You are not authorized to pay for this application."
    );
  }

  // ===========================================
  // Prevent duplicate successful payments
  // ===========================================

  const existingPayment = await Payment.findOne({
    application: applicationId,
    status: PAYMENT_STATUS.SUCCESSFUL,
  });

  if (existingPayment) {
    res.status(400);
    throw new Error(
      "This application has already been paid for."
    );
  }

  // ===========================================
  // Get supported operators from PayChangu
  // ===========================================

  const operatorsResponse =
    await payChanguService.getSupportedOperators();

  const operator = operatorsResponse.data.find(
    (item) => item.name === method
  );

  if (!operator) {
    res.status(400);
    throw new Error("Unsupported payment method.");
  }

  // ===========================================
  // Temporary application fee
  // Replace with system settings later
  // ===========================================

  const applicationFee = 25000;

  // ===========================================
  // Create pending payment
  // ===========================================

  const payment = await Payment.create({
    student: req.user._id,
    application: applicationId,
    amount: applicationFee,
    currency: "MWK",
    gateway,
    method,
    phoneNumber,
    status: PAYMENT_STATUS.PENDING,
  });

  // ===========================================
  // Initiate payment with PayChangu
  // ===========================================

  const gatewayResponse =
    await payChanguService.initiatePayment({

      chargeId: payment._id.toString(),

      operatorRefId: operator.ref_id,

      phoneNumber,

      amount: payment.amount,

      email: application.contactInfo.email,

      firstName: application.personalInfo.firstName,

      lastName: application.personalInfo.lastName,

    });

  console.log("Gateway Response:");
  console.log(gatewayResponse);

 // ===========================================
// Save gateway response
// ===========================================

payment.gatewayReference =
  gatewayResponse?.data?.charge_id ||
  gatewayResponse?.charge_id ||
  null;

payment.transactionId =
  gatewayResponse?.data?.ref_id ||
  null;

// ===========================================
// SANDBOX MODE
// Automatically mark payment as successful
// ===========================================

if (
  process.env.PAYCHANGU_MODE === "sandbox" &&
  gatewayResponse.status === "success"
) {
  payment.status = PAYMENT_STATUS.SUCCESSFUL;
  payment.paidAt = new Date();

  // Link payment to application
  application.payment = payment._id;

  // Update application payment status
  application.paymentStatus = PAYMENT_STATUS.SUCCESSFUL;

  await application.save();
} else {
  // Production: payment is still pending until webhook confirms it
  application.payment = payment._id;
  application.paymentStatus = PAYMENT_STATUS.PENDING;

  await application.save();
}

await payment.save();

// ===========================================
// Response
// ===========================================

res.status(201).json({
  success: true,
  sandbox: process.env.PAYCHANGU_MODE === "sandbox",
  payment,
  gatewayResponse,
});
});
/**
 * @desc    Handle PayChangu Webhook
 * @route   POST /api/payments/webhook
 * @access  Public
 */
export const handleWebhook = asyncHandler(async (req, res) => {
  const webhookData = req.body;

  try {
    console.log("PayChangu Webhook Received:", webhookData);

    const { charge_id, status } = webhookData;

    if (!charge_id) {
      res.status(400);
      throw new Error("Missing transaction reference.");
    }

    const verification = await payChanguService.verifyPayment(charge_id);

    if (!verification || verification.status !== "success") {
      res.status(400);
      throw new Error("Payment verification failed.");
    }

    const payment = await Payment.findOne({
      gatewayReference: charge_id
    });

    if (!payment) {
      res.status(404);
      throw new Error("Payment record not found.");
    }

    if (payment.status === PAYMENT_STATUS.SUCCESSFUL) {
      return res.status(200).json({
        success: true,
        message: "Payment already processed."
      });
    }

    payment.status = PAYMENT_STATUS.SUCCESSFUL;
    payment.transactionId = verification.transaction_id || charge_id;
    payment.gatewayReference = charge_id;
    payment.paidAt = new Date();

    await payment.save();

    await StudentApplication.findByIdAndUpdate(
      payment.application,
      { paymentStatus: PAYMENT_STATUS.SUCCESSFUL }
    );

    res.status(200).json({
      success: true,
      message: "Payment processed successfully."
    });
  } catch (error) {
    console.error("Webhook Error:", error.message);
    res.status(500).json({
      success: false,
      message: error.message || "Webhook processing failed."
    });
  }
});

/**
 * @desc    Get Payment Status
 * @route   GET /api/payments/status/:applicationId
 * @access  Private
 */
export const getPaymentStatus = asyncHandler(async (req, res) => {
  const payment = await Payment.findOne({
    application: req.params.applicationId,
  }).sort({ createdAt: -1 });

  if (!payment) {
    res.status(404);
    throw new Error("No payment record found.");
  }

  res.status(200).json({
    success: true,
    payment,
  });
});

/**
 * @desc    Get Logged-in Student Payments
 * @route   GET /api/payments/my-payments
 * @access  Private
 */
export const getMyPayments = asyncHandler(async (req, res) => {
  const payments = await Payment.find({
    student: req.user._id,
  })
    .populate("application")
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: payments.length,
    payments,
  });
});

/**
 * @desc    Get All Payments
 * @route   GET /api/payments
 * @access  Private/Admin
 */
export const getAllPayments = asyncHandler(async (req, res) => {
  const payments = await Payment.find()
    .populate("student", "firstName lastName email")
    .populate("application")
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: payments.length,
    payments,
  });
});

/**
 * @desc    Get Single Payment
 * @route   GET /api/payments/:id
 * @access  Private
 */
export const getPaymentById = asyncHandler(async (req, res) => {
  const payment = await Payment.findById(req.params.id)
    .populate("student", "firstName lastName email")
    .populate("application");

  if (!payment) {
    res.status(404);
    throw new Error("Payment not found.");
  }

  res.status(200).json({
    success: true,
    payment,
  });
});

export const testOperators = asyncHandler(async (req, res) => {

    const operators =
        await payChanguService.getSupportedOperators();

    console.log(operators);

    res.status(200).json(operators);

});