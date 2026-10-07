// ===============================
// FileUpload.jsx
// ===============================
const FileUpload = ({
    label,
    name,
    onChange,
    required = false,
    accept = "*",
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
                type="file"
                name={name}
                accept={accept}
                onChange={onChange}
                disabled={disabled}
                required={required}
                className="
                    block w-full rounded-lg border border-neutral-300
                    bg-white text-sm text-neutral-700 shadow-sm
                    file:mr-4 file:rounded-md file:border-0
                    file:bg-neutral-900 file:px-4 file:py-2.5
                    file:text-sm file:font-medium file:text-white
                    hover:file:bg-neutral-800
                    focus:outline-none focus:ring-2 focus:ring-neutral-900/10
                    disabled:cursor-not-allowed disabled:bg-neutral-100
                    disabled:text-neutral-500 disabled:file:bg-neutral-400
                "
            />
        </div>
    );
};

export default FileUpload;