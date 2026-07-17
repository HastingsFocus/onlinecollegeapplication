import mongoose from "mongoose";

const studentApplicationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true
    },

    personalInfo: {
      firstName: {
        type: String,
        trim: true,
        maxlength: 100
      },
      middleName: {
        type: String,
        trim: true,
        maxlength: 100
      },
      lastName: {
        type: String,
        trim: true,
        maxlength: 100
      },
      gender: {
        type: String,
        enum: ["Male", "Female"]
      },
      dateOfBirth: {
        type: Date
      },
      nationality: {
        type: String,
        trim: true,
        default: "Malawian"
      },
      nationalId: {
        type: String,
        trim: true,
        maxlength: 50
      }
    },

    contactInfo: {
      email: {
        type: String,
        trim: true,
        lowercase: true
      },
      phone: {
        type: String,
        trim: true
      },
      alternativePhone: {
        type: String,
        trim: true
      },
      address: {
        type: String,
        trim: true
      },
      district: {
        type: String,
        trim: true
      },
      country: {
        type: String,
        trim: true,
        default: "Malawi"
      }
    },

    nextOfKin: {
      fullName: {
        type: String,
        trim: true
      },
      relationship: {
        type: String,
        trim: true
      },
      phone: {
        type: String,
        trim: true
      },
      email: {
        type: String,
        trim: true,
        lowercase: true
      }
    },

    academicInfo: {
      schoolName: {
        type: String,
        trim: true
      },
      examinationNumber: {
        type: String,
        trim: true
      },
      yearCompleted: {
        type: Number,
        min: 1950,
        max: new Date().getFullYear()
      },
      subjects: [
        {
          subject: {
            type: String,
            trim: true
          },
          grade: {
            type: String,
            trim: true
          }
        }
      ],
      certificate: {
        type: String,
        trim: true
      }
    },

    programChoice: {
      firstChoice: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Program"
      },
      secondChoice: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Program"
      },
      thirdChoice: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Program"
      }
    },

    documents: [
      {
        documentType: {
          type: String,
          enum: [
            "Passport Photo",
            "National ID",
            "MSCE Certificate",
            "Academic Transcript",
            "Other"
          ]
        },
        fileName: {
          type: String,
          trim: true
        },
        fileUrl: {
          type: String,
          trim: true
        },
        uploadedAt: {
          type: Date,
          default: Date.now
        }
      }
    ],

    progress: {
      personalCompleted: {
        type: Boolean,
        default: false
      },
      contactCompleted: {
        type: Boolean,
        default: false
      },
      nextOfKinCompleted: {
        type: Boolean,
        default: false
      },
      academicCompleted: {
        type: Boolean,
        default: false
      },
      programCompleted: {
        type: Boolean,
        default: false
      },
      documentsCompleted: {
        type: Boolean,
        default: false
      }
    },

    status: {
      type: String,
      enum: ["Draft", "Submitted", "Under Review", "Accepted", "Rejected"],
      default: "Draft"
    },

    paymentInfo: {
      paid: {
        type: Boolean,
        default: false
      },
      transactionReference: {
        type: String,
        trim: true
      },
      paymentMethod: {
        type: String,
        enum: ["Airtel Money", "TNM Mpamba", "Bank", "Card"]
      }
    },

    submittedAt: Date,
    reviewedAt: Date,
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    remarks: {
      type: String,
      trim: true,
      maxlength: 1000
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model("StudentApplication", studentApplicationSchema);