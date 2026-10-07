import { useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { resetPassword } from "../services/authService";

const ResetPassword = () => {
    const navigate = useNavigate();
    const { token } = useParams();

    const [formData, setFormData] = useState({
        password: "",
        confirmPassword: "",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
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
            setTimeout(() => navigate("/login"), 3000);
        } catch (error) {
            setError(error.response?.data?.message || "Password reset failed");
        } finally {
            setLoading(false);
        }
    };

    const inputClass = `
        w-full rounded-lg border border-neutral-300
        bg-white px-4 py-3 text-sm text-neutral-900
        placeholder:text-neutral-400
        outline-none transition-all duration-200
        hover:border-neutral-400
        focus:border-black
        focus:ring-2 focus:ring-black/10
    `;

    return (
        <div className="min-h-screen bg-neutral-950 px-4 py-8 sm:px-6 lg:px-8">
            <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
                <div className="w-full max-w-md">

                    {/* Branding */}
                    <div className="mb-8 text-center">
                        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-lg">
                            <span className="text-xl font-bold tracking-tight text-black">OC</span>
                        </div>
                        <h1 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                            Online College Application System
                        </h1>
                        <p className="mt-2 text-sm text-neutral-400">
                            Secure your account with a new password.
                        </p>
                    </div>

                    {/* Card */}
                    <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-2xl sm:p-8">
                        <div className="mb-7">
                            <h2 className="text-xl font-semibold tracking-tight text-neutral-900">
                                Reset your password
                            </h2>
                            <p className="mt-1 text-sm leading-6 text-neutral-500">
                                Create a new password for your account.
                            </p>
                        </div>

                        {error && (
                            <div
                                role="alert"
                                className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
                            >
                                {error}
                            </div>
                        )}

                        {success && (
                            <div
                                role="status"
                                className="mb-6 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700"
                            >
                                {success}
                                <p className="mt-1 text-xs text-green-600">
                                    Redirecting you to the login page...
                                </p>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label htmlFor="password" className="mb-2 block text-sm font-medium text-neutral-800">
                                    New Password
                                </label>
                                <input
                                    id="password"
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="Enter your new password"
                                    autoComplete="new-password"
                                    required
                                    className={inputClass}
                                />
                            </div>

                            <div>
                                <label htmlFor="confirmPassword" className="mb-2 block text-sm font-medium text-neutral-800">
                                    Confirm Password
                                </label>
                                <input
                                    id="confirmPassword"
                                    type="password"
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    placeholder="Confirm your new password"
                                    autoComplete="new-password"
                                    required
                                    className={inputClass}
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="
                                    flex w-full items-center justify-center
                                    rounded-lg bg-black px-4 py-3
                                    text-sm font-semibold text-white shadow-sm
                                    transition-all duration-200
                                    hover:bg-neutral-800 hover:shadow-md
                                    active:scale-[0.99]
                                    disabled:cursor-not-allowed disabled:opacity-50
                                    focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2
                                "
                            >
                                {loading ? "Updating..." : "Reset Password"}
                            </button>
                        </form>

                        <div className="mt-7 border-t border-neutral-200 pt-6 text-center">
                            <Link
                                to="/login"
                                className="text-sm font-semibold text-neutral-700 transition-colors hover:text-black"
                            >
                                ← Back to Login
                            </Link>
                        </div>
                    </div>

                    <p className="mt-6 text-center text-xs text-neutral-500">
                        © {new Date().getFullYear()} Online College Application System
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;