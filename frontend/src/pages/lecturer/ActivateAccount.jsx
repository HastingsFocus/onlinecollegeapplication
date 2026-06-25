import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/axios";

const ActivateAccount = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setMessage("Passwords do not match");
            return;
        }

        try {
            setLoading(true);
            const response = await api.post(`/auth/activate-account/${token}`, { password });
            setMessage(response.data.message);
            setTimeout(() => {
                navigate("/login");
            }, 2000);
        } catch (error) {
            setMessage(error.response?.data?.message || "Activation failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            height: "100vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            background: "#f5f5f5"
        }}>
            <div style={{
                background: "white",
                padding: "40px",
                width: "400px",
                borderRadius: "10px"
            }}>
                <h2>Activate Lecturer Account</h2>

                {message && <p>{message}</p>}

                <form onSubmit={handleSubmit}>
                    <input
                        type="password"
                        placeholder="Create Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        style={inputStyle}
                    />

                    <input
                        type="password"
                        placeholder="Confirm Password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        style={inputStyle}
                    />

                    <button
                        type="submit"
                        style={buttonStyle}
                        disabled={loading}
                    >
                        {loading ? "Activating..." : "Activate Account"}
                    </button>
                </form>
            </div>
        </div>
    );
};

const inputStyle = {
    width: "100%",
    padding: "12px",
    marginBottom: "15px",
    border: "1px solid #ccc",
    borderRadius: "8px"
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

export default ActivateAccount;