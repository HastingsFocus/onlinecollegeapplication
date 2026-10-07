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
    "inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 active:scale-[0.98]";

  const variants = {
    primary:
      "bg-black text-white shadow-sm hover:bg-neutral-800 hover:shadow-md",

    secondary:
      "border border-neutral-300 bg-white text-neutral-900 shadow-sm hover:bg-neutral-50 hover:border-neutral-400",

    danger:
      "bg-neutral-900 text-white shadow-sm hover:bg-black hover:shadow-md",
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

