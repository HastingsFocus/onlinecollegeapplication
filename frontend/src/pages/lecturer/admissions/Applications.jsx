import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Button from "../../../components/ui/Button";
import {
  getApplicationsByIntake,
} from "../../../services/admissionService";

import DashboardLayout from "../../../layouts/DashboardLayout";

const Applications = () => {
  const { intakeId } = useParams();
  const navigate = useNavigate();

  const [applications, setApplications] = useState([]);
  const [intake, setIntake] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchApplications = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getApplicationsByIntake(intakeId);

      setApplications(data.applications || []);
      setIntake(data.intake || null);
    } catch (error) {
      console.error("Failed to fetch applications:", error);

      setError(
        error.response?.data?.message ||
          "Failed to load applications."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, [intakeId]);

  return (
    <DashboardLayout>
      <div
        style={{
          maxWidth: "1400px",
          margin: "0 auto",
        }}
      >
        {/* =========================================
            PAGE HEADER
        ========================================= */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "24px",
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
              Applications
            </h1>

            {intake && (
              <p
                style={{
                  marginTop: "6px",
                  marginBottom: 0,
                  color: "#6b7280",
                  fontSize: "15px",
                }}
              >
                {intake.name} — {intake.academicYear}
              </p>
            )}
          </div>

          <Button
            onClick={() =>
              navigate("/lecturer/admissions/intakes")
            }
          >
            Back to Intakes
          </Button>
        </div>

        {/* =========================================
            LOADING
        ========================================= */}
        {loading && (
          <div
            style={{
              background: "#ffffff",
              border: "1px solid #e5e7eb",
              borderRadius: "10px",
              padding: "40px",
              textAlign: "center",
            }}
          >
            <p
              style={{
                margin: 0,
                color: "#6b7280",
              }}
            >
              Loading applications...
            </p>
          </div>
        )}

        {/* =========================================
            ERROR
        ========================================= */}
        {!loading && error && (
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
                marginTop: 0,
                color: "#dc2626",
              }}
            >
              {error}
            </p>

            <Button onClick={fetchApplications}>
              Try Again
            </Button>
          </div>
        )}

        {/* =========================================
            APPLICATIONS
        ========================================= */}
        {!loading && !error && (
          <>
            {/* APPLICATION COUNT */}
            <div
              style={{
                display: "flex",
                gap: "16px",
                marginBottom: "20px",
              }}
            >
              <div
                style={{
                  background: "#ffffff",
                  border: "1px solid #e5e7eb",
                  borderRadius: "10px",
                  padding: "18px 22px",
                  minWidth: "180px",
                }}
              >
                <p
                  style={{
                    margin: 0,
                    fontSize: "13px",
                    color: "#6b7280",
                  }}
                >
                  Total Applications
                </p>

                <h2
                  style={{
                    margin: "6px 0 0",
                    fontSize: "26px",
                    color: "#111827",
                  }}
                >
                  {applications.length}
                </h2>
              </div>
            </div>

            {/* NO APPLICATIONS */}
            {applications.length === 0 ? (
              <div
                style={{
                  background: "#ffffff",
                  border: "1px solid #e5e7eb",
                  borderRadius: "10px",
                  padding: "50px 20px",
                  textAlign: "center",
                }}
              >
                <h3
                  style={{
                    margin: "0 0 8px",
                    color: "#111827",
                  }}
                >
                  No Applications Found
                </h3>

                <p
                  style={{
                    margin: 0,
                    color: "#6b7280",
                  }}
                >
                  There are currently no applications for this
                  intake.
                </p>
              </div>
            ) : (
              /* APPLICATION TABLE */
              <div
                style={{
                  background: "#ffffff",
                  border: "1px solid #e5e7eb",
                  borderRadius: "10px",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    overflowX: "auto",
                  }}
                >
                  <table
                    style={{
                      width: "100%",
                      borderCollapse: "collapse",
                    }}
                  >
                    <thead>
                      <tr
                        style={{
                          background: "#f9fafb",
                          borderBottom: "1px solid #e5e7eb",
                        }}
                      >
                        <th style={headerStyle}>
                          Applicant
                        </th>

                        <th style={headerStyle}>
                          Application Number
                        </th>

                        <th style={headerStyle}>
                          First Choice
                        </th>

                        <th style={headerStyle}>
                          Status
                        </th>

                        <th style={headerStyle}>
                          Submitted
                        </th>

                        <th style={headerStyle}>
                          Action
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {applications.map((application) => {
                        const applicant = application.userId;

                        return (
                          <tr
                            key={application._id}
                            style={{
                              borderBottom:
                                "1px solid #f3f4f6",
                            }}
                          >
                            {/* APPLICANT */}
                            <td style={cellStyle}>
                              {applicant ? (
                                <div>
                                  <div
                                    style={{
                                      fontWeight: "600",
                                      color: "#111827",
                                    }}
                                  >
                                    {applicant.firstName}{" "}
                                    {applicant.lastName}
                                  </div>

                                  <div
                                    style={{
                                      marginTop: "3px",
                                      fontSize: "13px",
                                      color: "#6b7280",
                                    }}
                                  >
                                    {applicant.email}
                                  </div>
                                </div>
                              ) : (
                                "N/A"
                              )}
                            </td>

                            {/* APPLICATION NUMBER */}
                            <td style={cellStyle}>
                              {application.applicationNumber ||
                                "N/A"}
                            </td>

                            {/* FIRST CHOICE */}
                            <td style={cellStyle}>
                              {application.programChoice
                                ?.firstChoice?.name || "N/A"}
                            </td>

                            {/* STATUS */}
                            <td style={cellStyle}>
                              <StatusBadge
                                status={application.status}
                              />
                            </td>

                            {/* SUBMITTED DATE */}
                            <td style={cellStyle}>
                              {application.submittedAt
                                ? new Date(
                                    application.submittedAt
                                  ).toLocaleDateString()
                                : "N/A"}
                            </td>

                            {/* ACTION */}
                            <td style={cellStyle}>
                              <Button
                                onClick={() =>
                                  navigate(
                                    `/lecturer/admissions/applications/${application._id}`
                                  )
                                }
                              >
                                View Details
                              </Button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </DashboardLayout>
  );
};

/* =========================================
   TABLE STYLES
========================================= */

const headerStyle = {
  padding: "14px 16px",
  textAlign: "left",
  fontSize: "13px",
  fontWeight: "600",
  color: "#374151",
  whiteSpace: "nowrap",
};

const cellStyle = {
  padding: "16px",
  fontSize: "14px",
  color: "#374151",
  verticalAlign: "middle",
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
        padding: "5px 10px",
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

export default Applications;