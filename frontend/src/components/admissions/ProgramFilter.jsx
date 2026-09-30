const ProgramFilter = ({
  programs = [],
  value,
  onChange,
}) => {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="rounded-lg border border-gray-300 px-3 py-2"
    >
      <option value="">All Programmes</option>

      {programs.map((program) => (
        <option
          key={program._id}
          value={program._id}
        >
          {program.name}
        </option>
      ))}
    </select>
  );
};

export default ProgramFilter;