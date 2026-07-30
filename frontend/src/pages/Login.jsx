import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../services/authService";
import { useAuth } from "../context/AuthContext";

const Login = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
        const response = await loginUser(formData);

        login(response.user, response.token);

        if (response.user.role === "admin") {

            navigate("/admin/dashboard");

        } else if (response.user.role === "lecturer") {

            navigate("/lecturer/dashboard");

        } else if (response.user.role === "student") {

            navigate("/student");

        }

    } catch (error) {

        setError(
            error.response?.data?.message || "Login failed"
        );

    } finally {

        setLoading(false);

    }
};
    return (
        <div className="login-container">
            <div className="login-card">
                <h1>Online College Application System</h1>
                <h2>Login</h2>
                {error && <div className="error-message">{error}</div>}
                <form onSubmit={handleSubmit}>
                    <div>
                        <label>Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Enter your email"
                            required
                        />
                    </div>
                    <div>
                        <label>Password</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Enter your password"
                            required
                        />
                    </div>
                    <button type="submit" disabled={loading}>
                        {loading ? "Logging in..." : "Login"}
                    </button>
                </form>
                <p>
                    Don't have an account?
                    <Link to="/register">Register</Link>
                </p>
                <p>
                    <Link to="/forgot-password">

    Forgot Password?

</Link>
                </p>
            </div>
        </div>
    );
};
export default Login;