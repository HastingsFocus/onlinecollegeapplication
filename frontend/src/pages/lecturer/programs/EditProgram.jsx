import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DashboardLayout from "../../../layouts/DashboardLayout";
import { getProgramById, updateProgram } from "../../../services/programService";

const EditProgram = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        code: "",
        description: "",
        requirements: "",
        department: "",
        duration: ""
    });

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const fetchProgram = async () => {
            try {
                const data = await getProgramById(id);

                setFormData({
                    name: data.name || "",
                    code: data.code || "",
                    description: data.description || "",
                    requirements: data.requirements || "",
                    department: data.department || "",
                    duration: data.duration || ""
                });
            } catch (error) {
                console.error(error);
                alert(
                    error.response?.data?.message ||
                    "Failed to load program"
                );
            } finally {
                setLoading(false);
            }
        };

        fetchProgram();
    }, [id]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setSaving(true);

            await updateProgram(id, formData);

            alert("Program updated successfully");

            navigate("/lecturer/programs");
        } catch (error) {
            console.error(error);

            alert(
                error.response?.data?.message ||
                "Failed to update program"
            );
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <DashboardLayout>
                <h1>Edit Program</h1>
                <p>Loading program...</p>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <h1>Edit Program</h1>

            <form
                onSubmit={handleSubmit}
                style={{
                    maxWidth: "700px",
                    background: "#fff",
                    padding: "20px",
                    borderRadius: "10px"
                }}
            >
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

                {/* DESCRIPTION */}
                <textarea
                    name="description"
                    placeholder="Program Description"
                    value={formData.description}
                    onChange={handleChange}
                    style={textareaStyle}
                    required
                />

                {/* REQUIREMENTS */}
                <textarea
                    name="requirements"
                    placeholder="Entry Requirements"
                    value={formData.requirements}
                    onChange={handleChange}
                    style={textareaStyle}
                    required
                />

                {/* DEPARTMENT */}
                <input
                    type="text"
                    name="department"
                    placeholder="Department"
                    value={formData.department}
                    onChange={handleChange}
                    style={inputStyle}
                    required
                />

                {/* DURATION */}
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
                    disabled={saving}
                    style={{
                        ...buttonStyle,
                        opacity: saving ? 0.7 : 1
                    }}
                >
                    {saving ? "Updating Program..." : "Update Program"}
                </button>
            </form>
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
    marginBottom: "15px",
    padding: "12px",
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

export default EditProgram;