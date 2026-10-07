import StudentApplication from "../models/StudentApplication.js";
import Program from "../models/Program.js";
import uploadToCloudinary from "../utils/uploadToCloudinary.js";
import { updateApplicationProgress } from "../utils/updateApplicationProgress.js";
import Intake from "../models/Intake.js";



const getApplication = async (userId) => {
  const today = new Date();

  const activeIntake = await Intake.findOne({
    status: "Published",
    applicationStartDate: { $lte: today },
    applicationEndDate: { $gte: today },
  });

  if (!activeIntake) {
    throw new Error("There is no active intake.");
  }

  const application = await StudentApplication.findOne({
    userId,
    intake: activeIntake._id,
  });

  if (!application) {
    throw new Error("Application not found.");
  }

  return application;
};

const getDraftApplication = async (userId) => {
  const application = await getApplication(userId);
  if (application.status !== "Draft") {
    throw new Error("Application has already been submitted and cannot be edited.");
  }
  return application;
};

const isEmpty = (value) => {
  return value === undefined || value === null || value === "";
};

const validatePersonalInformation = (data) => {
  if (isEmpty(data.firstName)) return "First name is required.";
  if (isEmpty(data.lastName)) return "Last name is required.";
  if (isEmpty(data.gender)) return "Gender is required.";
  if (data.gender && !["Male", "Female"].includes(data.gender)) {
    return "Invalid gender selected.";
  }
  if (isEmpty(data.dateOfBirth)) return "Date of birth is required.";
  if (isEmpty(data.nationality)) return "Nationality is required.";
  return null;
};

const validateContactInformation = (data) => {
  if (isEmpty(data.email)) return "Email address is required.";
  if (isEmpty(data.phone)) return "Phone number is required.";
  if (isEmpty(data.address)) return "Address is required.";
  if (isEmpty(data.district)) return "District is required.";
  return null;
};

export const createApplication = async (req, res) => {
  try {
    // Find the currently active intake
    const today = new Date();

    const activeIntake = await Intake.findOne({
      status: "Published",
      applicationStartDate: { $lte: today },
      applicationEndDate: { $gte: today },
    });

    if (!activeIntake) {
      return res.status(400).json({
        success: false,
        message: "There is no active intake. Applications are currently closed.",
      });
    }

    // Check if the student already has an application for this intake
    const existingApplication = await StudentApplication.findOne({
      userId: req.user.id,
      intake: activeIntake._id,
    });

    if (existingApplication) {
      return res.status(400).json({
        success: false,
        message: "You have already created an application for this intake.",
      });
    }

    // Create a new application
    const application = await StudentApplication.create({
      userId: req.user.id,
      intake: activeIntake._id,
      status: "Draft",
      lastActivity: new Date(),
    });

    res.status(201).json({
      success: true,
      message: "Application created successfully.",
      application,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getMyApplication = async (req, res) => {
  try {
    const today = new Date();

    const activeIntake = await Intake.findOne({
      status: "Published",
      applicationStartDate: { $lte: today },
      applicationEndDate: { $gte: today },
    });

    if (!activeIntake) {
      return res.status(404).json({
        message: "There is no active intake.",
      });
    }

    const application = await StudentApplication.findOne({
      userId: req.user.id,
      intake: activeIntake._id,
    })
      .populate("intake")
      .populate("programChoice.firstChoice", "name")
      .populate("programChoice.secondChoice", "name")
      .populate("programChoice.thirdChoice", "name")
      .populate("programChoice.acceptedProgram", "name")
      .populate("reviewedBy", "firstName lastName email");

    if (!application) {
      return res.status(404).json({
        message: "Application not found.",
      });
    }

   
    res.status(200).json(application);
  } catch (error) {
    console.error("GET MY APPLICATION ERROR:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};

export const updatePersonalInfo = async (req, res) => {
  try {
    const application = await getDraftApplication(req.user.id);
    const validationError = validatePersonalInformation(req.body);

    if (validationError) {
      return res.status(400).json({
        message: validationError
      });
    }

    application.personalInfo = {
      ...application.personalInfo,
      ...req.body
    };

    updateApplicationProgress(
  application,
  "personalCompleted"
);

await application.save();

    res.status(200).json({
      message: "Personal information updated successfully.",
      application
    });
  } catch (error) {
    const status = error.message.includes("submitted") ? 403 : 500;
    res.status(status).json({
      message: error.message
    });
  }
};

export const updateContactInfo = async (req, res) => {
  try {
    const application = await getDraftApplication(req.user.id);
    const validationError = validateContactInformation(req.body);

    if (validationError) {
      return res.status(400).json({
        message: validationError
      });
    }

    application.contactInfo = {
      ...application.contactInfo,
      ...req.body
    };

updateApplicationProgress(
  application,
  "contactCompleted"
);
    await application.save();

    res.status(200).json({
      message: "Contact information updated successfully.",
      application
    });
  } catch (error) {
    const status = error.message.includes("submitted") ? 403 : 500;
    res.status(status).json({
      message: error.message
    });
  }
};

const validateNextOfKin = (data) => {
  if (isEmpty(data.fullName)) return "Next of kin name is required.";
  if (isEmpty(data.relationship)) return "Relationship is required.";
  if (isEmpty(data.phone)) return "Phone number is required.";
  return null;
};

export const updateNextOfKin = async (req, res) => {
  try {
    const application = await getDraftApplication(req.user.id);
    const validationError = validateNextOfKin(req.body);

    if (validationError) {
      return res.status(400).json({
        message: validationError
      });
    }

    application.nextOfKin = {
      ...application.nextOfKin,
      ...req.body
    };

    updateApplicationProgress(
  application,
  "nextOfKinCompleted"
);
    await application.save();

    res.status(200).json({
      message: "Next of kin information updated successfully.",
      application
    });
  } catch (error) {
    const status = error.message.includes("submitted") ? 403 : 500;
    res.status(status).json({
      message: error.message
    });
  }
};



export const uploadDocuments = async (req, res) => {
  try {
    const application = await getDraftApplication(req.user.id);
    const files = req.files;
    let documentTypes = req.body.documentTypes;

    if (!files || files.length === 0) {
      return res.status(400).json({
        message: "Please upload at least one document."
      });
    }

    if (!Array.isArray(documentTypes)) {
      documentTypes = [documentTypes];
    }

    const uploadResults = await Promise.allSettled(
      files.map(async (file, index) => {
        const result = await uploadToCloudinary(file);
        return {
          documentType: documentTypes[index],
          fileName: file.originalname,
          fileUrl: result.secure_url,
          cloudinaryPublicId: result.public_id,
          uploadedAt: new Date()
        };
      })
    );

    const successfulUploads = [];
    const failedUploads = [];

    uploadResults.forEach((result, index) => {
      if (result.status === "fulfilled") {
        successfulUploads.push(result.value);
      } else {
        failedUploads.push({
          file: files[index].originalname,
          documentType: documentTypes[index],
          error: result.reason?.message || "Upload failed"
        });
      }
    });

    successfulUploads.forEach((uploadedDoc) => {
      const existingDocument = application.documents.find(
        doc => doc.documentType === uploadedDoc.documentType
      );
      if (existingDocument) {
        existingDocument.fileName = uploadedDoc.fileName;
        existingDocument.fileUrl = uploadedDoc.fileUrl;
        existingDocument.cloudinaryPublicId = uploadedDoc.cloudinaryPublicId;
        existingDocument.uploadedAt = uploadedDoc.uploadedAt;
      } else {
        application.documents.push(uploadedDoc);
      }
    });

    if (failedUploads.length === 0) {
      updateApplicationProgress(application, "documentsCompleted");
    } else {
      application.lastActivity = new Date();
    }

    await application.save();

    if (failedUploads.length > 0) {
      return res.status(207).json({
        message: "Some documents uploaded successfully.",
        uploaded: successfulUploads.length,
        failed: failedUploads.length,
        failedUploads,
        documents: application.documents
      });
    }

    return res.status(200).json({
      message: "All documents uploaded successfully.",
      uploaded: successfulUploads.length,
      documents: application.documents
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message
    });
  }
};

const validateAcademicInformation = (data) => {
  if (isEmpty(data.schoolName)) return "School name is required.";
  if (isEmpty(data.examinationNumber)) return "Examination number is required.";
  if (isEmpty(data.yearCompleted)) return "Year completed is required.";
  if (!Array.isArray(data.subjects) || data.subjects.length === 0) {
    return "Please add at least one subject.";
  }
  return null;
};

export const updateAcademicInfo = async (req, res) => {
  try {
    const application = await getDraftApplication(req.user.id);
    const validationError = validateAcademicInformation(req.body);

    if (validationError) {
      return res.status(400).json({
        message: validationError
      });
    }

    application.academicInfo = {
      ...application.academicInfo,
      ...req.body
    };

   updateApplicationProgress(
  application,
  "academicCompleted"
);
    await application.save();

    res.status(200).json({
      message: "Academic information updated successfully.",
      application
    });
  } catch (error) {
    const status = error.message.includes("submitted") ? 403 : 500;
    res.status(status).json({
      message: error.message
    });
  }
};

export const selectPrograms = async (req, res) => {
  try {
    const application = await getDraftApplication(req.user.id);

    const {
      firstChoice,
      secondChoice,
      thirdChoice
    } = req.body;

    if (!firstChoice) {
      return res.status(400).json({
        message: "Please select your first program choice."
      });
    }

    const selectedPrograms = [
      firstChoice,
      secondChoice,
      thirdChoice
    ].filter(Boolean);

    // Prevent selecting the same program more than once
    if (new Set(selectedPrograms).size !== selectedPrograms.length) {
      return res.status(400).json({
        message: "Program choices must be different."
      });
    }

    // Make sure the application has an intake
    if (!application.intake) {
      return res.status(400).json({
        message: "No intake has been selected for this application."
      });
    }

    // Get the intake and its allocated programs
    const intake = await Intake.findById(application.intake)
      .populate("availablePrograms");

    if (!intake) {
      return res.status(404).json({
        message: "Application intake not found."
      });
    }

    // Get IDs of programs allocated to this intake
    const allowedPrograms = intake.availablePrograms.map(
      (program) => program._id.toString()
    );

    // Make sure every selected program belongs to the intake
    const invalidProgram = selectedPrograms.find(
      (programId) => !allowedPrograms.includes(programId)
    );

    if (invalidProgram) {
      return res.status(400).json({
        message:
          "One or more selected programs are not available for this intake."
      });
    }

    // Save program choices
    application.programChoice = {
      firstChoice,
      secondChoice: secondChoice || null,
      thirdChoice: thirdChoice || null
    };

    updateApplicationProgress(
      application,
      "programCompleted"
    );

    await application.save();

    res.status(200).json({
      message: "Program choices updated successfully.",
      application
    });

  } catch (error) {
    console.error("SELECT PROGRAMS ERROR:", error);

    const status = error.message.includes("submitted")
      ? 403
      : 500;

    res.status(status).json({
      message: error.message
    });
  }
};

export const getApplicationPrograms = async (req, res) => {
  try {
    const application = await getDraftApplication(req.user.id);

    
    if (!application.intake) {
      return res.status(400).json({
        message: "No intake has been selected for this application.",
      });
    }

    const intake = await Intake.findById(application.intake)
      .populate("availablePrograms");

    

    if (!intake) {
      return res.status(404).json({
        message: "Application intake not found.",
      });
    }

    res.status(200).json({
      programs: intake.availablePrograms,
    });
  } catch (error) {
    console.error("GET APPLICATION PROGRAMS ERROR:", error);

    res.status(500).json({
      message: error.message || "Failed to load available programs.",
    });
  }
};

export const submitApplication = async (req, res) => {
  try {
    const application = await getDraftApplication(req.user.id);

    if (!application.progress.personalCompleted) {
      return res.status(400).json({
        message: "Complete Personal Information first."
      });
    }
    if (!application.progress.contactCompleted) {
      return res.status(400).json({
        message: "Complete Contact Information first."
      });
    }
    if (!application.progress.nextOfKinCompleted) {
      return res.status(400).json({
        message: "Complete Next of Kin first."
      });
    }
    if (!application.progress.academicCompleted) {
      return res.status(400).json({
        message: "Complete Academic Information first."
      });
    }
    if (!application.progress.programCompleted) {
      return res.status(400).json({
        message: "Complete Program Selection first."
      });
    }
    if (!application.progress.documentsCompleted) {
      return res.status(400).json({
        message: "Upload all required documents first."
      });
    }


    const intake = await Intake.findById(application.intake);

const today = new Date();

if (
    intake.status !== "Published" ||
    today < intake.applicationStartDate ||
    today > intake.applicationEndDate
) {
    return res.status(400).json({
        message: "This intake is no longer accepting applications.",
    });
}

    application.status = "Submitted";
    application.submittedAt = new Date();
    application.lastActivity = new Date();

    await application.save();

    res.status(200).json({
      message: "Application submitted successfully.",
      status: application.status,
      submittedAt: application.submittedAt,
      application
    });
  } catch (error) {
    const status = error.message.includes("submitted") ? 403 : 500;
    res.status(status).json({
      message: error.message
    });
  }
};