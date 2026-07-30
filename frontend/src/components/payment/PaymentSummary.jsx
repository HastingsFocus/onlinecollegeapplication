const PaymentSummary = ({ amount }) => {
  return (
    <div>
      <h3>Application Fee</h3>
      <h2>MWK {amount}</h2>
      <p>Please complete payment to submit your application.</p>
    </div>
  );
};

export default PaymentSummary;