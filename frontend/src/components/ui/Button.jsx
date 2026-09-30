const Button = ({
  children,
  text,
  type = "button",
  onClick,
  loading = false,
  disabled = false,
  variant = "primary",
}) => {
  const baseStyles =
    "inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-60";

  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700",
    secondary:
      "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50",
    danger: "bg-red-600 text-white hover:bg-red-700",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={loading || disabled}
      className={`${baseStyles} ${variants[variant] || variants.primary}`}
    >
      {loading ? "Please wait..." : children || text}
    </button>
  );
};

export default Button;