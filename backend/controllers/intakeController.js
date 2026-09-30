import asyncHandler from "express-async-handler";
import Intake from "../models/Intake.js";
import Program from "../models/Program.js";

export const createIntake = asyncHandler(async (req, res) => {
  const {
    name,
    academicYear,
    description,
    applicationStartDate,
    applicationEndDate,
    availablePrograms,
  } = req.body;

  // Validate required fields
  if (
    !name ||
    !academicYear ||
    !applicationStartDate ||
    !applicationEndDate
  ) {
    res.status(400);
    throw new Error("Please provide all required fields.");
  }

  // Validate dates
  if (new Date(applicationStartDate) >= new Date(applicationEndDate)) {
    res.status(400);
    throw new Error("Application end date must be after the start date.");
  }

  // Ensure all selected programs exist
  if (availablePrograms?.length) {
    const count = await Program.countDocuments({
      _id: { $in: availablePrograms },
    });

    if (count !== availablePrograms.length) {
      res.status(400);
      throw new Error("One or more selected programs are invalid.");
    }
  }

  const intake = await Intake.create({
    name,
    academicYear,
    description,
    applicationStartDate,
    applicationEndDate,
    availablePrograms,
    createdBy: req.user._id,
  });

  res.status(201).json({
    success: true,
    message: "Intake created successfully.",
    intake,
  });
});

export const getAllIntakes = asyncHandler(async (req, res) => {
  const intakes = await Intake.find()
    .populate("createdBy", "firstName lastName email")
    .populate("availablePrograms", "name")
    .sort({ createdAt: -1 });

  res.json({
    success: true,
    count: intakes.length,
    intakes,
  });
});

export const getActiveIntake = asyncHandler(async (req, res) => {
  const today = new Date();

  const intake = await Intake.findOne({
    status: "Published",
    applicationStartDate: { $lte: today },
    applicationEndDate: { $gte: today },
  }).populate("availablePrograms");

  if (!intake) {
    res.status(404);
    throw new Error("There is currently no active intake.");
  }

  res.json({
    success: true,
    intake,
  });
});

export const getSingleIntake = asyncHandler(async (req, res) => {
  const intake = await Intake.findById(req.params.id)
    .populate("createdBy", "firstName lastName email")
    .populate("availablePrograms");

  if (!intake) {
    res.status(404);
    throw new Error("Intake not found.");
  }

  res.json({
    success: true,
    intake,
  });
});

export const updateIntake = asyncHandler(async (req, res) => {
  const intake = await Intake.findById(req.params.id);

  if (!intake) {
    res.status(404);
    throw new Error("Intake not found.");
  }

  if (intake.status !== "Draft") {
    res.status(400);
    throw new Error("Only draft intakes can be edited.");
  }

  Object.assign(intake, req.body);

  const updated = await intake.save();

  res.json({
    success: true,
    message: "Intake updated successfully.",
    intake: updated,
  });
});

export const publishIntake = asyncHandler(async (req, res) => {
  const intake = await Intake.findById(req.params.id);

  if (!intake) {
    res.status(404);
    throw new Error("Intake not found.");
  }

  // Prevent publishing an archived intake
  if (intake.status === "Archived") {
    res.status(400);
    throw new Error("Archived intakes cannot be published.");
  }

  // Check if another intake is already published
  const existingPublishedIntake = await Intake.findOne({
    status: "Published",
    _id: { $ne: intake._id }, // Exclude the current intake
  });

  if (existingPublishedIntake) {
    res.status(400);
    throw new Error(
      `Another intake (${existingPublishedIntake.name}) is already published. Please archive or close it before publishing a new intake.`
    );
  }

  intake.status = "Published";

  await intake.save();

  res.status(200).json({
    success: true,
    message: "Intake published successfully.",
    intake,
  });
});

export const archiveIntake = asyncHandler(async (req, res) => {
  const intake = await Intake.findById(req.params.id);

  if (!intake) {
    res.status(404);
    throw new Error("Intake not found.");
  }

  intake.status = "Archived";

  await intake.save();

  res.json({
    success: true,
    message: "Intake archived successfully.",
    intake,
  });
});

export const closeIntake = asyncHandler(async (req, res) => {
  const intake = await Intake.findById(req.params.id);

  if (!intake) {
    res.status(404);
    throw new Error("Intake not found.");
  }

  if (intake.status !== "Published") {
    res.status(400);
    throw new Error("Only published intakes can be closed.");
  }

  intake.status = "Closed";

  await intake.save();

  res.status(200).json({
    success: true,
    message: "Intake closed successfully.",
    intake,
  });
});