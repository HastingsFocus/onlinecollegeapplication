const StatusFilter = ({ value, onChange }) => {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="rounded-lg border border-gray-300 px-3 py-2"
    >
      <option value="">All Statuses</option>
      <option value="Draft">Draft</option>
      <option value="Submitted">Submitted</option>
      <option value="Under Review">Under Review</option>
      <option value="Accepted">Accepted</option>
      <option value="Rejected">Rejected</option>
    </select>
  );
};

export default StatusFilter;