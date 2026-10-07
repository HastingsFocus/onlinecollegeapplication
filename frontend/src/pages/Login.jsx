
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../services/authService";
import { useAuth } from "../context/AuthContext";

const Login = () => {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
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
        <div className="min-h-screen bg-neutral-950 px-4 py-8 sm:px-6 lg:px-8">
            <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">

                <div className="w-full max-w-md">

                    {/* Branding */}
                    <div className="mb-8 text-center">
                        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-lg">
                            <span className="text-xl font-bold tracking-tight text-black">
                                OC
                            </span>
                        </div>

                        <h1 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                            Online College Application System
                        </h1>

                        <p className="mt-2 text-sm text-neutral-400">
                            Manage your college application with ease.
                        </p>
                    </div>

                    {/* Login Card */}
                    <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-2xl sm:p-8">

                        <div className="mb-7">
                            <h2 className="text-xl font-semibold tracking-tight text-neutral-900">
                                Welcome back
                            </h2>

                            <p className="mt-1 text-sm text-neutral-500">
                                Sign in to continue to your account.
                            </p>
                        </div>

                        {/* Error */}
                        {error && (
                            <div
                                role="alert"
                                className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
                            >
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-5">

                            {/* Email */}
                            <div>
                                <label
                                    htmlFor="email"
                                    className="mb-2 block text-sm font-medium text-neutral-800"
                                >
                                    Email address
                                </label>

                                <input
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="Enter your email"
                                    autoComplete="email"
                                    required
                                    className="
                                        w-full rounded-lg border border-neutral-300
                                        bg-white px-4 py-3 text-sm text-neutral-900
                                        placeholder:text-neutral-400
                                        outline-none transition-all duration-200
                                        hover:border-neutral-400
                                        focus:border-black
                                        focus:ring-2 focus:ring-black/10
                                    "
                                />
                            </div>

                            {/* Password */}
                            <div>
                                <div className="mb-2 flex items-center justify-between">
                                    <label
                                        htmlFor="password"
                                        className="block text-sm font-medium text-neutral-800"
                                    >
                                        Password
                                    </label>

                                    <Link
                                        to="/forgot-password"
                                        className="text-sm font-medium text-neutral-600 transition-colors hover:text-black"
                                    >
                                        Forgot password?
                                    </Link>
                                </div>

                                <input
                                    id="password"
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="Enter your password"
                                    autoComplete="current-password"
                                    required
                                    className="
                                        w-full rounded-lg border border-neutral-300
                                        bg-white px-4 py-3 text-sm text-neutral-900
                                        placeholder:text-neutral-400
                                        outline-none transition-all duration-200
                                        hover:border-neutral-400
                                        focus:border-black
                                        focus:ring-2 focus:ring-black/10
                                    "
                                />
                            </div>

                            {/* Login Button */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="
                                    flex w-full items-center justify-center
                                    rounded-lg bg-black px-4 py-3
                                    text-sm font-semibold text-white
                                    shadow-sm
                                    transition-all duration-200
                                    hover:bg-neutral-800
                                    hover:shadow-md
                                    active:scale-[0.99]
                                    disabled:cursor-not-allowed
                                    disabled:opacity-50
                                    focus:outline-none
                                    focus:ring-2
                                    focus:ring-black
                                    focus:ring-offset-2
                                "
                            >
                                {loading ? "Logging in..." : "Login"}
                            </button>
                        </form>

                        {/* Register */}
                        <div className="mt-7 border-t border-neutral-200 pt-6 text-center">
                            <p className="text-sm text-neutral-500">
                                Don't have an account?{" "}
                                <Link
                                    to="/register"
                                    className="font-semibold text-black transition-colors hover:text-neutral-600"
                                >
                                    Create an account
                                </Link>
                            </p>
                        </div>
                    </div>

                    {/* Footer */}
                    <p className="mt-6 text-center text-xs text-neutral-500">
                        © {new Date().getFullYear()} Online College Application System
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;

