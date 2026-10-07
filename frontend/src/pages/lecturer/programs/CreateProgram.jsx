import { useState } from "react";
import DashboardLayout from "../../../layouts/DashboardLayout";
import Button from "../../../components/ui/Button";
import { createProgram } from "../../../services/programService";

const EMPTY_FORM = {
    name: "",
    code: "",
    description: "",
    requirements: "",
    department: "",
    duration: "",
};

const CreateProgram = () => {
    const [formData, setFormData] = useState(EMPTY_FORM);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: name === "code" ? value.toUpperCase() : value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);
            setMessage("");
            setMessageType("");

            const response = await createProgram(formData);
            setMessage(response.message);
            setMessageType("success");
            setFormData(EMPTY_FORM);
        } catch (error) {
            setMessage(error.response?.data?.message || "Failed to create program");
            setMessageType("error");
        } finally {
            setLoading(false);
        }
    };

    const inputClass = `
        w-full rounded-lg border border-neutral-300
        bg-white px-3.5 py-2.5 text-sm
        text-neutral-900 placeholder:text-neutral-400
        shadow-sm outline-none transition-all
        focus:border-neutral-900 focus:ring-2 focus:ring-neutral-900/10
    `;

    const textareaClass = `
        w-full resize-y rounded-lg border border-neutral-300
        bg-white px-3.5 py-2.5 text-sm
        text-neutral-900 placeholder:text-neutral-400
        shadow-sm outline-none transition-all
        focus:border-neutral-900 focus:ring-2 focus:ring-neutral-900/10
    `;

    const RequiredStar = () => <span className="ml-1 text-red-600">*</span>;

    return (
        <DashboardLayout>
            <div className="min-h-full bg-neutral-50 px-4 py-6 sm:px-6 lg:px-8">
                {/* Page Header */}
                <div className="mx-auto max-w-3xl">
                    <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
                        Program Management
                    </p>
                    <h1 className="mt-1 text-2xl font-semibold tracking-tight text-neutral-950 sm:text-3xl">
                        Create Program
                    </h1>
                    <p className="mt-2 text-sm leading-6 text-neutral-500">
                        Add a new academic program to the college system.
                    </p>
                </div>

                {/* Centered Form */}
                <div className="mx-auto mt-6 max-w-3xl">
                    <div className="rounded-2xl border border-neutral-200 bg-white shadow-sm">

                        {/* Form Header */}
                        <div className="border-b border-neutral-200 px-5 py-5 sm:px-7">
                            <h2 className="text-base font-semibold text-neutral-950">
                                Program Information
                            </h2>
                            <p className="mt-1 text-sm text-neutral-500">
                                Enter the details of the academic program.
                            </p>
                        </div>

                        <div className="px-5 py-6 sm:px-7 sm:py-8">
                            {message && (
                                <div
                                    className={`mb-6 rounded-lg border px-4 py-3 text-sm ${
                                        messageType === "success"
                                            ? "border-green-200 bg-green-50 text-green-800"
                                            : "border-red-200 bg-red-50 text-red-800"
                                    }`}
                                >
                                    {message}
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-5">

                                {/* Program Name */}
                                <div>
                                    <label htmlFor="name" className="mb-2 block text-sm font-medium text-neutral-800">
                                        Program Name<RequiredStar />
                                    </label>
                                    <input
                                        id="name"
                                        type="text"
                                        name="name"
                                        placeholder="e.g. Bachelor of Science in Food Science and Technology"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                        className={inputClass}
                                    />
                                </div>

                                {/* Program Code */}
                                <div>
                                    <label htmlFor="code" className="mb-2 block text-sm font-medium text-neutral-800">
                                        Program Code<RequiredStar />
                                    </label>
                                    <input
                                        id="code"
                                        type="text"
                                        name="code"
                                        placeholder="e.g. FST, BIT, BBA"
                                        value={formData.code}
                                        onChange={handleChange}
                                        maxLength={10}
                                        required
                                        className={`
                                            ${inputClass}
                                            font-medium uppercase tracking-wide
                                            placeholder:normal-case placeholder:tracking-normal
                                        `}
                                    />
                                    <p className="mt-1.5 text-xs text-neutral-500">
                                        This code will be used when generating student registration numbers.
                                    </p>
                                </div>

                                {/* Description */}
                                <div>
                                    <label htmlFor="description" className="mb-2 block text-sm font-medium text-neutral-800">
                                        Program Description<RequiredStar />
                                    </label>
                                    <textarea
                                        id="description"
                                        name="description"
                                        placeholder="Describe the academic program..."
                                        value={formData.description}
                                        onChange={handleChange}
                                        required
                                        rows={4}
                                        className={textareaClass}
                                    />
                                </div>

                                {/* Requirements */}
                                <div>
                                    <label htmlFor="requirements" className="mb-2 block text-sm font-medium text-neutral-800">
                                        Entry Requirements<RequiredStar />
                                    </label>
                                    <textarea
                                        id="requirements"
                                        name="requirements"
                                        placeholder="Enter the entry requirements..."
                                        value={formData.requirements}
                                        onChange={handleChange}
                                        required
                                        rows={4}
                                        className={textareaClass}
                                    />
                                </div>

                                {/* Department + Duration */}
                                <div className="grid gap-5 sm:grid-cols-2">
                                    <div>
                                        <label htmlFor="department" className="mb-2 block text-sm font-medium text-neutral-800">
                                            Department<RequiredStar />
                                        </label>
                                        <input
                                            id="department"
                                            type="text"
                                            name="department"
                                            placeholder="e.g. Information Technology"
                                            value={formData.department}
                                            onChange={handleChange}
                                            required
                                            className={inputClass}
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="duration" className="mb-2 block text-sm font-medium text-neutral-800">
                                            Duration<RequiredStar />
                                        </label>
                                        <input
                                            id="duration"
                                            type="text"
                                            name="duration"
                                            placeholder="e.g. 4 Years"
                                            value={formData.duration}
                                            onChange={handleChange}
                                            required
                                            className={inputClass}
                                        />
                                    </div>
                                </div>

                                {/* Submit */}
                                <div className="border-t border-neutral-200 pt-6">
                                    <div className="flex justify-end">
                                        <Button
                                            type="submit"
                                            text={loading ? "Creating Program..." : "Create Program"}
                                            loading={loading}
                                        />
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default CreateProgram;