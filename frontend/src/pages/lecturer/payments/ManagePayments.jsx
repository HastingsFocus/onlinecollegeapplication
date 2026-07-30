import { useEffect, useState } from "react";
import { getAllPayments } from "../../../services/paymentService";

const ManagePayments = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPayments();
  }, []);

  const loadPayments = async () => {
    try {
      const data = await getAllPayments();
      setPayments(data.payments);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <h2>Loading payments...</h2>;
  }

  return (
    <div>
      <h1>Application Payments</h1>
      <table>
        <thead>
          <tr>
            <th>Student</th>
            <th>Method</th>
            <th>Amount</th>
            <th>Status</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {payments.map((payment) => (
            <tr key={payment._id}>
              <td>{payment.student?.firstName} {payment.student?.lastName}</td>
              <td>{payment.method}</td>
              <td>MWK {payment.amount}</td>
              <td>{payment.status}</td>
              <td>{payment.paidAt ? new Date(payment.paidAt).toLocaleDateString() : "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ManagePayments;