// ===============================
// Select.jsx
// ===============================
const Select = ({
    label,
    name,
    value,
    onChange,
    options = [],
    required = false,
    disabled = false,
}) => {
    return (
        <div className="w-full">
            <label htmlFor={name} className="mb-2 block text-sm font-medium text-neutral-800">
                {label}
                {required && (
                    <span className="ml-1 text-red-600" aria-hidden="true">*</span>
                )}
            </label>
            <select
                id={name}
                name={name}
                value={value ?? ""}
                onChange={onChange}
                disabled={disabled}
                required={required}
                className="
                    w-full rounded-lg border border-neutral-300
                    bg-white px-3.5 py-2.5
                    text-sm text-neutral-900
                    shadow-sm outline-none transition-all duration-200
                    focus:border-neutral-900 focus:ring-2 focus:ring-neutral-900/10
                    disabled:cursor-not-allowed disabled:bg-neutral-100
                    disabled:text-neutral-500
                "
            >
                <option value="">Select {label}</option>
                {options.map((option, index) => {
                    // Object option: { value, label }
                    if (typeof option === "object" && option !== null) {
                        return (
                            <option key={option.value || index} value={option.value}>
                                {option.label}
                            </option>
                        );
                    }
                    // String option
                    return (
                        <option key={option} value={option}>
                            {option}
                        </option>
                    );
                })}
            </select>
        </div>
    );
};

export default Select;