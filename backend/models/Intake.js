import mongoose from "mongoose";

const intakeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    academicYear: {
      type: String,
      required: true,
      trim: true
    },
    applicationStartDate: {
      type: Date,
      required: true
    },
    applicationEndDate: {
      type: Date,
      required: true
    },
    availablePrograms: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Program"
      }
    ],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    status: {
      type: String,
      enum: ["Draft", "Published", "Closed", "Archived"],
      default: "Draft"
    }
  },
  { timestamps: true }
);

export default mongoose.model("Intake", intakeSchema);