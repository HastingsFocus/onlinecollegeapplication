import StudentApplication from "../models/StudentApplication.js";
import Program from "../models/Program.js";
import uploadToCloudinary from "../utils/uploadToCloudinary.js";


const getApplication = async (userId) => {
  const application = await StudentApplication.findOne({ userId });
  if (!application) {
    throw new Error("Application not found");
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
    const existingApplication = await StudentApplication.findOne({
      userId: req.user.id
    });

    if (existingApplication) {
      return res.status(400).json({
        message: "Application already exists."
      });
    }

    const application = await StudentApplication.create({
      userId: req.user.id,
      status: "Draft"
    });

    res.status(201).json({
      message: "Application created successfully.",
      application
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

export const getMyApplication = async (req, res) => {
  try {
    const application = await StudentApplication.findOne({
      userId: req.user.id
    })
      .populate("programChoice.firstChoice")
      .populate("programChoice.secondChoice")
      .populate("programChoice.thirdChoice")
      .populate("reviewedBy", "firstName lastName email");

    if (!application) {
      return res.status(404).json({
        message: "Application not found."
      });
    }

    res.status(200).json(application);
  } catch (error) {
    res.status(500).json({
      message: error.message
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

    application.progress.personalCompleted = true;
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

    application.progress.contactCompleted = true;
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

    application.progress.nextOfKinCompleted = true;
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
  console.time("UPLOAD");

  try {
    console.timeLog("UPLOAD", "🚀 Controller started");

    const application = await getDraftApplication(req.user.id);

    console.timeLog("UPLOAD", "✅ Draft application loaded");

    const files = req.files;
    let documentTypes = req.body.documentTypes;

    if (!files || files.length === 0) {
      console.timeEnd("UPLOAD");

      return res.status(400).json({
        message: "Please upload at least one document."
      });
    }

    if (!Array.isArray(documentTypes)) {
      documentTypes = [documentTypes];
    }

    console.log(`📄 ${files.length} file(s) received`);

    files.forEach((file) => {
      console.log(
        `   • ${file.originalname} (${(file.size / 1024 / 1024).toFixed(2)} MB)`
      );
    });

    console.time("Cloudinary Upload");

    // Upload all files in parallel
    const uploadResults = await Promise.allSettled(
      files.map(async (file, index) => {
        console.log(`⬆️ Uploading ${file.originalname}...`);

        const result = await uploadToCloudinary(file);

        console.log(`✅ Uploaded ${file.originalname}`);

        return {
          documentType: documentTypes[index],
          fileName: file.originalname,
          fileUrl: result.secure_url,
          cloudinaryPublicId: result.public_id,
          uploadedAt: new Date()
        };
      })
    );

    console.timeEnd("Cloudinary Upload");

    const successfulUploads = [];
    const failedUploads = [];

    uploadResults.forEach((result, index) => {
      if (result.status === "fulfilled") {
        successfulUploads.push(result.value);
      } else {
        console.error(
          `❌ ${files[index].originalname} failed:`,
          result.reason
        );

        failedUploads.push({
          file: files[index].originalname,
          documentType: documentTypes[index],
          error: result.reason.message || "Upload failed"
        });
      }
    });

    console.log(
      `✅ Successful uploads: ${successfulUploads.length}`
    );

    console.log(
      `❌ Failed uploads: ${failedUploads.length}`
    );

    // Update MongoDB with successful uploads only
    successfulUploads.forEach((uploadedDoc) => {
      const existingDocument = application.documents.find(
        (doc) => doc.documentType === uploadedDoc.documentType
      );

      if (existingDocument) {
        console.log(`🔄 Updating ${uploadedDoc.documentType}`);

        existingDocument.fileName = uploadedDoc.fileName;
        existingDocument.fileUrl = uploadedDoc.fileUrl;
        existingDocument.cloudinaryPublicId =
          uploadedDoc.cloudinaryPublicId;
        existingDocument.uploadedAt = uploadedDoc.uploadedAt;
      } else {
        console.log(`➕ Adding ${uploadedDoc.documentType}`);

        application.documents.push(uploadedDoc);
      }
    });

    // Only complete if every upload succeeded
    if (failedUploads.length === 0) {
      application.progress.documentsCompleted = true;
    }

    console.time("Mongo Save");

    await application.save();

    console.timeEnd("Mongo Save");

    console.timeLog("UPLOAD", "💾 MongoDB updated");

    console.timeEnd("UPLOAD");

    // Return partial success if some uploads failed
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
    console.error("========== DOCUMENT UPLOAD ERROR ==========");
    console.error(error);

    if (error.stack) {
      console.error(error.stack);
    }

    console.timeEnd("UPLOAD");

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

    application.progress.academicCompleted = true;
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
    const { firstChoice, secondChoice, thirdChoice } = req.body;

    if (!firstChoice || !secondChoice || !thirdChoice) {
      return res.status(400).json({
        message: "Please select all three program choices."
      });
    }

    if (firstChoice === secondChoice || 
        firstChoice === thirdChoice || 
        secondChoice === thirdChoice) {
      return res.status(400).json({
        message: "Program choices must be different."
      });
    }

    const programs = await Program.find({
      _id: { $in: [firstChoice, secondChoice, thirdChoice] }
    });

    if (programs.length !== 3) {
      return res.status(404).json({
        message: "One or more selected programs do not exist."
      });
    }

    application.programChoice = { firstChoice, secondChoice, thirdChoice };
    application.progress.programCompleted = true;
    await application.save();

    res.status(200).json({
      message: "Program choices updated successfully.",
      application
    });
  } catch (error) {
    const status = error.message.includes("submitted") ? 403 : 500;
    res.status(status).json({
      message: error.message
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

    application.status = "Submitted";
    application.submittedAt = new Date();
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