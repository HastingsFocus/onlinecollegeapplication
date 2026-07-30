import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ApplicationStepper from "../../../components/student/ApplicationStepper";
import PaymentSummary from "../../../components/payment/PaymentSummary";
import PaymentMethod from "../../../components/payment/PaymentMethod";
import Button from "../../../components/ui/Button";
import paymentMethods from "../../../constants/paymentMethods";
import { initiatePayment } from "../../../services/paymentService";

const PaymentPage = () => {
  const { applicationId } = useParams();
  const navigate = useNavigate();
  const [method, setMethod] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const applicationFee = 25000;

  const handlePayment = async () => {
    if (!method) {
      return alert("Please select a payment method.");
    }
    if (!phoneNumber) {
      return alert("Please enter your mobile money number.");
    }
    try {
      setLoading(true);
      const response = await initiatePayment({
        applicationId,
        gateway: "PayChangu",
        method,
        phoneNumber
      });
      alert("Payment request sent successfully. Please complete the payment on your phone.");
      if (response.sandbox) {
        navigate(`/student/payment/success/${applicationId}`);
      } else {
        navigate(`/student/payment/status/${applicationId}`);
      }
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Unable to initiate payment.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "1000px", margin: "0 auto", paddingBottom: "40px" }}>
      <ApplicationStepper currentStep={8} />

      <div style={{
        background: "#fff",
        border: "1px solid #ddd",
        borderRadius: "12px",
        padding: "35px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.08)"
      }}>
        <h2 style={{ color: "#2563eb", marginBottom: "10px" }}>
          Application Payment
        </h2>
        <p style={{ color: "#555", marginBottom: "30px" }}>
          Pay the application fee to complete your application.
        </p>

        <PaymentSummary amount={applicationFee} />

        <hr style={{ margin: "30px 0" }} />

        <PaymentMethod methods={paymentMethods} selected={method} setSelected={setMethod} />

        <div style={{ marginTop: "30px" }}>
          <label style={{ display: "block", marginBottom: "10px", fontWeight: "600" }}>
            Mobile Money Number
          </label>
          <input
            type="text"
            placeholder="0991234567"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            style={{
              width: "100%",
              padding: "12px",
              border: "1px solid #ccc",
              borderRadius: "8px",
              fontSize: "15px"
            }}
          />
        </div>

        <div style={{
          marginTop: "30px",
          padding: "20px",
          background: "#f8fafc",
          border: "1px solid #dbeafe",
          borderRadius: "10px"
        }}>
          <h3 style={{ color: "#2563eb", marginBottom: "15px" }}>
            Payment Instructions
          </h3>
          <ul style={{ paddingLeft: "20px", lineHeight: "1.8" }}>
            <li>Select your preferred mobile money provider.</li>
            <li>Enter your registered mobile money number.</li>
            <li>Click <strong>Pay Now</strong>.</li>
            <li>Approve the payment request on your phone.</li>
            <li>Once payment is successful, your application will be marked as paid.</li>
          </ul>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", marginTop: "40px" }}>
          <Button text="← Back" onClick={() => navigate("/student/application/review")} />
          <Button
            text="Pay Now"
            loading={loading}
            disabled={!method || !phoneNumber}
            onClick={handlePayment}
          />
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;