import { useEffect, useMemo, useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import DashboardLayout from "../../../layouts/DashboardLayout";
import {
  getRegisteredStudents,
  sendAdmissionEmails,
} from "../../../services/studentRegistryService";

/**
 * Returns true if a student matches the given search keyword.
 */
const matchesKeyword = (student, keyword) => {
  if (!keyword) return true;

  const fields = [
    student.userId?.firstName,
    student.userId?.lastName,
    `${student.userId?.firstName || ""} ${student.userId?.lastName || ""}`,
    student.userId?.email,
    student.registrationNumber,
    student.program?.name,
    student.program?.code,
    student.intake?.name,
    student.academicYear?.toString(),
  ];

  return fields.some((value) =>
    value?.toString().toLowerCase().includes(keyword)
  );
};

/**
 * Format current date for the PDF.
 */
const getFormattedDate = () =>
  new Date().toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

/**
 * Generate the Student Registry PDF.
 *
 * The PDF always contains ALL registered students,
 * regardless of the current search/filter on the page.
 */
const generateStudentRegistryPDF = (students) => {
  const registeredStudents = students.filter(
    (student) => student.status === "Registered"
  );

  if (registeredStudents.length === 0) {
    window.alert("There are no registered students to export.");
    return;
  }

  const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
  const generatedDate = getFormattedDate();

  // Group students by programme.
  const groups = {};
  registeredStudents.forEach((student) => {
    const programId = student.program?._id || "unknown";
    if (!groups[programId]) {
      groups[programId] = { program: student.program, students: [] };
    }
    groups[programId].students.push(student);
  });
  const programGroups = Object.values(groups);

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  // ===== HEADER =====
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text("STUDENT REGISTRY", pageWidth / 2, 18, { align: "center" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text("Registered Students by Programme", pageWidth / 2, 25, {
    align: "center",
  });

  doc.setFontSize(9);
  doc.text(`Generated on ${generatedDate}`, pageWidth / 2, 31, {
    align: "center",
  });

  // ===== SUMMARY LINE =====
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.text(`Total Registered Students: ${registeredStudents.length}`, 14, 40);
  doc.text(`Total Programmes: ${programGroups.length}`, pageWidth - 14, 40, {
    align: "right",
  });

  // ===== DIVIDER =====
  doc.setLineWidth(0.5);
  doc.line(14, 44, pageWidth - 14, 44);

  let currentY = 51;

  // ===== ONE TABLE PER PROGRAMME =====
  programGroups.forEach((group, index) => {
    const programName = group.program?.name || "Unknown Programme";
    const programCode = group.program?.code || "";

    // Ensure there's room for the programme heading.
    if (currentY > pageHeight - 45) {
      doc.addPage();
      currentY = 20;
    }

    // Programme heading.
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    const heading = programCode
      ? `${programName} (${programCode})`
      : programName;
    doc.text(heading, 14, currentY);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    doc.text(
      `${group.students.length} ${
        group.students.length === 1 ? "student" : "students"
      }`,
      pageWidth - 14,
      currentY,
      { align: "right" }
    );

    currentY += 4;

    // Rows.
    const rows = group.students.map((student) => {
      const firstName = student.userId?.firstName || "";
      const lastName = student.userId?.lastName || "";
      const fullName = `${firstName} ${lastName}`.trim() || "—";

      return [
        student.registrationNumber || "—",
        fullName,
        student.userId?.email || "—",
        student.intake?.name || "—",
        student.academicYear || "—",
        student.status || "—",
      ];
    });

    autoTable(doc, {
      startY: currentY,
      head: [
        [
          "Registration Number",
          "Student",
          "Email",
          "Intake",
          "Academic Year",
          "Status",
        ],
      ],
      body: rows,
      theme: "grid",
      styles: {
        font: "helvetica",
        fontSize: 8,
        cellPadding: 3,
        valign: "middle",
        textColor: [30, 30, 30],
        lineColor: [180, 180, 180],
        lineWidth: 0.2,
      },
      headStyles: {
        fontStyle: "bold",
        fontSize: 8,
        fillColor: [240, 240, 240],
        textColor: [30, 30, 30],
        lineColor: [150, 150, 150],
        lineWidth: 0.3,
      },
      columnStyles: {
        0: { cellWidth: 38 },
        1: { cellWidth: 42 },
        2: { cellWidth: 65 },
        3: { cellWidth: 48 },
        4: { cellWidth: 30, halign: "center" },
        5: { cellWidth: 25, halign: "center" },
      },
      margin: { left: 14, right: 14, top: 18, bottom: 18 },
      showHead: "everyPage",
      rowPageBreak: "avoid",
      didDrawPage: () => {
        const pageNumber = doc.internal.getNumberOfPages();
        doc.setFont("helvetica", "normal");
        doc.setFontSize(8);
        doc.text("Student Registry", 14, pageHeight - 10);
        doc.text(`Page ${pageNumber}`, pageWidth - 14, pageHeight - 10, {
          align: "right",
        });
      },
    });

    // Advance past the table.
    currentY = doc.lastAutoTable?.finalY
      ? doc.lastAutoTable.finalY + 12
      : currentY + 30;

    // Spacing between programmes.
    if (index < programGroups.length - 1) currentY += 2;
  });

  doc.save("student-registry.pdf");
};

const StudentRegistry = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [generatingPDF, setGeneratingPDF] = useState(false);

  // Email states.
  const [sendingEmails, setSendingEmails] = useState(false);
  const [emailResult, setEmailResult] = useState(null);

  // ===== LOAD STUDENTS =====
  const loadStudents = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getRegisteredStudents();
      setStudents(data.students || []);
    } catch (error) {
      console.error("Error loading student registry:", error);
      setError(
        error.response?.data?.message ||
          "Failed to load the Student Registry."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStudents();
  }, []);

  // Master list: only registered students.
  const registeredStudents = useMemo(
    () => students.filter((student) => student.status === "Registered"),
    [students]
  );

  // Filter by search.
  const filteredStudents = useMemo(() => {
    const keyword = searchTerm.trim().toLowerCase();
    return registeredStudents.filter((student) =>
      matchesKeyword(student, keyword)
    );
  }, [registeredStudents, searchTerm]);

  // Group filtered students by programme.
  const studentsByProgram = useMemo(() => {
    const groups = {};
    filteredStudents.forEach((student) => {
      const programId = student.program?._id || "unknown";
      if (!groups[programId]) {
        groups[programId] = { program: student.program, students: [] };
      }
      groups[programId].students.push(student);
    });
    return Object.values(groups);
  }, [filteredStudents]);

  // Screen stats (reflect the current search).
  const totalStudents = filteredStudents.length;
  const totalPrograms = studentsByProgram.length;

  /**
   * Generate PDF from ALL registered students —
   * searching does not affect the PDF.
   */
  const handleGeneratePDF = () => {
    try {
      setGeneratingPDF(true);
      generateStudentRegistryPDF(registeredStudents);
    } catch (error) {
      console.error("Error generating Student Registry PDF:", error);
      window.alert("Failed to generate the Student Registry PDF.");
    } finally {
      setGeneratingPDF(false);
    }
  };

  /**
   * Send admission emails to ALL registered students.
   */
  const handleSendAdmissionEmails = async () => {
    if (registeredStudents.length === 0) {
      window.alert("There are no registered students to send emails to.");
      return;
    }

    const confirmed = window.confirm(
      `You are about to send admission emails to ${
        registeredStudents.length
      } registered student${
        registeredStudents.length === 1 ? "" : "s"
      }.\n\n` +
        "Each student will receive an email containing their admitted " +
        "programme, intake, academic year and registration number.\n\n" +
        "Do you want to continue?"
    );

    if (!confirmed) return;

    try {
      setSendingEmails(true);
      setEmailResult(null);

      const data = await sendAdmissionEmails();
      setEmailResult(data);

      window.alert(
        `Admission emails completed.\n\n` +
          `Sent: ${data.sent}\n` +
          `Failed: ${data.failed}`
      );
    } catch (error) {
      console.error("Error sending admission emails:", error);
      window.alert(
        error.response?.data?.message || "Failed to send admission emails."
      );
    } finally {
      setSendingEmails(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="p-6">
        {/* PAGE HEADER */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Student Registry</h1>
          <p className="mt-1 text-sm text-gray-600">
            View registered students grouped by their accepted programme.
          </p>
        </div>

        {/* SEARCH + ACTION BUTTONS */}
        <div className="mb-6 flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm md:flex-row md:items-end md:justify-between">
          <div className="w-full md:max-w-xl">
            <label
              htmlFor="student-search"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Search Students
            </label>

            <div className="relative">
              <input
                id="student-search"
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search name, registration number, email, programme, intake..."
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 pr-16 text-sm outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
              />

              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-medium text-gray-400 hover:text-gray-600"
                >
                  Clear
                </button>
              )}
            </div>

            {!loading && !error && (
              <p className="mt-2 text-xs text-gray-500">
                Showing{" "}
                <span className="font-semibold text-gray-700">
                  {totalStudents}
                </span>{" "}
                of{" "}
                <span className="font-semibold text-gray-700">
                  {registeredStudents.length}
                </span>{" "}
                registered students
              </p>
            )}
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">
            <button
              type="button"
              onClick={handleSendAdmissionEmails}
              disabled={
                loading || sendingEmails || registeredStudents.length === 0
              }
              className="inline-flex items-center justify-center rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {sendingEmails ? "Sending Emails..." : "Send Admission Emails"}
            </button>

            <button
              type="button"
              onClick={handleGeneratePDF}
              disabled={
                loading || generatingPDF || registeredStudents.length === 0
              }
              className="inline-flex items-center justify-center rounded-lg bg-sky-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {generatingPDF ? "Generating PDF..." : "Download PDF"}
            </button>
          </div>
        </div>

        {/* EMAIL RESULT */}
        {emailResult && (
          <div className="mb-6 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h3 className="text-base font-semibold text-gray-900">
                  Admission Email Results
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  The admission email sending process has completed.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setEmailResult(null)}
                className="text-sm font-medium text-gray-400 hover:text-gray-600"
              >
                Dismiss
              </button>
            </div>

            <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="rounded-lg bg-gray-50 p-4">
                <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                  Total
                </p>
                <p className="mt-1 text-2xl font-bold text-gray-900">
                  {emailResult.totalStudents ?? 0}
                </p>
              </div>

              <div className="rounded-lg bg-green-50 p-4">
                <p className="text-xs font-medium uppercase tracking-wide text-green-700">
                  Sent
                </p>
                <p className="mt-1 text-2xl font-bold text-green-700">
                  {emailResult.sent ?? 0}
                </p>
              </div>

              <div className="rounded-lg bg-red-50 p-4">
                <p className="text-xs font-medium uppercase tracking-wide text-red-700">
                  Failed
                </p>
                <p className="mt-1 text-2xl font-bold text-red-700">
                  {emailResult.failed ?? 0}
                </p>
              </div>
            </div>

            {emailResult.failed > 0 && (
              <div className="mt-5">
                <h4 className="text-sm font-semibold text-gray-900">
                  Failed Emails
                </h4>

                <div className="mt-3 overflow-x-auto rounded-lg border border-red-200">
                  <table className="min-w-full divide-y divide-red-100">
                    <thead className="bg-red-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-red-700">
                          Student
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-red-700">
                          Email
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-red-700">
                          Programme
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-red-700">
                          Reason
                        </th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-red-100 bg-white">
                      {emailResult.results
                        ?.filter((result) => result.status === "Failed")
                        .map((result) => (
                          <tr key={result.studentId}>
                            <td className="px-4 py-3 text-sm text-gray-900">
                              {result.name || "—"}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-600">
                              {result.email || "No email"}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-600">
                              {result.program || "—"}
                            </td>
                            <td className="px-4 py-3 text-sm text-red-600">
                              {result.reason || "Failed to send email."}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ERROR */}
        {error && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* SUMMARY */}
        {!loading && !error && (
          <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
              <p className="text-sm font-medium text-gray-500">
                Registered Students
              </p>
              <p className="mt-2 text-3xl font-bold text-gray-900">
                {totalStudents}
              </p>
              {searchTerm && (
                <p className="mt-1 text-xs text-gray-500">
                  Based on current search
                </p>
              )}
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
              <p className="text-sm font-medium text-gray-500">Programmes</p>
              <p className="mt-2 text-3xl font-bold text-sky-600">
                {totalPrograms}
              </p>
              {searchTerm && (
                <p className="mt-1 text-xs text-gray-500">
                  Programmes matching search
                </p>
              )}
            </div>
          </div>
        )}

        {/* LOADING */}
        {loading && (
          <div className="rounded-xl border border-gray-200 bg-white p-10 text-center shadow-sm">
            <p className="text-gray-600">Loading student registry...</p>
          </div>
        )}

        {/* EMPTY */}
        {!loading && !error && studentsByProgram.length === 0 && (
          <div className="rounded-xl border border-gray-200 bg-white p-10 text-center shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900">
              {searchTerm ? "No students found" : "No registered students"}
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              {searchTerm
                ? "Try a different search term."
                : "Students will appear here after they are added to the Student Registry."}
            </p>

            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm("")}
                className="mt-4 rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
              >
                Clear Search
              </button>
            )}
          </div>
        )}

        {/* PROGRAMME GROUPS */}
        {!loading && !error && studentsByProgram.length > 0 && (
          <div className="space-y-8">
            {studentsByProgram.map((group) => (
              <div
                key={group.program?._id || "unknown"}
                className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm"
              >
                {/* PROGRAMME HEADER */}
                <div className="border-b border-gray-200 bg-gray-50 px-6 py-5">
                  <div className="flex flex-col justify-between gap-2 md:flex-row md:items-center">
                    <div>
                      <h2 className="text-lg font-bold text-gray-900">
                        {group.program?.name || "Unknown Programme"}
                      </h2>
                      {group.program?.code && (
                        <p className="mt-1 text-sm font-medium text-sky-600">
                          {group.program.code}
                        </p>
                      )}
                    </div>

                    <div className="text-sm text-gray-500">
                      {group.students.length}{" "}
                      {group.students.length === 1 ? "student" : "students"}
                    </div>
                  </div>
                </div>

                {/* STUDENTS TABLE */}
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-white">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                          Reg. Number
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                          Student
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                          Email
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                          Intake
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                          Academic Year
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                          Status
                        </th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-200">
                      {group.students.map((student) => {
                        const firstName = student.userId?.firstName || "";
                        const lastName = student.userId?.lastName || "";

                        return (
                          <tr key={student._id} className="hover:bg-gray-50">
                            <td className="whitespace-nowrap px-6 py-4">
                              <span className="font-mono text-sm font-bold text-sky-700">
                                {student.registrationNumber || "—"}
                              </span>
                            </td>

                            <td className="whitespace-nowrap px-6 py-4">
                              <div className="text-sm font-medium text-gray-900">
                                {firstName} {lastName}
                              </div>
                            </td>

                            <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600">
                              {student.userId?.email || "—"}
                            </td>

                            <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-700">
                              {student.intake?.name || "—"}
                            </td>

                            <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-700">
                              {student.academicYear || "—"}
                            </td>

                            <td className="whitespace-nowrap px-6 py-4">
                              <span className="inline-flex rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                                {student.status}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default StudentRegistry;