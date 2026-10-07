// ===============================
// DateInput.jsx
// ===============================
const DateInput = ({
    label,
    name,
    value,
    onChange,
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
            <input
                id={name}
                type="date"
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
            />
        </div>
    );
};

export default DateInput;