import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../../components/ui/Button";
import { getMyApplication } from "../../../services/studentApplicationService";

const ApplicationStatus = () => {
  const navigate = useNavigate();
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadApplication();
  }, []);

  const loadApplication = async () => {
    try {
      const data = await getMyApplication();
      setApplication(data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Submitted": return "#f59e0b";
      case "Under Review": return "#2563eb";
      case "Accepted": return "#16a34a";
      case "Rejected": return "#dc2626";
      default: return "#6b7280";
    }
  };

  if (loading) {
    return <h2>Loading application...</h2>;
  }

  if (!application) {
    return <h2>No application found.</h2>;
  }

  return (
    <div style={{ maxWidth: "1000px", margin: "40px auto", padding: "30px" }}>
      <h1>Application Status</h1>
      <p>Track the progress of your admission application.</p>

      <div style={{
        background: "#fff",
        padding: "25px",
        borderRadius: "10px",
        boxShadow: "0 2px 10px rgba(0,0,0,.08)",
        marginTop: "25px"
      }}>
        <h2>Current Status</h2>
        <div style={{
          display: "inline-block",
          marginTop: "15px",
          padding: "12px 20px",
          borderRadius: "30px",
          background: getStatusColor(application.status),
          color: "#fff",
          fontWeight: "bold"
        }}>
          {application.status}
        </div>
        <p style={{ marginTop: "25px" }}>
          {application.status === "Submitted" &&
            "Your application has been submitted successfully and is awaiting review."}
          {application.status === "Under Review" &&
            "Your application is currently being reviewed by the admissions office."}
          {application.status === "Accepted" &&
            "Congratulations! Your application has been accepted."}
          {application.status === "Rejected" &&
            "Unfortunately, your application was not successful."}
        </p>
      </div>

      <div style={{
        marginTop: "30px",
        background: "#fff",
        padding: "25px",
        borderRadius: "10px",
        boxShadow: "0 2px 10px rgba(0,0,0,.08)"
      }}>
        <h2>Application Progress</h2>
        <ul style={{ lineHeight: "2" }}>
          <li>✅ Personal Information</li>
          <li>✅ Contact Information</li>
          <li>✅ Next of Kin</li>
          <li>✅ Academic Information</li>
          <li>✅ Programme Selection</li>
          <li>✅ Documents Uploaded</li>
          <li>✅ Payment Completed</li>
          <li>✅ Application Submitted</li>
        </ul>
      </div>

      <div style={{
        marginTop: "30px",
        background: "#fff",
        padding: "25px",
        borderRadius: "10px",
        boxShadow: "0 2px 10px rgba(0,0,0,.08)"
      }}>
        <h2>Programme Choices</h2>
        <p><strong>1st Choice:</strong> {application.programChoice?.firstChoice?.name || "Not Selected"}</p>
        <p><strong>2nd Choice:</strong> {application.programChoice?.secondChoice?.name || "Not Selected"}</p>
        <p><strong>3rd Choice:</strong> {application.programChoice?.thirdChoice?.name || "Not Selected"}</p>
      </div>

      <div style={{
        marginTop: "30px",
        background: "#fff",
        padding: "25px",
        borderRadius: "10px",
        boxShadow: "0 2px 10px rgba(0,0,0,.08)"
      }}>
        <h2>Uploaded Documents</h2>
        {application.documents?.length > 0 ? (
          application.documents.map((doc, index) => (
            <p key={index}>✅ {doc.documentType}</p>
          ))
        ) : (
          <p>No documents uploaded.</p>
        )}
      </div>

      {application.remarks && (
        <div style={{
          marginTop: "30px",
          background: "#fef2f2",
          border: "1px solid #fecaca",
          padding: "20px",
          borderRadius: "10px"
        }}>
          <h2>Remarks</h2>
          <p>{application.remarks}</p>
        </div>
      )}

      <div style={{ display: "flex", justifyContent: "space-between", marginTop: "40px" }}>
        <Button text="Refresh" onClick={loadApplication} />
        <Button text="Logout" onClick={() => {
          sessionStorage.clear();
          navigate("/login");
        }} />
      </div>
    </div>
  );
};

export default ApplicationStatus;