import { useState } from "react";
import DashboardLayout from "../../../layouts/DashboardLayout";
import { createProgram } from "../../../services/programService";

const CreateProgram = () => {
    const [formData, setFormData] = useState({
        name: "",
        code: "",
        description: "",
        requirements: "",
        department: "",
        duration: ""
    });

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);
            setMessage("");

            const response = await createProgram(formData);

            setMessage(response.message);

            setFormData({
                name: "",
                code: "",
                description: "",
                requirements: "",
                department: "",
                duration: ""
            });

        } catch (error) {
            setMessage(
                error.response?.data?.message ||
                "Failed to create program"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <DashboardLayout>
            <h1>Create Program</h1>

            <div
                style={{
                    background: "#fff",
                    padding: "30px",
                    borderRadius: "10px",
                    marginTop: "20px",
                    maxWidth: "700px",
                    boxShadow: "0 2px 5px rgba(0,0,0,0.1)"
                }}
            >
                {message && (
                    <p
                        style={{
                            marginBottom: "20px",
                            color: "green"
                        }}
                    >
                        {message}
                    </p>
                )}

                <form onSubmit={handleSubmit}>

                    {/* PROGRAM NAME */}
                    <input
                        type="text"
                        name="name"
                        placeholder="Program Name"
                        value={formData.name}
                        onChange={handleChange}
                        style={inputStyle}
                        required
                    />

                    {/* PROGRAM CODE */}
                    <input
                        type="text"
                        name="code"
                        placeholder="Program Code (e.g. FST, BIT, BBA)"
                        value={formData.code}
                        onChange={handleChange}
                        style={{
                            ...inputStyle,
                            textTransform: "uppercase"
                        }}
                        maxLength={10}
                        required
                    />

                    <textarea
                        name="description"
                        placeholder="Program Description"
                        value={formData.description}
                        onChange={handleChange}
                        style={textareaStyle}
                        required
                    />

                    <textarea
                        name="requirements"
                        placeholder="Entry Requirements"
                        value={formData.requirements}
                        onChange={handleChange}
                        style={textareaStyle}
                        required
                    />

                    <input
                        type="text"
                        name="department"
                        placeholder="Department"
                        value={formData.department}
                        onChange={handleChange}
                        style={inputStyle}
                        required
                    />

                    <input
                        type="text"
                        name="duration"
                        placeholder="Duration (e.g. 4 Years)"
                        value={formData.duration}
                        onChange={handleChange}
                        style={inputStyle}
                        required
                    />

                    <button
                        type="submit"
                        disabled={loading}
                        style={buttonStyle}
                    >
                        {loading
                            ? "Creating Program..."
                            : "Create Program"}
                    </button>

                </form>
            </div>
        </DashboardLayout>
    );
};

const inputStyle = {
    width: "100%",
    padding: "12px",
    marginBottom: "15px",
    border: "1px solid #ccc",
    borderRadius: "8px",
    boxSizing: "border-box"
};

const textareaStyle = {
    width: "100%",
    minHeight: "120px",
    padding: "12px",
    marginBottom: "15px",
    border: "1px solid #ccc",
    borderRadius: "8px",
    resize: "vertical",
    boxSizing: "border-box"
};

const buttonStyle = {
    width: "100%",
    padding: "12px",
    background: "#222",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer"
};

export default CreateProgram;