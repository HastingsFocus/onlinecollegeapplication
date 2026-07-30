import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
    application: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "StudentApplication",
      required: true,
      index: true
    },
    amount: {
      type: Number,
      required: true,
      min: 0
    },
    currency: {
      type: String,
      default: "MWK",
      uppercase: true,
      trim: true
    },
    gateway: {
      type: String,
      enum: ["PayChangu", "Khusa"],
      required: true
    },
    method: {
      type: String,
      enum: ["Airtel Money", "TNM Mpamba"],
      required: true
    },
    phoneNumber: {
      type: String,
      trim: true,
      required: true
    },
    transactionId: {
      type: String,
      trim: true,
      unique: true,
      sparse: true
    },
    gatewayReference: {
      type: String,
      trim: true,
      unique: true,
      sparse: true
    },
    status: {
      type: String,
      enum: ["Pending", "Successful", "Failed", "Cancelled", "Expired"],
      default: "Pending"
    },
    failureReason: {
      type: String,
      trim: true
    },
    paidAt: {
      type: Date
    },
    gatewayResponse: {
      type: mongoose.Schema.Types.Mixed,
      default: null
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model("Payment", paymentSchema);