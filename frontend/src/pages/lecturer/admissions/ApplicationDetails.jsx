import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Button from "../../../components/ui/Button";

import {
  getApplicationDetails,
  reviewApplication,
  acceptApplication,
  rejectApplication,
} from "../../../services/admissionService";

import DashboardLayout from "../../../layouts/DashboardLayout";

const ApplicationDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [application, setApplication] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [actionLoading, setActionLoading] = useState(false);

  const [remarks, setRemarks] = useState("");
  const [acceptedProgram, setAcceptedProgram] = useState("");

  /* =========================================
     FETCH APPLICATION
  ========================================= */

  const fetchApplication = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getApplicationDetails(id);

      console.log("===== APPLICATION DETAILS =====");
      console.log("Application:", data.application);
      console.log(
        "Accepted Programme:",
        data.application?.programChoice?.acceptedProgram
      );
      console.log("================================");

      setApplication(data.application);

      setRemarks(data.application?.remarks || "");

      setAcceptedProgram(
        data.application?.programChoice?.acceptedProgram?._id ||
          data.application?.programChoice?.acceptedProgram ||
          ""
      );
    } catch (error) {
      console.error("Failed to fetch application:", error);

      setError(
        error.response?.data?.message ||
          "Failed to load application details."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplication();
  }, [id]);

  /* =========================================
     START REVIEW
  ========================================= */

  const handleStartReview = async () => {
    try {
      setActionLoading(true);

      const data = await reviewApplication(id, remarks);

      setApplication(data.application);

      setAcceptedProgram(
        data.application?.programChoice?.acceptedProgram?._id ||
          data.application?.programChoice?.acceptedProgram ||
          ""
      );
    } catch (error) {
      console.error("Failed to review application:", error);

      alert(
        error.response?.data?.message ||
          "Failed to move application into review."
      );
    } finally {
      setActionLoading(false);
    }
  };

  /* =========================================
     ACCEPT APPLICATION
  ========================================= */

  const handleAccept = async () => {
    if (!acceptedProgram) {
      alert(
        "Please select the programme the applicant is being admitted to."
      );

      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to accept this application into the selected programme?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setActionLoading(true);

      const data = await acceptApplication(
        id,
        acceptedProgram,
        remarks
      );

      console.log(
        "Accepted Programme:",
        data.application?.programChoice?.acceptedProgram
      );

      setApplication(data.application);

      setAcceptedProgram(
        data.application?.programChoice?.acceptedProgram?._id ||
          data.application?.programChoice?.acceptedProgram ||
          acceptedProgram
      );
    } catch (error) {
      console.error("Failed to accept application:", error);

      alert(
        error.response?.data?.message ||
          "Failed to accept application."
      );
    } finally {
      setActionLoading(false);
    }
  };

  /* =========================================
     REJECT APPLICATION
  ========================================= */

  const handleReject = async () => {
    if (!remarks.trim()) {
      alert(
        "Please provide remarks before rejecting the application."
      );

      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to reject this application?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setActionLoading(true);

      const data = await rejectApplication(id, remarks);

      setApplication(data.application);
    } catch (error) {
      console.error("Failed to reject application:", error);

      alert(
        error.response?.data?.message ||
          "Failed to reject application."
      );
    } finally {
      setActionLoading(false);
    }
  };

  /* =========================================
     LOADING
  ========================================= */

  if (loading) {
    return (
      <DashboardLayout>
        <div
          style={{
            padding: "40px",
            textAlign: "center",
          }}
        >
          <p>Loading application...</p>
        </div>
      </DashboardLayout>
    );
  }

  /* =========================================
     ERROR
  ========================================= */

  if (error) {
    return (
      <DashboardLayout>
        <div
          style={{
            maxWidth: "1000px",
            margin: "0 auto",
          }}
        >
          <div
            style={{
              background: "#ffffff",
              border: "1px solid #fecaca",
              borderRadius: "10px",
              padding: "24px",
            }}
          >
            <p
              style={{
                color: "#dc2626",
                marginTop: 0,
              }}
            >
              {error}
            </p>

            <Button onClick={fetchApplication}>
              Try Again
            </Button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  /* =========================================
     APPLICATION NOT FOUND
  ========================================= */

  if (!application) {
    return (
      <DashboardLayout>
        <div
          style={{
            padding: "40px",
            textAlign: "center",
          }}
        >
          <p>Application not found.</p>
        </div>
      </DashboardLayout>
    );
  }

  const applicant = application.userId;
  const intake = application.intake;

  const firstChoice =
    application.programChoice?.firstChoice;

  const secondChoice =
    application.programChoice?.secondChoice;

  const thirdChoice =
    application.programChoice?.thirdChoice;

  const acceptedChoice =
    application.programChoice?.acceptedProgram;

  return (
    <DashboardLayout>
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        {/* BACK BUTTON */}

        <div
          style={{
            marginBottom: "20px",
          }}
        >
          <Button
            onClick={() =>
              navigate(
                `/lecturer/admissions/intakes/${intake?._id}/applications`
              )
            }
          >
            ← Back to Applications
          </Button>
        </div>

        {/* APPLICATION HEADER */}

        <div
          style={{
            background: "#ffffff",
            border: "1px solid #e5e7eb",
            borderRadius: "10px",
            padding: "24px",
            marginBottom: "20px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              gap: "20px",
            }}
          >
            <div>
              <h1
                style={{
                  margin: 0,
                  fontSize: "28px",
                  fontWeight: "700",
                  color: "#111827",
                }}
              >
                Application Details
              </h1>

              <p
                style={{
                  margin: "8px 0 0",
                  color: "#6b7280",
                }}
              >
                {applicant?.firstName} {applicant?.lastName}
              </p>

              <p
                style={{
                  margin: "4px 0 0",
                  fontSize: "14px",
                  color: "#6b7280",
                }}
              >
                Application No:{" "}
                <strong>
                  {application.applicationNumber || "N/A"}
                </strong>
              </p>
            </div>

            <StatusBadge status={application.status} />
          </div>

          {intake && (
            <div
              style={{
                marginTop: "20px",
                paddingTop: "20px",
                borderTop: "1px solid #e5e7eb",
              }}
            >
              <p
                style={{
                  margin: 0,
                  fontSize: "14px",
                  color: "#6b7280",
                }}
              >
                Intake
              </p>

              <p
                style={{
                  margin: "4px 0 0",
                  fontWeight: "600",
                  color: "#111827",
                }}
              >
                {intake.name} — {intake.academicYear}
              </p>
            </div>
          )}
        </div>

        {/* PERSONAL INFORMATION */}

        <Section title="Personal Information">
          <InfoGrid>
            <InfoItem
              label="First Name"
              value={application.personalInfo?.firstName}
            />

            <InfoItem
              label="Middle Name"
              value={application.personalInfo?.middleName}
            />

            <InfoItem
              label="Last Name"
              value={application.personalInfo?.lastName}
            />

            <InfoItem
              label="Gender"
              value={application.personalInfo?.gender}
            />

            <InfoItem
              label="Date of Birth"
              value={formatDate(
                application.personalInfo?.dateOfBirth
              )}
            />

            <InfoItem
              label="Nationality"
              value={application.personalInfo?.nationality}
            />

            <InfoItem
              label="National ID"
              value={application.personalInfo?.nationalId}
            />
          </InfoGrid>
        </Section>

        {/* CONTACT INFORMATION */}

        <Section title="Contact Information">
          <InfoGrid>
            <InfoItem
              label="Email"
              value={application.contactInfo?.email}
            />

            <InfoItem
              label="Phone"
              value={application.contactInfo?.phone}
            />

            <InfoItem
              label="Alternative Phone"
              value={application.contactInfo?.alternativePhone}
            />

            <InfoItem
              label="Address"
              value={application.contactInfo?.address}
            />

            <InfoItem
              label="District"
              value={application.contactInfo?.district}
            />

            <InfoItem
              label="Country"
              value={application.contactInfo?.country}
            />
          </InfoGrid>
        </Section>

        {/* NEXT OF KIN */}

        <Section title="Next of Kin">
          <InfoGrid>
            <InfoItem
              label="Full Name"
              value={application.nextOfKin?.fullName}
            />

            <InfoItem
              label="Relationship"
              value={application.nextOfKin?.relationship}
            />

            <InfoItem
              label="Phone"
              value={application.nextOfKin?.phone}
            />

            <InfoItem
              label="Email"
              value={application.nextOfKin?.email}
            />
          </InfoGrid>
        </Section>

        {/* ACADEMIC INFORMATION */}

        <Section title="Academic Information">
          <InfoGrid>
            <InfoItem
              label="School"
              value={application.academicInfo?.schoolName}
            />

            <InfoItem
              label="Examination Number"
              value={
                application.academicInfo?.examinationNumber
              }
            />

            <InfoItem
              label="Year Completed"
              value={application.academicInfo?.yearCompleted}
            />
          </InfoGrid>

          {application.academicInfo?.subjects?.length > 0 && (
            <div style={{ marginTop: "24px" }}>
              <h3
                style={{
                  margin: "0 0 12px",
                  fontSize: "15px",
                  fontWeight: "600",
                  color: "#111827",
                }}
              >
                Subjects and Grades
              </h3>

              <div style={{ overflowX: "auto" }}>
                <table
                  style={{
                    width: "100%",
                    borderCollapse: "collapse",
                  }}
                >
                  <thead>
                    <tr style={{ background: "#f9fafb" }}>
                      <th style={headerStyle}>Subject</th>
                      <th style={headerStyle}>Grade</th>
                    </tr>
                  </thead>

                  <tbody>
                    {application.academicInfo.subjects.map(
                      (subject, index) => (
                        <tr
                          key={index}
                          style={{
                            borderTop:
                              "1px solid #e5e7eb",
                          }}
                        >
                          <td style={cellStyle}>
                            {subject.subject || "N/A"}
                          </td>

                          <td style={cellStyle}>
                            {subject.grade || "N/A"}
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </Section>

        {/* =========================================
            PROGRAMME CHOICES
        ========================================= */}

        <Section title="Programme Choices">
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "16px",
            }}
          >
            {firstChoice && (
  <ChoiceCard
    program={firstChoice.name}
    accepted={
      acceptedChoice?._id &&
      firstChoice?._id &&
      acceptedChoice._id === firstChoice._id
    }
  />
)}

{secondChoice && (
  <ChoiceCard
    program={secondChoice.name}
    accepted={
      acceptedChoice?._id &&
      secondChoice?._id &&
      acceptedChoice._id === secondChoice._id
    }
  />
)}

{thirdChoice && (
  <ChoiceCard
    program={thirdChoice.name}
    accepted={
      acceptedChoice?._id &&
      thirdChoice?._id &&
      acceptedChoice._id === thirdChoice._id
    }
  />
)}
          </div>

          {/* =========================================
              CLEAR ADMITTED PROGRAMME
          ========================================= */}

          {application.status === "Accepted" && acceptedChoice && (
            <div
              style={{
                marginTop: "20px",
                padding: "20px",
                background: "#f0fdf4",
                border: "2px solid #22c55e",
                borderRadius: "10px",
              }}
            >
              <p
                style={{
                  margin: 0,
                  fontSize: "12px",
                  fontWeight: "700",
                  color: "#166534",
                  textTransform: "uppercase",
                }}
              >
                Student Admitted Into
              </p>

              <h3
                style={{
                  margin: "8px 0 0",
                  fontSize: "20px",
                  color: "#166534",
                }}
              >
                {acceptedChoice.name}
              </h3>
            </div>
          )}
        </Section>

        {/* DOCUMENTS */}

        <Section title="Uploaded Documents">
          {!application.documents ||
          application.documents.length === 0 ? (
            <p
              style={{
                color: "#6b7280",
                margin: 0,
              }}
            >
              No documents uploaded.
            </p>
          ) : (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "10px",
              }}
            >
              {application.documents.map(
                (document, index) => (
                  <div
                    key={document._id || index}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: "20px",
                      padding: "14px 16px",
                      border: "1px solid #e5e7eb",
                      borderRadius: "8px",
                    }}
                  >
                    <div>
                      <p
                        style={{
                          margin: 0,
                          fontWeight: "600",
                          color: "#111827",
                        }}
                      >
                        {document.documentType}
                      </p>

                      <p
                        style={{
                          margin: "4px 0 0",
                          fontSize: "13px",
                          color: "#6b7280",
                        }}
                      >
                        {document.fileName}
                      </p>
                    </div>

                    {document.fileUrl && (
                      <Button
                        onClick={() =>
                          window.open(
                            document.fileUrl,
                            "_blank",
                            "noopener,noreferrer"
                          )
                        }
                      >
                        View Document
                      </Button>
                    )}
                  </div>
                )
              )}
            </div>
          )}
        </Section>

        {/* PAYMENT INFORMATION */}

        <Section title="Payment Information">
          <InfoGrid>
            <InfoItem
              label="Payment Status"
              value={application.paymentStatus}
            />

            <InfoItem
              label="Application Fee"
              value={
                application.applicationFee
                  ? `MWK ${Number(
                      application.applicationFee
                    ).toLocaleString()}`
                  : "N/A"
              }
            />

            <InfoItem
              label="Payment Method"
              value={
                application.paymentInfo?.paymentMethod ||
                "N/A"
              }
            />

            <InfoItem
              label="Transaction Reference"
              value={
                application.paymentInfo?.transactionReference ||
                "N/A"
              }
            />
          </InfoGrid>
        </Section>

        {/* ADMISSION REVIEW */}

        <Section title="Admission Review">

          {application.reviewedBy && (
            <div
              style={{
                marginBottom: "20px",
                padding: "14px 16px",
                background: "#f9fafb",
                borderRadius: "8px",
              }}
            >
              <p
                style={{
                  margin: 0,
                  fontSize: "14px",
                  color: "#374151",
                }}
              >
                Reviewed by:{" "}
                <strong>
                  {application.reviewedBy.firstName}{" "}
                  {application.reviewedBy.lastName}
                </strong>
              </p>

              {application.reviewedAt && (
                <p
                  style={{
                    margin: "5px 0 0",
                    fontSize: "13px",
                    color: "#6b7280",
                  }}
                >
                  {formatDate(application.reviewedAt)}
                </p>
              )}
            </div>
          )}

          {/* ACCEPTED PROGRAMME */}

          {application.status === "Accepted" &&
            acceptedChoice && (
              <div
                style={{
                  marginBottom: "20px",
                  padding: "16px",
                  background: "#f0fdf4",
                  border: "1px solid #bbf7d0",
                  borderRadius: "8px",
                }}
              >
                <p
                  style={{
                    margin: 0,
                    fontSize: "12px",
                    fontWeight: "600",
                    color: "#166534",
                    textTransform: "uppercase",
                  }}
                >
                  Accepted Programme
                </p>

                <p
                  style={{
                    margin: "6px 0 0",
                    fontSize: "16px",
                    fontWeight: "700",
                    color: "#166534",
                  }}
                >
                  {acceptedChoice.name}
                </p>
              </div>
            )}

          {/* PROGRAMME TO ADMIT */}

          {application.status === "Under Review" && (
            <div style={{ marginBottom: "20px" }}>
              <label
                htmlFor="acceptedProgram"
                style={{
                  display: "block",
                  fontWeight: "600",
                  marginBottom: "8px",
                }}
              >
                Programme to Admit
              </label>

              <select
                id="acceptedProgram"
                value={acceptedProgram}
                onChange={(event) =>
                  setAcceptedProgram(event.target.value)
                }
                disabled={actionLoading}
                style={{
                  width: "100%",
                  padding: "12px",
                  border: "1px solid #d1d5db",
                  borderRadius: "8px",
                  backgroundColor: "#fff",
                }}
              >
                <option value="">
                  Select programme to admit
                </option>

                {firstChoice && (
                  <option value={firstChoice._id}>
                    1st Choice — {firstChoice.name}
                  </option>
                )}

                {secondChoice && (
                  <option value={secondChoice._id}>
                    2nd Choice — {secondChoice.name}
                  </option>
                )}

                {thirdChoice && (
                  <option value={thirdChoice._id}>
                    3rd Choice — {thirdChoice.name}
                  </option>
                )}
              </select>

              <p
                style={{
                  marginTop: "8px",
                  fontSize: "13px",
                  color: "#6b7280",
                }}
              >
                Select the programme in which this applicant is
                being admitted.
              </p>
            </div>
          )}

          {/* REMARKS */}

          <div style={{ marginBottom: "20px" }}>
            <label
              htmlFor="remarks"
              style={{
                display: "block",
                marginBottom: "8px",
                fontSize: "14px",
                fontWeight: "600",
                color: "#374151",
              }}
            >
              Remarks
            </label>

            <textarea
              id="remarks"
              value={remarks}
              onChange={(event) =>
                setRemarks(event.target.value)
              }
              placeholder="Enter remarks about this application..."
              rows={5}
              disabled={
                actionLoading ||
                application.status === "Accepted" ||
                application.status === "Rejected"
              }
              style={{
                width: "100%",
                padding: "12px",
                border: "1px solid #d1d5db",
                borderRadius: "8px",
                resize: "vertical",
                fontSize: "14px",
                boxSizing: "border-box",
              }}
            />
          </div>

          {/* ACTIONS */}

          <div
            style={{
              display: "flex",
              gap: "12px",
              flexWrap: "wrap",
            }}
          >
            {application.status === "Submitted" && (
              <Button
                onClick={handleStartReview}
                disabled={actionLoading}
              >
                {actionLoading
                  ? "Starting Review..."
                  : "Start Review"}
              </Button>
            )}

            {application.status === "Under Review" && (
              <>
                <Button
                  onClick={handleAccept}
                  disabled={
                    actionLoading || !acceptedProgram
                  }
                >
                  {actionLoading
                    ? "Processing..."
                    : "Accept Application"}
                </Button>

                <Button
                  onClick={handleReject}
                  disabled={actionLoading}
                >
                  {actionLoading
                    ? "Processing..."
                    : "Reject Application"}
                </Button>
              </>
            )}
          </div>

          {/* ACCEPTED MESSAGE */}

          {application.status === "Accepted" && (
            <p
              style={{
                margin: "20px 0 0",
                padding: "14px 16px",
                background: "#dcfce7",
                color: "#166534",
                borderRadius: "8px",
                fontSize: "14px",
              }}
            >
              This application has been accepted into{" "}
              <strong>
                {acceptedChoice?.name ||
                  "the selected programme"}
                .
              </strong>
            </p>
          )}

          {/* REJECTED MESSAGE */}

          {application.status === "Rejected" && (
            <p
              style={{
                margin: "20px 0 0",
                padding: "14px 16px",
                background: "#fee2e2",
                color: "#991b1b",
                borderRadius: "8px",
                fontSize: "14px",
              }}
            >
              This application has been rejected.
            </p>
          )}
        </Section>
      </div>
    </DashboardLayout>
  );
};

/* =========================================
   SECTION COMPONENT
========================================= */

const Section = ({ title, children }) => {
  return (
    <section
      style={{
        background: "#ffffff",
        border: "1px solid #e5e7eb",
        borderRadius: "10px",
        padding: "24px",
        marginBottom: "20px",
      }}
    >
      <h2
        style={{
          margin: "0 0 20px",
          fontSize: "18px",
          fontWeight: "700",
          color: "#111827",
        }}
      >
        {title}
      </h2>

      {children}
    </section>
  );
};

/* =========================================
   INFORMATION GRID
========================================= */

const InfoGrid = ({ children }) => {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns:
          "repeat(auto-fit, minmax(220px, 1fr))",
        gap: "20px",
      }}
    >
      {children}
    </div>
  );
};

/* =========================================
   INFORMATION ITEM
========================================= */

const InfoItem = ({ label, value }) => {
  return (
    <div>
      <p
        style={{
          margin: 0,
          fontSize: "12px",
          fontWeight: "600",
          color: "#6b7280",
          textTransform: "uppercase",
          letterSpacing: "0.03em",
        }}
      >
        {label}
      </p>

      <p
        style={{
          margin: "5px 0 0",
          fontSize: "14px",
          color: "#111827",
          wordBreak: "break-word",
        }}
      >
        {value || "N/A"}
      </p>
    </div>
  );
};

/* =========================================
   PROGRAMME CHOICE CARD
========================================= */

const ChoiceCard = ({ number, program, accepted }) => {
  return (
    <div
      style={{
        padding: "18px",
        border: accepted
          ? "2px solid #16a34a"
          : "1px solid #e5e7eb",
        borderRadius: "8px",
        background: accepted
          ? "#f0fdf4"
          : "#f9fafb",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "10px",
        }}
      >
        <p
          style={{
            margin: 0,
            fontSize: "12px",
            fontWeight: "600",
            color: "#6b7280",
            textTransform: "uppercase",
          }}
        >
          {number}
        </p>

        {accepted && (
          <span
            style={{
              fontSize: "11px",
              fontWeight: "700",
              color: "#166534",
            }}
          >
            ADMITTED
          </span>
        )}
      </div>

      <p
        style={{
          margin: "8px 0 0",
          fontSize: "15px",
          fontWeight: "600",
          color: "#111827",
        }}
      >
        {program || "Not selected"}
      </p>
    </div>
  );
};

/* =========================================
   STATUS BADGE
========================================= */

const StatusBadge = ({ status }) => {
  let background = "#f3f4f6";
  let color = "#374151";

  if (status === "Submitted") {
    background = "#dbeafe";
    color = "#1d4ed8";
  }

  if (status === "Under Review") {
    background = "#fef3c7";
    color = "#92400e";
  }

  if (status === "Accepted") {
    background = "#dcfce7";
    color = "#166534";
  }

  if (status === "Rejected") {
    background = "#fee2e2";
    color = "#991b1b";
  }

  return (
    <span
      style={{
        display: "inline-block",
        padding: "7px 12px",
        borderRadius: "999px",
        background,
        color,
        fontSize: "12px",
        fontWeight: "600",
        whiteSpace: "nowrap",
      }}
    >
      {status}
    </span>
  );
};

/* =========================================
   DATE FORMATTER
========================================= */

const formatDate = (date) => {
  if (!date) {
    return "N/A";
  }

  return new Date(date).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

/* =========================================
   TABLE STYLES
========================================= */

const headerStyle = {
  padding: "12px 16px",
  textAlign: "left",
  fontSize: "13px",
  fontWeight: "600",
  color: "#374151",
};

const cellStyle = {
  padding: "12px 16px",
  fontSize: "14px",
  color: "#374151",
};

export default ApplicationDetails;