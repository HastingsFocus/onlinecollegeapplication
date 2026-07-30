const PaymentMethod = ({ methods, selected, setSelected }) => {
  return (
    <div>
      <h3>Choose Payment Method</h3>
      {methods.map((method) => (
        <label key={method.id}>
          <input
            type="radio"
            value={method.id}
            checked={selected === method.id}
            onChange={(e) => setSelected(e.target.value)}
          />
          {method.name}
        </label>
      ))}
    </div>
  );
};

export default PaymentMethod;