const Button = ({
    text,
    type = "button",
    onClick,
    loading = false,
    disabled = false
}) => {
    return (
        <button
            type={type}
            onClick={onClick}
            disabled={loading || disabled}
        >
            {loading ? "Please wait..." : text}
        </button>
    );
};

export default Button;