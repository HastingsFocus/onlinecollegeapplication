import mongoose from "mongoose";

const studentApplicationSchema = new mongoose.Schema({
    // Link application to logged in student
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    /*
    ==========================
    PERSONAL INFORMATION
    ==========================
    */
    personalInfo: {
        firstName: {
            type: String,
            required: true
        },
        middleName: {
            type: String
        },
        lastName: {
            type: String,
            required: true
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
            default: "Malawian"
        },
        nationalId: {
            type: String
        },
        passportPhoto: {
            type: String
        }
    },

    /*
    ==========================
    CONTACT INFORMATION
    ==========================
    */
    contactInfo: {
        email: {
            type: String
        },
        phone: {
            type: String,
            required: true
        },
        alternativePhone: {
            type: String
        },
        address: {
            type: String
        },
        district: {
            type: String
        },
        country: {
            type: String,
            default: "Malawi"
        }
    },

    /*
    ==========================
    NEXT OF KIN
    ==========================
    */
    nextOfKin: {
        fullName: {
            type: String
        },
        relationship: {
            type: String
        },
        phone: {
            type: String
        },
        email: {
            type: String
        }
    },

    /*
    ==========================
    ACADEMIC INFORMATION
    ==========================
    */
    academicInfo: {
        schoolName: {
            type: String
        },
        examinationNumber: {
            type: String
        },
        yearCompleted: {
            type: Number
        },
        subjects: [{
            subject: {
                type: String
            },
            grade: {
                type: String
            }
        }],
        certificate: {
            type: String
        }
    },

    /*
    ==========================
    PROGRAM APPLICATION
    ==========================
    */
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

    /*
    ==========================
    DOCUMENTS
    ==========================
    */
    documents: [{
        documentName: {
            type: String
        },
        documentUrl: {
            type: String
        },
        documentType: {
            type: String
        }
    }],

    /*
    ==========================
    APPLICATION STATUS
    ==========================
    */
    status: {
        type: String,
        enum: ["Draft", "Submitted", "Under Review", "Accepted", "Rejected"],
        default: "Draft"
    },

    /*
    ==========================
    PAYMENT
    ==========================
    */
    paymentInfo: {
        paid: {
            type: Boolean,
            default: false
        },
        transactionReference: {
            type: String
        },
        paymentMethod: {
            type: String
        }
    }
}, {
    timestamps: true
});

export default mongoose.model("StudentApplication", studentApplicationSchema);