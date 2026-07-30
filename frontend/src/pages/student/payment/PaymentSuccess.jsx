import { useNavigate } from "react-router-dom";
import Button from "../../../components/ui/Button";

const PaymentSuccess = () => {
  const navigate = useNavigate();

  return (
    <div
      style={{
        maxWidth: "700px",
        margin: "60px auto",
        background: "#fff",
        padding: "40px",
        borderRadius: "12px",
        boxShadow: "0 5px 15px rgba(0,0,0,.08)",
        textAlign: "center",
      }}
    >
      <div style={{ fontSize: "70px" }}>✅</div>

      <h1 style={{ color: "#16a34a" }}>
        Payment Successful
      </h1>

      <p style={{ fontSize: "17px", marginTop: "15px" }}>
        Your application fee has been received successfully.
      </p>

      <p style={{ color: "#555", marginTop: "10px" }}>
        You may now submit your application for admission.
      </p>

      <Button
        text="Continue to Submission →"
        onClick={() =>
          navigate("/student/application/submit")
        }
      />
    </div>
  );
};

export default PaymentSuccess;