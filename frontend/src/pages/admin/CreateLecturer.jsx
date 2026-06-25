import { useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import { createLecturer } from "../../services/userService";

const CreateLecturer = () => {
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: ""
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
            const response = await createLecturer(formData);
            setMessage(response.message);
            setFormData({
                firstName: "",
                lastName: "",
                email: ""
            });
        } catch (error) {
            setMessage(error.response?.data?.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <DashboardLayout>
            <h1>Create Lecturer</h1>

            <div style={{
                background: "#fff",
                padding: "30px",
                borderRadius: "10px",
                width: "500px",
                marginTop: "30px"
            }}>
                {message && <p>{message}</p>}

                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        name="firstName"
                        placeholder="First Name"
                        value={formData.firstName}
                        onChange={handleChange}
                        style={inputStyle}
                    />

                    <input
                        type="text"
                        name="lastName"
                        placeholder="Last Name"
                        value={formData.lastName}
                        onChange={handleChange}
                        style={inputStyle}
                    />

                    <input
                        type="email"
                        name="email"
                        placeholder="Email Address"
                        value={formData.email}
                        onChange={handleChange}
                        style={inputStyle}
                    />

                    <button
                        type="submit"
                        disabled={loading}
                        style={buttonStyle}
                    >
                        {loading ? "Creating..." : "Create Lecturer"}
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
    borderRadius: "8px",
    border: "1px solid #ccc",
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

export default CreateLecturer;