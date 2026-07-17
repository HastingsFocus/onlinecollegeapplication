import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiCheckCircle, FiClock, FiFileText, FiUser, FiCreditCard } from "react-icons/fi";
import { createApplication } from "../../services/studentApplicationService";

const WelcomePage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleApplyNow = async () => {
    try {

        setLoading(true);

        console.log("Creating application...");

        const response = await createApplication();

        console.log(response);

        console.log("Navigating...");

        navigate("/student/application/personal");

    } catch (error) {

        console.log(error);

        if (
            error.response?.data?.message ===
            "Application already exists"
        ) {

            navigate("/student/application/personal");

            return;

        }

        alert(
            error.response?.data?.message ||
            "Unable to start application."
        );

    } finally {

        setLoading(false);

    }
};

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.title}>Online College Admission</h1>
        <h2 style={styles.subtitle}>Welcome to the Student Application Portal</h2>
        <p style={styles.description}>
          Thank you for choosing our institution. Before starting your application,
          please read the admission guidelines below.
        </p>

        <div style={styles.section}>
          <h3 style={styles.heading}>Admission Guidelines</h3>
          <div style={styles.item}>
            <FiCheckCircle />
            <span>Complete every required section.</span>
          </div>
          <div style={styles.item}>
            <FiCheckCircle />
            <span>Save your progress regularly.</span>
          </div>
          <div style={styles.item}>
            <FiCheckCircle />
            <span>Ensure uploaded documents are clear.</span>
          </div>
          <div style={styles.item}>
            <FiCheckCircle />
            <span>Review your application before submitting.</span>
          </div>
          <div style={styles.item}>
            <FiCheckCircle />
            <span>Submitted applications have limited editing.</span>
          </div>
        </div>

        <div style={styles.section}>
          <h3 style={styles.heading}>Required Documents</h3>
          <div style={styles.item}>
            <FiUser />
            Passport Size Photograph
          </div>
          <div style={styles.item}>
            <FiCreditCard />
            National ID / Passport
          </div>
          <div style={styles.item}>
            <FiFileText />
            MSCE Certificate
          </div>
          <div style={styles.item}>
            <FiFileText />
            Academic Transcript (if applicable)
          </div>
        </div>

        <div style={styles.timeBox}>
          <FiClock />
          <span>
            Estimated completion time: <strong>15 - 20 Minutes</strong>
          </span>
        </div>

        <button style={styles.button} onClick={handleApplyNow} disabled={loading}>
          {loading ? "Creating Application..." : "Apply Now"}
        </button>
      </div>
    </div>
  );
};

const styles = {
  page: {
    background: "#f4f6f9",
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "40px"
  },
  card: {
    width: "900px",
    background: "#fff",
    borderRadius: "15px",
    padding: "40px",
    boxShadow: "0 5px 20px rgba(0,0,0,.1)"
  },
  title: {
    textAlign: "center",
    color: "#1f2937",
    marginBottom: "10px"
  },
  subtitle: {
    textAlign: "center",
    color: "#2563eb"
  },
  description: {
    textAlign: "center",
    color: "#666",
    marginBottom: "30px"
  },
  section: {
    marginBottom: "30px"
  },
  heading: {
    marginBottom: "15px",
    color: "#111827"
  },
  item: {
    display: "flex",
    gap: "12px",
    marginBottom: "12px",
    alignItems: "center",
    color: "#444"
  },
  timeBox: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "15px",
    background: "#eef4ff",
    borderRadius: "8px",
    marginBottom: "30px"
  },
  button: {
    width: "100%",
    background: "#2563eb",
    color: "#fff",
    padding: "15px",
    border: "none",
    borderRadius: "8px",
    fontSize: "16px",
    cursor: "pointer"
  }
};

export default WelcomePage;