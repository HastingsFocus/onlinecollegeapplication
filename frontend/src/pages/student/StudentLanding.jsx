import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getMyApplication } from "../../services/studentApplicationService";

const StudentLanding = () => {
  const navigate = useNavigate();

  useEffect(() => {
    checkApplication();
  }, []);

  const getNextStep = (application) => {
    const progress = application.progress || {};

    if (!progress.personalCompleted) return "/student/application/personal";
    if (!progress.contactCompleted) return "/student/application/contact";
    if (!progress.nextOfKinCompleted) return "/student/application/next-of-kin";
    if (!progress.academicCompleted) return "/student/application/academic";
    if (!progress.programCompleted) return "/student/application/programs";
    if (!progress.documentsCompleted) return "/student/application/documents";
    return "/student/application/review";
  };

  const checkApplication = async () => {
    try {
      const application = await getMyApplication();

      switch (application.status) {
        case "Draft":
          navigate(getNextStep(application));
          break;
        case "Submitted":
        case "Under Review":
        case "Accepted":
        case "Rejected":
          navigate("/student/application/status");
          break;
        default:
          navigate("/student/application/welcome");
      }
    } catch (error) {
      console.log("No application found:", error);
      navigate("/student/application/welcome");
    }
  };

  return (
    <div style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
      fontSize: "20px",
      fontWeight: "500"
    }}>
      Loading your application...
    </div>
  );
};

export default StudentLanding;