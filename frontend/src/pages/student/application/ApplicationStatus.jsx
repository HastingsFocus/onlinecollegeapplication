import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Button from "../../../components/ui/Button";
import {
  getMyApplication,
} from "../../../services/studentApplicationService";

const ApplicationStatus = () => {
  const navigate = useNavigate();

  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadApplication();
  }, []);

  const loadApplication = async () => {
    try {
      setLoading(true);

      const data = await getMyApplication();

      setApplication(data);
    } catch (error) {
      console.error("Failed to load application:", error);

      alert(
        error.response?.data?.message ||
          "Failed to load application status."
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: "30px" }}>
        <p>Loading application status...</p>
      </div>
    );
  }

  if (!application) {
    return (
      <div style={{ padding: "30px" }}>
        <h2>Application Status</h2>
        <p>No application found.</p>
      </div>
    );
  }

  const acceptedProgram =
    application.programChoice?.acceptedProgram;

  return (
    <div style={{ padding: "30px" }}>
      <h2 style={{ marginBottom: "10px" }}>
        Application Status
      </h2>

      <p style={{ marginBottom: "30px" }}>
        View the status of your college application.
      </p>

      {/* Application Status */}
      <div
        style={{
          padding: "20px",
          border: "1px solid #ddd",
          borderRadius: "10px",
          marginBottom: "25px",
        }}
      >
        <h3>Application Status</h3>

        <p
          style={{
            fontWeight: "600",
            fontSize: "18px",
            marginTop: "10px",
          }}
        >
          {application.status}
        </p>
      </div>

      {/* ACCEPTED PROGRAM */}
      {application.status === "Accepted" && acceptedProgram && (
        <div
          style={{
            padding: "25px",
            borderRadius: "10px",
            marginBottom: "25px",
            border: "2px solid #22c55e",
            backgroundColor: "#f0fdf4",
          }}
        >
          <h3
            style={{
              color: "#15803d",
              marginBottom: "10px",
            }}
          >
            Admission Confirmed
          </h3>

          <p
            style={{
              marginBottom: "8px",
              color: "#166534",
            }}
          >
            Congratulations! You have been accepted into:
          </p>

          <h2
            style={{
              color: "#166534",
              margin: 0,
            }}
          >
            {acceptedProgram.name}
          </h2>
        </div>
      )}

      {/* PROGRAMME CHOICES */}
      <div
        style={{
          padding: "20px",
          border: "1px solid #ddd",
          borderRadius: "10px",
          marginBottom: "25px",
        }}
      >
        <h3 style={{ marginBottom: "20px" }}>
          Programme Choices
        </h3>

        <p>
          <strong>1st Choice:</strong>{" "}
          {application.programChoice?.firstChoice?.name || "Not selected"}
        </p>

        <p>
          <strong>2nd Choice:</strong>{" "}
          {application.programChoice?.secondChoice?.name || "Not selected"}
        </p>

        <p>
          <strong>3rd Choice:</strong>{" "}
          {application.programChoice?.thirdChoice?.name || "Not selected"}
        </p>

        {/* Show accepted programme */}
        {application.status === "Accepted" && acceptedProgram && (
          <p
            style={{
              marginTop: "20px",
              paddingTop: "15px",
              borderTop: "1px solid #ddd",
            }}
          >
            <strong>Accepted Programme:</strong>{" "}
            {acceptedProgram.name}
          </p>
        )}
      </div>

      {/* REMARKS */}
      {application.remarks && (
        <div
          style={{
            padding: "20px",
            border: "1px solid #ddd",
            borderRadius: "10px",
            marginBottom: "25px",
          }}
        >
          <h3>Remarks</h3>

          <p>{application.remarks}</p>
        </div>
      )}

      {/* ACTIONS */}
      <div
        style={{
          display: "flex",
          gap: "15px",
          marginTop: "25px",
        }}
      >
        <Button
          text="Refresh"
          onClick={loadApplication}
        />

        <Button
          text="Back to Dashboard"
          onClick={() => navigate("/student/dashboard")}
        />
      </div>
    </div>
  );
};

export default ApplicationStatus;