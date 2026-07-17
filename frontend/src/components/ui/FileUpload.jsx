const FileUpload = ({
    label,
    name,
    onChange,
    required = false,
    accept = "*",
    disabled = false
}) => {
    return (
        <div>
            <label>
                {label}
                {required && " *"}
            </label>

            <input
                type="file"
                name={name}
                accept={accept}
                onChange={onChange}
                disabled={disabled}
            />
        </div>
    );
};

export default FileUpload;