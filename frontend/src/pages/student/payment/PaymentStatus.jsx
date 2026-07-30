import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getPaymentStatus } from "../../../services/paymentService";

const PaymentStatus = () => {
  const { applicationId } = useParams();
  const [payment, setPayment] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPayment = async () => {
      try {
        const data = await getPaymentStatus(applicationId);
        setPayment(data.payment);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchPayment();
  }, [applicationId]);

  if (loading) {
    return <h2>Loading payment...</h2>;
  }

  if (!payment) {
    return <h2>No payment found.</h2>;
  }

  return (
    <div className="payment-status-page">
      <h1>Payment Status</h1>
      <div className="payment-card">
        <p><strong>Amount:</strong> MWK {payment.amount}</p>
        <p><strong>Status:</strong> {payment.status}</p>
        <p><strong>Method:</strong> {payment.method}</p>
        <p><strong>Reference:</strong> {payment.gatewayReference || "-"}</p>
        <p><strong>Paid At:</strong> {payment.paidAt ? new Date(payment.paidAt).toLocaleString() : "-"}</p>
      </div>
    </div>
  );
};

export default PaymentStatus;