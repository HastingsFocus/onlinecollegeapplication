import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiCheckCircle, FiClock, FiFileText, FiUser, FiCreditCard } from "react-icons/fi";
import { createApplication } from "../../services/studentApplicationService";

const WelcomePage = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const handleApplyNow = async () => {
        try {
            setLoading(true);
            await createApplication();
            navigate("/student/application/personal");
        } catch (error) {
            alert(error.response?.data?.message || "Unable to create application.");
        } finally {
            setLoading(false);
        }
    };

    const guidelines = [
        "Complete every required section.",
        "Save your progress regularly.",
        "Ensure uploaded documents are clear.",
        "Review your application before submitting.",
        "Submitted applications have limited editing.",
    ];

    const documents = [
        { icon: FiUser, label: "Passport Size Photograph" },
        { icon: FiCreditCard, label: "National ID / Passport" },
        { icon: FiFileText, label: "MSCE Certificate" },
        { icon: FiFileText, label: "Academic Transcript (if applicable)" },
    ];

    return (
        <div className="min-h-screen bg-neutral-50 px-4 py-8 sm:px-6 lg:px-8">
            <div className="mx-auto w-full max-w-4xl">

                {/* Header */}
                <div className="mb-8 text-center">
                    <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-black text-lg font-bold text-white shadow-sm">
                        OC
                    </div>
                    <h1 className="text-2xl font-bold tracking-tight text-neutral-950 sm:text-3xl">
                        Online College Admission
                    </h1>
                    <h2 className="mt-2 text-base font-medium text-neutral-600 sm:text-lg">
                        Welcome to the Student Application Portal
                    </h2>
                    <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-neutral-500 sm:text-base">
                        Thank you for choosing our institution. Before starting your application, please read the admission guidelines below.
                    </p>
                </div>

                {/* Main Card */}
                <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">
                    <div className="p-5 sm:p-8 lg:p-10">

                        {/* Admission Guidelines */}
                        <section className="mb-10">
                            <div className="mb-5">
                                <h3 className="text-lg font-semibold text-neutral-950">Admission Guidelines</h3>
                                <p className="mt-1 text-sm text-neutral-500">
                                    Please keep these requirements in mind while completing your application.
                                </p>
                            </div>
                            <div className="grid gap-3 sm:grid-cols-2">
                                {guidelines.map((text, index) => (
                                    <div
                                        key={text}
                                        className={`flex items-start gap-3 rounded-xl border border-neutral-200 bg-neutral-50 p-4 ${
                                            index === guidelines.length - 1 ? "sm:col-span-2" : ""
                                        }`}
                                    >
                                        <FiCheckCircle className="mt-0.5 shrink-0 text-neutral-900" size={19} />
                                        <span className="text-sm leading-5 text-neutral-700">{text}</span>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Required Documents */}
                        <section className="mb-10">
                            <div className="mb-5">
                                <h3 className="text-lg font-semibold text-neutral-950">Required Documents</h3>
                                <p className="mt-1 text-sm text-neutral-500">
                                    Have the following documents ready before you begin.
                                </p>
                            </div>
                            <div className="grid gap-3 sm:grid-cols-2">
                                {documents.map(({ icon: Icon, label }) => (
                                    <div key={label} className="flex items-center gap-3 rounded-xl border border-neutral-200 p-4">
                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-neutral-100">
                                            <Icon className="text-neutral-800" size={18} />
                                        </div>
                                        <span className="text-sm font-medium text-neutral-800">{label}</span>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Estimated Time */}
                        <div className="mb-8 flex items-start gap-3 rounded-xl border border-blue-200 bg-blue-50 p-4">
                            <FiClock className="mt-0.5 shrink-0 text-blue-600" size={20} />
                            <div>
                                <p className="text-sm font-medium text-blue-900">Estimated completion time</p>
                                <p className="mt-0.5 text-sm text-blue-700">
                                    Approximately <strong>15 - 20 Minutes</strong>
                                </p>
                            </div>
                        </div>

                        {/* Apply Button */}
                        <button
                            type="button"
                            onClick={handleApplyNow}
                            disabled={loading}
                            className="
                                flex w-full items-center justify-center
                                rounded-lg bg-black px-5 py-3.5
                                text-sm font-semibold text-white shadow-sm
                                transition-all duration-200
                                hover:bg-neutral-800 hover:shadow-md
                                active:scale-[0.99]
                                disabled:cursor-not-allowed disabled:opacity-50
                                focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2
                            "
                        >
                            {loading ? "Creating Application..." : "Apply Now"}
                        </button>

                    </div>
                </div>

                {/* Footer Note */}
                <p className="mt-6 text-center text-xs text-neutral-400">
                    Make sure all information provided in your application is accurate and complete.
                </p>

            </div>
        </div>
    );
};

export default WelcomePage;