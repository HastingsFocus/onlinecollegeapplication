import asyncHandler from "express-async-handler";
import StudentApplication from "../models/StudentApplication.js";
import Intake from "../models/Intake.js";

export const getApplicationsByIntake = asyncHandler(async (req, res) => {
  const { intakeId } = req.params;
  const {
    page = 1,
    limit = 20,
    status,
    program,
    search,
    sort = "createdAt",
    order = "desc"
  } = req.query;

  const intake = await Intake.findById(intakeId);
  if (!intake) {
    res.status(404);
    throw new Error("Intake not found.");
  }

  const query = { intake: intakeId };
  if (status) query.status = status;

  if (program) {
    query.$or = [
      { "programChoice.firstChoice": new mongoose.Types.ObjectId(program) },
      { "programChoice.secondChoice": new mongoose.Types.ObjectId(program) },
      { "programChoice.thirdChoice": new mongoose.Types.ObjectId(program) }
    ];
  }

  const currentPage = Number(page);
  const pageSize = Number(limit);
  const skip = (currentPage - 1) * pageSize;

  const sortOptions = {};
  sortOptions[sort] = order === "asc" ? 1 : -1;

  let applications = await StudentApplication.find(query)
    .populate("userId", "firstName lastName email")
    .populate("intake", "name academicYear")
    .populate("programChoice.firstChoice", "name")
    .populate("programChoice.secondChoice", "name")
    .populate("programChoice.thirdChoice", "name")
    .sort(sortOptions)
    .skip(skip)
    .limit(pageSize);

  if (search) {
    const keyword = search.toLowerCase();
    applications = applications.filter((application) => {
      const user = application.userId;
      const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
      return (
        fullName.includes(keyword) ||
        user.email.toLowerCase().includes(keyword) ||
        (application.applicationNumber || "").toLowerCase().includes(keyword)
      );
    });
  }

  const totalApplications = await StudentApplication.countDocuments(query);
  const totalPages = Math.ceil(totalApplications / pageSize);

  res.status(200).json({
    success: true,
    intake: {
      id: intake._id,
      name: intake.name,
      academicYear: intake.academicYear,
      status: intake.status
    },
    pagination: {
      currentPage,
      totalPages,
      pageSize,
      totalApplications,
      hasNextPage: currentPage < totalPages,
      hasPreviousPage: currentPage > 1
    },
    filters: {
      status: status || null,
      program: program || null,
      search: search || null,
      sort,
      order
    },
    count: applications.length,
    applications
  });
});

export const getApplicationDetails = asyncHandler(async (req, res) => {
  const application = await StudentApplication.findById(req.params.id)
    .populate("userId", "firstName lastName email")
    .populate("intake")
    .populate("programChoice.firstChoice")
    .populate("programChoice.secondChoice")
    .populate("programChoice.thirdChoice")
    .populate("reviewedBy", "firstName lastName email")
    .populate("payment");

  if (!application) {
    res.status(404);
    throw new Error("Application not found.");
  }

  res.status(200).json({
    success: true,
    application
  });
});

export const reviewApplication = asyncHandler(async (req, res) => {
  const application = await StudentApplication.findById(req.params.id);

  if (!application) {
    res.status(404);
    throw new Error("Application not found.");
  }

  if (application.status !== "Submitted") {
    res.status(400);
    throw new Error("Only submitted applications can be reviewed.");
  }

  application.status = "Under Review";
  application.reviewedBy = req.user.id;
  application.reviewedAt = new Date();
  await application.save();

  res.status(200).json({
    success: true,
    message: "Application is now under review.",
    application
  });
});

export const acceptApplication = asyncHandler(async (req, res) => {
  const application = await StudentApplication.findById(req.params.id);

  if (!application) {
    res.status(404);
    throw new Error("Application not found.");
  }

  if (application.status !== "Under Review") {
    res.status(400);
    throw new Error("Only applications under review can be accepted.");
  }

  application.status = "Accepted";
  application.reviewedBy = req.user.id;
  application.reviewedAt = new Date();
  await application.save();

  res.status(200).json({
    success: true,
    message: "Application accepted successfully.",
    application
  });
});

export const rejectApplication = asyncHandler(async (req, res) => {
  const { remarks } = req.body;
  const application = await StudentApplication.findById(req.params.id);

  if (!application) {
    res.status(404);
    throw new Error("Application not found.");
  }

  if (application.status !== "Under Review") {
    res.status(400);
    throw new Error("Only applications under review can be rejected.");
  }

  application.status = "Rejected";
  application.reviewedBy = req.user.id;
  application.reviewedAt = new Date();
  if (remarks) application.remarks = remarks;
  await application.save();

  res.status(200).json({
    success: true,
    message: "Application rejected successfully.",
    application
  });
});

export const getIntakeStatistics = asyncHandler(async (req, res) => {
  const { intakeId } = req.params;

  const intake = await Intake.findById(intakeId);
  if (!intake) {
    res.status(404);
    throw new Error("Intake not found.");
  }

  const [dashboard] = await StudentApplication.aggregate([
    { $match: { intake: intake._id } },
    {
      $facet: {
        totalApplications: [{ $count: "count" }],
        statusSummary: [
          { $group: { _id: "$status", count: { $sum: 1 } } }
        ],
        genderSummary: [
          { $group: { _id: "$personalInfo.gender", count: { $sum: 1 } } }
        ],
        districtSummary: [
          { $group: { _id: "$contactInfo.district", count: { $sum: 1 } } },
          { $sort: { count: -1 } }
        ],
        paymentSummary: [
          { $group: { _id: "$paymentStatus", count: { $sum: 1 } } }
        ],
        programmeSummary: [
          {
            $lookup: {
              from: "programs",
              localField: "programChoice.firstChoice",
              foreignField: "_id",
              as: "programme"
            }
          },
          { $unwind: "$programme" },
          { $group: { _id: "$programme.name", count: { $sum: 1 } } },
          { $sort: { count: -1 } }
        ],
        dailyApplications: [
          {
            $group: {
              _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
              count: { $sum: 1 }
            }
          },
          { $sort: { _id: 1 } }
        ]
      }
    }
  ]);

  const status = { Draft: 0, Submitted: 0, "Under Review": 0, Accepted: 0, Rejected: 0 };
  dashboard.statusSummary.forEach((item) => { status[item._id] = item.count; });

  const gender = { Male: 0, Female: 0 };
  dashboard.genderSummary.forEach((item) => { gender[item._id] = item.count; });

  const payment = { Pending: 0, Successful: 0, Failed: 0, Refunded: 0 };
  dashboard.paymentSummary.forEach((item) => { payment[item._id] = item.count; });

  res.status(200).json({
    success: true,
    intake: {
      id: intake._id,
      name: intake.name,
      academicYear: intake.academicYear,
      status: intake.status,
      applicationStartDate: intake.applicationStartDate,
      applicationEndDate: intake.applicationEndDate
    },
    statistics: {
      totalApplications: dashboard.totalApplications[0]?.count || 0,
      status,
      gender,
      payment,
      districts: dashboard.districtSummary,
      programmes: dashboard.programmeSummary,
      dailyApplications: dashboard.dailyApplications
    }
  });
});