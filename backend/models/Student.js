import mongoose from "mongoose";

const studentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    applicationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "StudentApplication",
      required: true,
      unique: true
    },
    registrationNumber: {
    type: String,
    trim: true,
    unique: true,
    sparse: true,
    default: null
},
    program: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Program",
      required: true
    },
    intake: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Intake",
      required: true
    },
    academicYear: {
      type: String,
      required: true,
      trim: true
    },
    status: {
      type: String,
      enum: [
        "Pending Registration",
        "Registered",
        "Active",
        "Suspended",
        "Graduated",
        "Withdrawn",
        "Dismissed"
      ],
      default: "Pending Registration"
    },
    registeredAt: {
      type: Date,
      default: null
    },
    enrolledAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model("Student", studentSchema);