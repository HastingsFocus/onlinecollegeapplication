import { useState } from "react";
import { Link } from "react-router-dom";
import { forgotPassword } from "../services/authService";

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        try {
            setLoading(true);
            const response = await forgotPassword(email);
            setSuccess(response.message);
            setEmail("");
        } catch (error) {
            setError(error.response?.data?.message || "Something went wrong");
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
                width: "400px",
                background: "#fff",
                padding: "30px",
                borderRadius: "10px",
                boxShadow: "0 2px 10px rgba(0,0,0,0.1)"
            }}>
                <h2 style={{
                    textAlign: "center",
                    marginBottom: "20px"
                }}>
                    Forgot Password
                </h2>
                <p style={{
                    textAlign: "center",
                    marginBottom: "20px",
                    color: "#666"
                }}>
                    Enter your email address and we'll send you a password reset link.
                </p>

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
                        <label>Email Address</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
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
                        {loading ? "Sending..." : "Send Reset Link"}
                    </button>
                </form>

                <div style={{
                    textAlign: "center",
                    marginTop: "20px"
                }}>
                    <Link to="/login">Back To Login</Link>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;