import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DashboardLayout from "../../layouts/DashboardLayout";
import { getProgramById, updateProgram } from "../../services/programService";

const EditProgram = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        requirements: "",
        department: "",
        duration: ""
    });

    useEffect(() => {
        const fetchProgram = async () => {
            try {
                const data = await getProgramById(id);
                setFormData({
                    name: data.name,
                    description: data.description,
                    requirements: data.requirements,
                    department: data.department,
                    duration: data.duration
                });
            } catch (error) {
                console.error(error);
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
            await updateProgram(id, formData);
            alert("Program updated successfully");
            navigate("/lecturer/programs");
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <DashboardLayout>
            <h1>Edit Program</h1>
            <form onSubmit={handleSubmit} style={{
                maxWidth: "700px",
                background: "#fff",
                padding: "20px",
                borderRadius: "10px"
            }}>
                <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    style={inputStyle}
                />
                <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    style={textareaStyle}
                />
                <textarea
                    name="requirements"
                    value={formData.requirements}
                    onChange={handleChange}
                    style={textareaStyle}
                />
                <input
                    type="text"
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    style={inputStyle}
                />
                <input
                    type="text"
                    name="duration"
                    value={formData.duration}
                    onChange={handleChange}
                    style={inputStyle}
                />
                <button type="submit" style={buttonStyle}>
                    Update Program
                </button>
            </form>
        </DashboardLayout>
    );
};

const inputStyle = {
    width: "100%",
    padding: "12px",
    marginBottom: "15px"
};

const textareaStyle = {
    width: "100%",
    minHeight: "120px",
    marginBottom: "15px",
    padding: "12px"
};

const buttonStyle = {
    width: "100%",
    padding: "12px",
    background: "#222",
    color: "white",
    border: "none",
    cursor: "pointer"
};

export default EditProgram;