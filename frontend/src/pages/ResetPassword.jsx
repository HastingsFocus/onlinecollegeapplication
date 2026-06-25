import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { resetPassword } from "../services/authService";

const ResetPassword = () => {
    const navigate = useNavigate();
    const { token } = useParams();

    const [formData, setFormData] = useState({
        password: "",
        confirmPassword: ""
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (formData.password !== formData.confirmPassword) {
            return setError("Passwords do not match");
        }

        try {
            setLoading(true);
            const response = await resetPassword(token, formData.password);
            setSuccess(response.message);
            setTimeout(() => {
                navigate("/login");
            }, 3000);
        } catch (error) {
            setError(error.response?.data?.message || "Password reset failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            minHeight: "100vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            background: "#f5f5f5"
        }}>
            <div style={{
                width: "420px",
                background: "#fff",
                padding: "30px",
                borderRadius: "10px",
                boxShadow: "0 2px 10px rgba(0,0,0,0.1)"
            }}>
                <h2 style={{
                    textAlign: "center",
                    marginBottom: "20px"
                }}>
                    Reset Password
                </h2>

                {error && (
                    <div style={{
                        background: "#fee2e2",
                        color: "#dc2626",
                        padding: "10px",
                        marginBottom: "15px",
                        borderRadius: "5px"
                    }}>
                        {error}
                    </div>
                )}

                {success && (
                    <div style={{
                        background: "#dcfce7",
                        color: "#16a34a",
                        padding: "10px",
                        marginBottom: "15px",
                        borderRadius: "5px"
                    }}>
                        {success}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div style={{
                        marginBottom: "15px"
                    }}>
                        <label>New Password</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            style={{
                                width: "100%",
                                padding: "10px",
                                marginTop: "5px",
                                border: "1px solid #ccc",
                                borderRadius: "5px",
                                boxSizing: "border-box"
                            }}
                        />
                    </div>

                    <div style={{
                        marginBottom: "20px"
                    }}>
                        <label>Confirm Password</label>
                        <input
                            type="password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                            style={{
                                width: "100%",
                                padding: "10px",
                                marginTop: "5px",
                                border: "1px solid #ccc",
                                borderRadius: "5px",
                                boxSizing: "border-box"
                            }}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            width: "100%",
                            padding: "12px",
                            border: "none",
                            borderRadius: "5px",
                            background: "#222",
                            color: "#fff",
                            cursor: "pointer"
                        }}
                    >
                        {loading ? "Updating..." : "Reset Password"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ResetPassword;