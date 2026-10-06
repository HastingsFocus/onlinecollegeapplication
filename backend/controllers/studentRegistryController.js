import asyncHandler from "express-async-handler";
import Student from "../models/Student.js";
import StudentApplication from "../models/StudentApplication.js";
import Program from "../models/Program.js";
import Intake from "../models/Intake.js";
import sendEmail from "../utils/sendEmail.js";

export const getAcceptedStudents = asyncHandler(async (req, res) => {
  const applications = await StudentApplication.find({
    status: "Accepted"
  })
    .populate("userId", "firstName lastName email")
    .populate("intake", "name academicYear")
    .populate("programChoice.acceptedProgram", "name code")
    .populate("programChoice.firstChoice", "name code")
    .populate("programChoice.secondChoice", "name code")
    .populate("programChoice.thirdChoice", "name code")
    .sort({ "personalInfo.lastName": 1, "personalInfo.firstName": 1 });

  const applicationIds = applications.map(
    (application) => application._id
  );

  const students = await Student.find({
    applicationId: { $in: applicationIds }
  }).select("applicationId registrationNumber status");

  const studentMap = new Map(
    students.map((student) => [
      student.applicationId.toString(),
      student
    ])
  );

  const results = applications.map((application) => {
    const student = studentMap.get(application._id.toString());

    return {
      ...application.toObject(),
      registry: student
        ? {
            studentId: student._id,
            registrationNumber: student.registrationNumber || null,
            status: student.status
          }
        : null
    };
  });

  res.status(200).json({
    success: true,
    count: results.length,
    applications: results
  });
});


export const registerStudent = asyncHandler(async (req, res) => {
  const { applicationId } = req.params;

  const application = await StudentApplication.findById(applicationId)
    .populate("userId", "firstName lastName email")
    .populate("intake", "name academicYear")
    .populate("programChoice.acceptedProgram", "name code");

  if (!application) {
    res.status(404);
    throw new Error("Application not found.");
  }

  if (application.status !== "Accepted") {
    res.status(400);
    throw new Error(
      "Only accepted applications can be registered as students."
    );
  }

  const acceptedProgram = application.programChoice?.acceptedProgram;

  if (!acceptedProgram) {
    res.status(400);
    throw new Error(
      "The accepted application does not have an accepted programme."
    );
  }

  if (!acceptedProgram.code) {
    res.status(400);
    throw new Error(
      "The accepted programme does not have a programme code."
    );
  }

  if (!application.intake?.academicYear) {
    res.status(400);
    throw new Error(
      "The application intake does not have an academic year."
    );
  }

  // Prevent duplicate registration
  const existingStudent = await Student.findOne({
    applicationId: application._id
  });

  if (existingStudent) {
    res.status(409);
    throw new Error(
      `This student has already been added to the Student Registry${
        existingStudent.registrationNumber
          ? ` with registration number ${existingStudent.registrationNumber}`
          : "."
      }`
    );
  }

  // Extract the four-digit academic year
  const yearMatch = application.intake.academicYear.match(/\d{4}/);

  if (!yearMatch) {
    res.status(400);
    throw new Error(
      `Invalid academic year: ${application.intake.academicYear}`
    );
  }

  const yearSuffix = yearMatch[0].slice(-2);
  const programCode = acceptedProgram.code.trim().toUpperCase();

  /*
   * Find the highest existing registration number
   * for this programme and academic year.
   *
   * Example:
   * BIT-001-26
   * BIT-002-26
   * BIT-003-26
   *
   * Next number = BIT-004-26
   */
  const existingStudents = await Student.find({
    registrationNumber: {
      $regex: `^${programCode}-\\d{3}-${yearSuffix}$`
    }
  }).select("registrationNumber");

  let nextSequence = 1;

  for (const existing of existingStudents) {
    if (!existing.registrationNumber) {
      continue;
    }

    const parts = existing.registrationNumber.split("-");
    const sequence = Number(parts[1]);

    if (!Number.isNaN(sequence) && sequence >= nextSequence) {
      nextSequence = sequence + 1;
    }
  }

  const registrationNumber =
    `${programCode}-${String(nextSequence).padStart(3, "0")}-${yearSuffix}`;

  // Create the student already registered
  const student = await Student.create({
    userId: application.userId._id,
    applicationId: application._id,
    registrationNumber,
    program: acceptedProgram._id,
    intake: application.intake._id,
    academicYear: application.intake.academicYear,
    status: "Registered",
    registeredAt: new Date()
  });

  const createdStudent = await Student.findById(student._id)
    .populate("userId", "firstName lastName email")
    .populate("applicationId")
    .populate("program", "name code department duration")
    .populate("intake", "name academicYear");

  res.status(201).json({
    success: true,
    message: "Student added to the Student Registry successfully.",
    student: createdStudent
  });
});

export const getRegisteredStudents = asyncHandler(async (req, res) => {
  const students = await Student.find()
    .populate("userId", "firstName lastName email")
    .populate("program", "name code department duration")
    .populate("intake", "name academicYear")
    .populate("applicationId", "applicationNumber status")
    .sort({
      "userId.lastName": 1,
      "userId.firstName": 1
    });

  res.status(200).json({
    success: true,
    count: students.length,
    students
  });
});

export const getStudentById = asyncHandler(async (req, res) => {
  const student = await Student.findById(req.params.id)
    .populate("userId", "firstName lastName email")
    .populate("program", "name code department duration")
    .populate("intake", "name academicYear")
    .populate(
      "applicationId",
      "applicationNumber status personalInfo contactInfo academicInfo programChoice"
    );

  if (!student) {
    res.status(404);
    throw new Error("Student not found.");
  }

  res.status(200).json({
    success: true,
    student
  });
});

export const generateRegistrationNumbers = asyncHandler(async (req, res) => {
  const students = await Student.find({
    status: "Pending Registration",
    registrationNumber: null
  })
    .populate("userId", "firstName lastName")
    .populate("program", "name code")
    .populate("intake", "academicYear");

  if (students.length === 0) {
    res.status(400);
    throw new Error("There are no students pending registration.");
  }

  students.sort((a, b) => {
    const lastNameA = (a.userId?.lastName || "").toLowerCase();
    const lastNameB = (b.userId?.lastName || "").toLowerCase();
    const lastNameComparison = lastNameA.localeCompare(lastNameB);

    if (lastNameComparison !== 0) {
      return lastNameComparison;
    }

    const firstNameA = (a.userId?.firstName || "").toLowerCase();
    const firstNameB = (b.userId?.firstName || "").toLowerCase();

    return firstNameA.localeCompare(firstNameB);
  });

  const groups = new Map();

  for (const student of students) {
    const programCode = student.program?.code;

    if (!programCode) {
      res.status(400);
      throw new Error(
        `Programme code is missing for student ${student._id}.`
      );
    }

    const academicYear = student.intake?.academicYear;

    if (!academicYear) {
      res.status(400);
      throw new Error(
        `Academic year is missing for student ${student._id}.`
      );
    }

    const yearMatch = academicYear.match(/\d{4}/);

    if (!yearMatch) {
      res.status(400);
      throw new Error(
        `Invalid academic year for student ${student._id}.`
      );
    }

    const yearSuffix = yearMatch[0].slice(-2);
    const groupKey = `${programCode}-${yearSuffix}`;

    if (!groups.has(groupKey)) {
      groups.set(groupKey, {
        programCode,
        yearSuffix,
        students: []
      });
    }

    groups.get(groupKey).students.push(student);
  }

  const generatedStudents = [];

  for (const group of groups.values()) {
    const { programCode, yearSuffix, students: groupStudents } = group;

    const existingStudents = await Student.find({
      registrationNumber: {
        $regex: `^${programCode}-\\d{3}-${yearSuffix}$`
      }
    }).select("registrationNumber");

    let nextSequence = 1;

    for (const existingStudent of existingStudents) {
      const parts = existingStudent.registrationNumber.split("-");
      const sequence = Number(parts[1]);

      if (!Number.isNaN(sequence) && sequence >= nextSequence) {
        nextSequence = sequence + 1;
      }
    }

    for (const student of groupStudents) {
      const registrationNumber =
        `${programCode}-${String(nextSequence).padStart(3, "0")}-${yearSuffix}`;

      student.registrationNumber = registrationNumber;
      student.status = "Registered";
      student.registeredAt = new Date();

      await student.save();

      generatedStudents.push({
        studentId: student._id,
        name: `${student.userId.firstName} ${student.userId.lastName}`,
        program: student.program.name,
        registrationNumber
      });

      nextSequence++;
    }
  }

  res.status(200).json({
    success: true,
    message: "Registration numbers generated successfully.",
    count: generatedStudents.length,
    students: generatedStudents
  });
});

export const getRegistrationPreview = asyncHandler(async (req, res) => {
  const students = await Student.find({
    status: "Pending Registration",
    registrationNumber: null
  })
    .populate("userId", "firstName lastName email")
    .populate("program", "name code")
    .populate("intake", "name academicYear");

  if (students.length === 0) {
    return res.status(200).json({
      success: true,
      count: 0,
      preview: []
    });
  }

  students.sort((a, b) => {
    const lastNameA = (a.userId?.lastName || "").toLowerCase();
    const lastNameB = (b.userId?.lastName || "").toLowerCase();
    const lastNameComparison = lastNameA.localeCompare(lastNameB);

    if (lastNameComparison !== 0) {
      return lastNameComparison;
    }

    const firstNameA = (a.userId?.firstName || "").toLowerCase();
    const firstNameB = (b.userId?.firstName || "").toLowerCase();

    return firstNameA.localeCompare(firstNameB);
  });

  const groups = new Map();

  for (const student of students) {
    const programCode = student.program?.code;

    if (!programCode) {
      res.status(400);
      throw new Error(
        `Programme code is missing for student ${student._id}.`
      );
    }

    const academicYear = student.intake?.academicYear;

    if (!academicYear) {
      res.status(400);
      throw new Error(
        `Academic year is missing for student ${student._id}.`
      );
    }

    const yearMatch = academicYear.match(/\d{4}/);

    if (!yearMatch) {
      res.status(400);
      throw new Error(
        `Invalid academic year for student ${student._id}.`
      );
    }

    const yearSuffix = yearMatch[0].slice(-2);
    const groupKey = `${programCode}-${yearSuffix}`;

    if (!groups.has(groupKey)) {
      groups.set(groupKey, {
        programCode,
        yearSuffix,
        students: []
      });
    }

    groups.get(groupKey).students.push(student);
  }

  const preview = [];

  for (const group of groups.values()) {
    const { programCode, yearSuffix, students: groupStudents } = group;

    const existingStudents = await Student.find({
      registrationNumber: {
        $regex: `^${programCode}-\\d{3}-${yearSuffix}$`
      }
    }).select("registrationNumber");

    let nextSequence = 1;

    for (const existingStudent of existingStudents) {
      const parts = existingStudent.registrationNumber.split("-");
      const sequence = Number(parts[1]);

      if (!Number.isNaN(sequence) && sequence >= nextSequence) {
        nextSequence = sequence + 1;
      }
    }

    for (const student of groupStudents) {
      const registrationNumber =
        `${programCode}-${String(nextSequence).padStart(3, "0")}-${yearSuffix}`;

      preview.push({
        studentId: student._id,
        firstName: student.userId?.firstName,
        lastName: student.userId?.lastName,
        email: student.userId?.email,
        program: student.program?.name,
        programCode,
        academicYear: student.intake?.academicYear,
        registrationNumber
      });

      nextSequence++;
    }
  }

  preview.sort((a, b) => {
    const lastNameComparison =
      (a.lastName || "").localeCompare(b.lastName || "");

    if (lastNameComparison !== 0) {
      return lastNameComparison;
    }

    return (a.firstName || "").localeCompare(b.firstName || "");
  });

  res.status(200).json({
    success: true,
    count: preview.length,
    preview
  });
});

export const updateStudentStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;

  const allowedStatuses = [
    "Pending Registration",
    "Registered",
    "Active",
    "Suspended",
    "Graduated",
    "Withdrawn",
    "Dismissed"
  ];

  if (!status) {
    res.status(400);
    throw new Error("Student status is required.");
  }

  if (!allowedStatuses.includes(status)) {
    res.status(400);
    throw new Error(
      `Invalid student status. Allowed statuses are: ${allowedStatuses.join(", ")}.`
    );
  }

  const student = await Student.findById(req.params.id);

  if (!student) {
    res.status(404);
    throw new Error("Student not found.");
  }

  if (status === "Registered" || status === "Active") {
    if (!student.registrationNumber) {
      res.status(400);
      throw new Error(
        "The student must have a registration number before being marked as Registered or Active."
      );
    }
  }

  if (status === "Registered" && !student.registeredAt) {
    student.registeredAt = new Date();
  }

  student.status = status;

  await student.save();

  const updatedStudent = await Student.findById(student._id)
    .populate("userId", "firstName lastName email")
    .populate("program", "name code department duration")
    .populate("intake", "name academicYear");

  res.status(200).json({
    success: true,
    message: "Student status updated successfully.",
    student: updatedStudent
  });
});

export const getStudentStatistics = asyncHandler(async (req, res) => {
  const [
    totalStudents,
    pendingRegistration,
    registered,
    active,
    suspended,
    graduated,
    withdrawn,
    dismissed
  ] = await Promise.all([
    Student.countDocuments(),
    Student.countDocuments({ status: "Pending Registration" }),
    Student.countDocuments({ status: "Registered" }),
    Student.countDocuments({ status: "Active" }),
    Student.countDocuments({ status: "Suspended" }),
    Student.countDocuments({ status: "Graduated" }),
    Student.countDocuments({ status: "Withdrawn" }),
    Student.countDocuments({ status: "Dismissed" })
  ]);

  const studentsByProgram = await Student.aggregate([
    {
      $group: {
        _id: "$program",
        count: { $sum: 1 }
      }
    },
    {
      $lookup: {
        from: "programs",
        localField: "_id",
        foreignField: "_id",
        as: "program"
      }
    },
    {
      $unwind: {
        path: "$program",
        preserveNullAndEmptyArrays: true
      }
    },
    {
      $project: {
        _id: 0,
        programId: "$program._id",
        programName: "$program.name",
        programCode: "$program.code",
        count: 1
      }
    },
    {
      $sort: {
        count: -1
      }
    }
  ]);

  const studentsByAcademicYear = await Student.aggregate([
    {
      $group: {
        _id: "$academicYear",
        count: { $sum: 1 }
      }
    },
    {
      $project: {
        _id: 0,
        academicYear: "$_id",
        count: 1
      }
    },
    {
      $sort: {
        academicYear: -1
      }
    }
  ]);

  res.status(200).json({
    success: true,
    statistics: {
      totalStudents,
      status: {
        pendingRegistration,
        registered,
        active,
        suspended,
        graduated,
        withdrawn,
        dismissed
      },
      studentsByProgram,
      studentsByAcademicYear
    }
  });
});

/**
 * Build the admission confirmation email HTML for a student.
 */
const buildAdmissionEmailHtml = ({
  studentName,
  programName,
  programCode,
  intakeName,
  academicYear,
  registrationNumber,
}) => `
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="UTF-8" />
      <title>Admission Confirmation</title>
    </head>
    <body style="margin:0;padding:0;background-color:#f3f4f6;font-family:Arial,Helvetica,sans-serif;color:#1f2937;">
      <div style="max-width:650px;margin:30px auto;background-color:#ffffff;border-radius:10px;overflow:hidden;border:1px solid #e5e7eb;">

        <!-- HEADER -->
        <div style="background-color:#0284c7;padding:28px 30px;text-align:center;">
          <h1 style="margin:0;color:#ffffff;font-size:24px;">Admission Confirmation</h1>
        </div>

        <!-- CONTENT -->
        <div style="padding:30px;">
          <p style="font-size:16px;">Dear <strong>${studentName}</strong>,</p>

          <p style="font-size:15px;line-height:1.7;">
            We are pleased to inform you that you have been admitted to the following programme:
          </p>

          <!-- PROGRAMME -->
          <div style="margin:25px 0;padding:20px;background-color:#f0f9ff;border-left:4px solid #0284c7;">
            <p style="margin:0 0 8px;font-size:13px;color:#6b7280;">ADMITTED PROGRAMME</p>
            <h2 style="margin:0;color:#0369a1;font-size:20px;">${programName}</h2>
            ${
              programCode
                ? `<p style="margin:6px 0 0;font-size:14px;color:#4b5563;">Programme Code: ${programCode}</p>`
                : ""
            }
          </div>

          <!-- DETAILS -->
          <table style="width:100%;border-collapse:collapse;margin:20px 0;">
            <tr>
              <td style="padding:10px;border-bottom:1px solid #e5e7eb;font-weight:bold;">Intake</td>
              <td style="padding:10px;border-bottom:1px solid #e5e7eb;">${intakeName}</td>
            </tr>
            <tr>
              <td style="padding:10px;border-bottom:1px solid #e5e7eb;font-weight:bold;">Academic Year</td>
              <td style="padding:10px;border-bottom:1px solid #e5e7eb;">${academicYear}</td>
            </tr>
            <tr>
              <td style="padding:10px;border-bottom:1px solid #e5e7eb;font-weight:bold;">Registration Number</td>
              <td style="padding:10px;border-bottom:1px solid #e5e7eb;font-weight:bold;color:#0369a1;">${registrationNumber}</td>
            </tr>
          </table>

          <p style="font-size:15px;line-height:1.7;">
            Congratulations on your admission. Further information regarding registration,
            reporting dates, fees and other requirements will be communicated by the institution.
          </p>

          <p style="margin-top:30px;font-size:15px;">We look forward to welcoming you.</p>

          <p style="margin-top:25px;font-size:15px;">
            Kind regards,<br />
            <strong>Admissions Office</strong>
          </p>
        </div>

        <!-- FOOTER -->
        <div style="padding:18px 30px;background-color:#f9fafb;border-top:1px solid #e5e7eb;text-align:center;">
          <p style="margin:0;font-size:12px;color:#6b7280;">
            This is an automated admission notification. Please do not reply to this email.
          </p>
        </div>

      </div>
    </body>
  </html>
`;

export const sendAdmissionEmails = asyncHandler(async (req, res) => {
  const students = await Student.find({ status: "Registered" })
    .populate("userId", "firstName lastName email")
    .populate("program", "name code")
    .populate("intake", "name academicYear")
    .sort({ "userId.lastName": 1, "userId.firstName": 1 });

  if (students.length === 0) {
    res.status(400);
    throw new Error(
      "There are no registered students to send admission emails to."
    );
  }

  let sentCount = 0;
  let failedCount = 0;
  const results = [];

  for (const student of students) {
    const firstName = student.userId?.firstName || "";
    const lastName = student.userId?.lastName || "";
    const email = student.userId?.email;

    const studentName = `${firstName} ${lastName}`.trim() || "Student";
    const programName = student.program?.name || "your admitted programme";
    const programCode = student.program?.code || "";
    const intakeName = student.intake?.name || "the selected intake";
    const academicYear =
      student.intake?.academicYear || student.academicYear || "";
    const registrationNumber =
      student.registrationNumber || "Not yet assigned";

    // A student without an email cannot receive the admission email.
    if (!email) {
      failedCount++;
      results.push({
        studentId: student._id,
        name: studentName,
        email: null,
        status: "Failed",
        reason: "Student does not have an email address.",
      });
      continue;
    }

    const subject = `Admission Confirmation - ${programName}`;
    const html = buildAdmissionEmailHtml({
      studentName,
      programName,
      programCode,
      intakeName,
      academicYear,
      registrationNumber,
    });

    try {
      await sendEmail(email, subject, html);
      sentCount++;
      results.push({
        studentId: student._id,
        name: studentName,
        email,
        program: programName,
        status: "Sent",
      });
    } catch (error) {
      console.error(`Failed to send admission email to ${email}:`, error);
      failedCount++;
      results.push({
        studentId: student._id,
        name: studentName,
        email,
        program: programName,
        status: "Failed",
        reason: error.message || "Failed to send email.",
      });
    }
  }

  res.status(200).json({
    success: true,
    message: "Admission email sending process completed.",
    totalStudents: students.length,
    sent: sentCount,
    failed: failedCount,
    results,
  });
});