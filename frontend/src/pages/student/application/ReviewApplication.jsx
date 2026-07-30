import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ApplicationStepper from "../../../components/student/ApplicationStepper";
import Button from "../../../components/ui/Button";
import { getMyApplication } from "../../../services/studentApplicationService";

const ReviewApplication = () => {
  const navigate = useNavigate();
  const [application, setApplication] = useState(null);

  useEffect(() => {
    loadApplication();
  }, []);

  const loadApplication = async () => {
    try {
      const data = await getMyApplication();
      setApplication(data);
    } catch (error) {
      console.log(error);
    }
  };

  if (!application) {
    return <p>Loading...</p>;
  }

  const sectionStyle = {
    background: "#fff",
    border: "1px solid #ddd",
    borderRadius: "10px",
    padding: "20px",
    marginBottom: "25px",
    boxShadow: "0 2px 8px rgba(0,0,0,.05)"
  };

  const headingStyle = {
    color: "#2563eb",
    marginBottom: "15px"
  };

  return (
    <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
      <ApplicationStepper currentStep={7} />
      <h2>Review Your Application</h2>
      <p>Please review all the information below carefully before proceeding to payment.</p>

      <div style={sectionStyle}>
        <h3 style={headingStyle}>Personal Information</h3>
        <p>
          <strong>Name:</strong>{" "}
          {application.personalInfo?.firstName}{" "}
          {application.personalInfo?.middleName}{" "}
          {application.personalInfo?.lastName}
        </p>
        <p><strong>Gender:</strong> {application.personalInfo?.gender || "Not provided"}</p>
        <p>
          <strong>Date of Birth:</strong>{" "}
          {application.personalInfo?.dateOfBirth
            ? application.personalInfo.dateOfBirth.substring(0, 10)
            : "Not provided"}
        </p>
        <p><strong>Nationality:</strong> {application.personalInfo?.nationality || "Not provided"}</p>
        <p><strong>National ID:</strong> {application.personalInfo?.nationalId || "Not provided"}</p>
      </div>

      <div style={sectionStyle}>
        <h3 style={headingStyle}>Contact Information</h3>
        <p><strong>Email:</strong> {application.contactInfo?.email || "Not provided"}</p>
        <p><strong>Phone:</strong> {application.contactInfo?.phone || "Not provided"}</p>
        <p><strong>Alternative Phone:</strong> {application.contactInfo?.alternativePhone || "Not provided"}</p>
        <p><strong>Address:</strong> {application.contactInfo?.address || "Not provided"}</p>
        <p><strong>District:</strong> {application.contactInfo?.district || "Not provided"}</p>
      </div>

      <div style={sectionStyle}>
        <h3 style={headingStyle}>Next of Kin</h3>
        <p><strong>Name:</strong> {application.nextOfKin?.fullName || "Not provided"}</p>
        <p><strong>Relationship:</strong> {application.nextOfKin?.relationship || "Not provided"}</p>
        <p><strong>Phone:</strong> {application.nextOfKin?.phone || "Not provided"}</p>
        <p><strong>Email:</strong> {application.nextOfKin?.email || "Not provided"}</p>
      </div>

      <div style={sectionStyle}>
        <h3 style={headingStyle}>Academic Information</h3>
        <p><strong>School:</strong> {application.academicInfo?.schoolName || "Not provided"}</p>
        <p><strong>Examination Number:</strong> {application.academicInfo?.examinationNumber || "Not provided"}</p>
        <p><strong>Year Completed:</strong> {application.academicInfo?.yearCompleted || "Not provided"}</p>

        <h4>Subjects</h4>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#2563eb", color: "#fff" }}>
              <th style={{ padding: "10px" }}>Subject</th>
              <th style={{ padding: "10px" }}>Grade</th>
            </tr>
          </thead>
          <tbody>
            {application.academicInfo?.subjects?.map((subject, index) => (
              <tr key={index}>
                <td style={{ border: "1px solid #ddd", padding: "10px" }}>
                  {subject.subject}
                </td>
                <td style={{ border: "1px solid #ddd", padding: "10px" }}>
                  {subject.grade}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={sectionStyle}>
        <h3 style={headingStyle}>Programme Choices</h3>
        <p><strong>1st Choice:</strong> {application.programChoice?.firstChoice?.name || "Not selected"}</p>
        <p><strong>2nd Choice:</strong> {application.programChoice?.secondChoice?.name || "Not selected"}</p>
        <p><strong>3rd Choice:</strong> {application.programChoice?.thirdChoice?.name || "Not selected"}</p>
      </div>

      <div style={sectionStyle}>
        <h3 style={headingStyle}>Uploaded Documents</h3>
        {application.documents?.length > 0 ? (
          application.documents.map((doc, index) => (
            <p key={index}>✅ {doc.documentType}</p>
          ))
        ) : (
          <p>No documents uploaded.</p>
        )}
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "50px" }}>
        <Button text="← Back" onClick={() => navigate("/student/application/documents")} />
        <Button text="Proceed to Payment →" onClick={() => navigate(`/student/payment/${application._id}`)} />
      </div>
    </div>
  );
};

export default ReviewApplication;