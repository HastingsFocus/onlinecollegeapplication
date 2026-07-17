const DateInput = ({
    label,
    name,
    value,
    onChange,
    required = false,
    disabled = false
}) => {

    return (
        <div>

            <label>
                {label}
                {required && " *"}
            </label>

            <input
                type="date"
                name={name}
                value={value ?? ""}
                onChange={onChange}
                disabled={disabled}
            />

        </div>
    );
};

export default DateInput;