import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ApplicationStepper from "../../../components/student/ApplicationStepper";
import Button from "../../../components/ui/Button";
import { submitApplication } from "../../../services/studentApplicationService";

const SubmitApplication = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!window.confirm("Are you sure you want to submit your application? You will not be able to edit it afterwards.")) {
      return;
    }
    try {
      setLoading(true);
      await submitApplication();
      alert("Application submitted successfully.");
      navigate("/student/application/status");
    } catch (error) {
      console.log(error);
      alert(error.response?.data?.message || "Unable to submit application.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "900px", margin: "0 auto", paddingBottom: "40px" }}>
      <ApplicationStepper currentStep={9} />

      <div style={{
        background: "#fff",
        padding: "35px",
        borderRadius: "12px",
        boxShadow: "0 5px 15px rgba(0,0,0,.08)"
      }}>
        <h2 style={{ color: "#2563eb", marginBottom: "20px" }}>
          Submit Application
        </h2>

        <div style={{
          background: "#fefce8",
          border: "1px solid #fde68a",
          borderRadius: "10px",
          padding: "20px",
          marginBottom: "30px"
        }}>
          <h3>Declaration</h3>
          <p>I declare that the information provided in this application is true and accurate to the best of my knowledge.</p>
          <p>I understand that providing false information may result in the rejection of my application.</p>
          <p>After submission, I understand that I will no longer be able to edit my application.</p>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <Button text="← Back" onClick={() => navigate("/student/payment/success")} />
          <Button text="Submit Application" loading={loading} onClick={handleSubmit} />
        </div>
      </div>
    </div>
  );
};

export default SubmitApplication;