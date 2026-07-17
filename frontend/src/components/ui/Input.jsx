const Input = ({
    label,
    name,
    value,
    onChange,
    type = "text",
    placeholder = "",
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
                type={type}
                name={name}
                value={value ?? ""}
                onChange={onChange}
                placeholder={placeholder}
                disabled={disabled}
            />

        </div>
    );
};

export default Input;