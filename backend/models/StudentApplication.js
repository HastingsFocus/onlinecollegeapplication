import mongoose from "mongoose";
import documentTypes from "../constants/documentTypes.js";

const studentApplicationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    // ===========================================
    // Personal Information
    // ===========================================
    personalInfo: {
      firstName: { type: String, trim: true, maxlength: 100 },
      middleName: { type: String, trim: true, maxlength: 100 },
      lastName: { type: String, trim: true, maxlength: 100 },
      gender: { type: String, enum: ["Male", "Female"] },
      dateOfBirth: Date,
      nationality: {
        type: String,
        trim: true,
        default: "Malawian",
      },
      nationalId: {
        type: String,
        trim: true,
        maxlength: 50,
      },
    },

    // ===========================================
    // Contact Information
    // ===========================================
    contactInfo: {
      email: {
        type: String,
        trim: true,
        lowercase: true,
      },
      phone: {
        type: String,
        trim: true,
      },
      alternativePhone: {
        type: String,
        trim: true,
      },
      address: {
        type: String,
        trim: true,
      },
      district: {
        type: String,
        trim: true,
      },
      country: {
        type: String,
        trim: true,
        default: "Malawi",
      },
    },

    // ===========================================
    // Next of Kin
    // ===========================================
    nextOfKin: {
      fullName: {
        type: String,
        trim: true,
      },
      relationship: {
        type: String,
        trim: true,
      },
      phone: {
        type: String,
        trim: true,
      },
      email: {
        type: String,
        trim: true,
        lowercase: true,
      },
    },

    // ===========================================
    // Academic Information
    // ===========================================
    academicInfo: {
      schoolName: {
        type: String,
        trim: true,
      },
      examinationNumber: {
        type: String,
        trim: true,
      },
      yearCompleted: {
        type: Number,
        min: 1950,
        max: new Date().getFullYear(),
      },
      subjects: [
        {
          subject: {
            type: String,
            trim: true,
          },
          grade: {
            type: String,
            trim: true,
          },
        },
      ],
      certificate: {
        type: String,
        trim: true,
      },
    },

    // ===========================================
    // Programme Choices
    // ===========================================
    programChoice: {
      firstChoice: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Program",
      },
      secondChoice: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Program",
      },
      thirdChoice: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Program",
      },
    },

    // ===========================================
    // Uploaded Documents
    // ===========================================
    documents: [
      {
        documentType: {
          type: String,
          enum: documentTypes,
          required: true,
        },
        fileName: {
          type: String,
          trim: true,
          required: true,
        },
        fileUrl: {
          type: String,
          trim: true,
          required: true,
        },
        cloudinaryPublicId: {
          type: String,
          trim: true,
        },
        uploadedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    // ===========================================
    // Progress Tracking
    // ===========================================
    progress: {
      personalCompleted: {
        type: Boolean,
        default: false,
      },
      contactCompleted: {
        type: Boolean,
        default: false,
      },
      nextOfKinCompleted: {
        type: Boolean,
        default: false,
      },
      academicCompleted: {
        type: Boolean,
        default: false,
      },
      programCompleted: {
        type: Boolean,
        default: false,
      },
      documentsCompleted: {
        type: Boolean,
        default: false,
      },
    },

    // ===========================================
    // Application Status
    // ===========================================
    status: {
      type: String,
      enum: [
        "Draft",
        "Submitted",
        "Under Review",
        "Accepted",
        "Rejected",
      ],
      default: "Draft",
    },

    applicationNumber: {
      type: String,
      unique: true,
      trim: true,
    },

    admissionYear: {
      type: Number,
      default: new Date().getFullYear(),
    },

    applicationFee: {
      type: Number,
      default: 25000,
    },

    // ===========================================
    // Payment Information
    // ===========================================
    paymentStatus: {
      type: String,
      enum: [
        "Pending",
        "Successful",
        "Failed",
        "Refunded",
      ],
      default: "Pending",
    },

    paymentInfo: {
      paid: {
        type: Boolean,
        default: false,
      },

      transactionReference: {
        type: String,
        default: "",
      },

      paymentMethod: {
        type: String,
        default: "",
      },
    },

    payment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Payment",
    },

    // ===========================================
    // Review Information
    // ===========================================
    submittedAt: Date,

    reviewedAt: Date,

    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    remarks: {
      type: String,
      trim: true,
      maxlength: 1000,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model(
  "StudentApplication",
  studentApplicationSchema
);