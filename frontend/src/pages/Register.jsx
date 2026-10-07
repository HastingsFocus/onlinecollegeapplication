import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerStudent } from "../services/authService";

const Register = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (formData.password !== formData.confirmPassword) {
            return setError("Passwords do not match");
        }

        try {
            setLoading(true);
            const payload = {
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
                password: formData.password,
            };
            await registerStudent(payload);
            alert("Registration successful. Please login.");
            navigate("/login");
        } catch (error) {
            setError(error.response?.data?.message || "Registration failed");
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
                            Create your account and start your application.
                        </p>
                    </div>

                    {/* Registration Card */}
                    <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-2xl sm:p-8">
                        <div className="mb-7">
                            <h2 className="text-xl font-semibold tracking-tight text-neutral-900">
                                Create your account
                            </h2>
                            <p className="mt-1 text-sm text-neutral-500">
                                Enter your details to register as a student.
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

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                                <div>
                                    <label htmlFor="firstName" className="mb-2 block text-sm font-medium text-neutral-800">
                                        First Name
                                    </label>
                                    <input
                                        id="firstName"
                                        type="text"
                                        name="firstName"
                                        value={formData.firstName}
                                        onChange={handleChange}
                                        placeholder="John"
                                        autoComplete="given-name"
                                        required
                                        className={inputClass}
                                    />
                                </div>
                                <div>
                                    <label htmlFor="lastName" className="mb-2 block text-sm font-medium text-neutral-800">
                                        Last Name
                                    </label>
                                    <input
                                        id="lastName"
                                        type="text"
                                        name="lastName"
                                        value={formData.lastName}
                                        onChange={handleChange}
                                        placeholder="Banda"
                                        autoComplete="family-name"
                                        required
                                        className={inputClass}
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="email" className="mb-2 block text-sm font-medium text-neutral-800">
                                    Email address
                                </label>
                                <input
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="you@example.com"
                                    autoComplete="email"
                                    required
                                    className={inputClass}
                                />
                            </div>

                            <div>
                                <label htmlFor="password" className="mb-2 block text-sm font-medium text-neutral-800">
                                    Password
                                </label>
                                <input
                                    id="password"
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="Create a password"
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
                                    placeholder="Confirm your password"
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
                                {loading ? "Creating Account..." : "Create Account"}
                            </button>
                        </form>

                        <div className="mt-7 border-t border-neutral-200 pt-6 text-center">
                            <p className="text-sm text-neutral-500">
                                Already have an account?{" "}
                                <Link
                                    to="/login"
                                    className="font-semibold text-black transition-colors hover:text-neutral-600"
                                >
                                    Sign in
                                </Link>
                            </p>
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

export default Register;