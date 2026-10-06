import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const generateStudentRegistryPDF = (students) => {
  const registeredStudents = students.filter(
    (student) => student.status === "Registered"
  );

  const doc = new jsPDF({
    orientation: "landscape",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = doc.internal.pageSize.getWidth();

  // ==========================================
  // HEADER
  // ==========================================

  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");

  doc.text(
    "STUDENT REGISTRY",
    pageWidth / 2,
    15,
    { align: "center" }
  );

  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");

  doc.text(
    "Registered Students",
    pageWidth / 2,
    22,
    { align: "center" }
  );

  // ==========================================
  // REPORT INFORMATION
  // ==========================================

  const generatedDate = new Date().toLocaleDateString(
    "en-GB",
    {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }
  );

  doc.setFontSize(9);

  doc.text(
    `Generated: ${generatedDate}`,
    14,
    31
  );

  doc.text(
    `Total Registered Students: ${registeredStudents.length}`,
    pageWidth - 14,
    31,
    { align: "right" }
  );

  // ==========================================
  // TABLE DATA
  // ==========================================

  const rows = registeredStudents.map((student) => {
    const firstName =
      student.userId?.firstName || "";

    const lastName =
      student.userId?.lastName || "";

    const fullName =
      `${firstName} ${lastName}`.trim();

    return [
      student.registrationNumber || "—",
      fullName || "—",
      student.userId?.email || "—",
      student.program?.name || "—",
      student.intake?.name || "—",
      student.academicYear || "—",
      student.status || "—",
    ];
  });

  // ==========================================
  // TABLE
  // ==========================================

  autoTable(doc, {
    startY: 37,

    head: [[
      "Registration Number",
      "Student",
      "Email",
      "Programme",
      "Intake",
      "Academic Year",
      "Status",
    ]],

    body: rows,

    theme: "grid",

    styles: {
      fontSize: 8,
      cellPadding: 3,
      valign: "middle",
    },

    headStyles: {
      fontStyle: "bold",
    },

    columnStyles: {
      0: {
        cellWidth: 32,
      },
      1: {
        cellWidth: 35,
      },
      2: {
        cellWidth: 55,
      },
      3: {
        cellWidth: 55,
      },
      4: {
        cellWidth: 45,
      },
      5: {
        cellWidth: 25,
      },
      6: {
        cellWidth: 25,
      },
    },

    margin: {
      left: 10,
      right: 10,
    },

    didDrawPage: (data) => {
      const pageHeight =
        doc.internal.pageSize.getHeight();

      // Footer
      doc.setFontSize(8);
      doc.setFont("helvetica", "normal");

      doc.text(
        `Student Registry | Page ${doc.internal.getNumberOfPages()}`,
        pageWidth / 2,
        pageHeight - 8,
        {
          align: "center",
        }
      );
    },
  });

  // ==========================================
  // SAVE
  // ==========================================

  const date = new Date()
    .toISOString()
    .split("T")[0];

  doc.save(`student-registry-${date}.pdf`);
};

export default generateStudentRegistryPDF;