import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiAlertCircle, FiCheckCircle, FiClock, FiFileText, FiRefreshCw, FiXCircle } from "react-icons/fi";
import Button from "../../../components/ui/Button";
import { getMyApplication } from "../../../services/studentApplicationService";

const ApplicationStatus = () => {
    const navigate = useNavigate();
    const [application, setApplication] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadApplication();
    }, []);

    const loadApplication = async () => {
        try {
            setLoading(true);
            const data = await getMyApplication();
            setApplication(data);
        } catch (error) {
            console.error("Failed to load application:", error);
            alert(error.response?.data?.message || "Failed to load application status.");
        } finally {
            setLoading(false);
        }
    };

    const getStatusConfig = (status) => {
        switch (status) {
            case "Accepted":
                return {
                    icon: FiCheckCircle,
                    label: "Accepted",
                    description: "Congratulations! Your application has been accepted.",
                    wrapper: "border-green-200 bg-green-50",
                    iconWrapper: "bg-green-100 text-green-700",
                    title: "text-green-900",
                    text: "text-green-800",
                };
            case "Rejected":
                return {
                    icon: FiXCircle,
                    label: "Rejected",
                    description: "Your application was not successful.",
                    wrapper: "border-red-200 bg-red-50",
                    iconWrapper: "bg-red-100 text-red-700",
                    title: "text-red-900",
                    text: "text-red-800",
                };
            case "Submitted":
            case "Under Review":
                return {
                    icon: FiClock,
                    label: status,
                    description: "Your application has been submitted and is currently being reviewed.",
                    wrapper: "border-blue-200 bg-blue-50",
                    iconWrapper: "bg-blue-100 text-blue-700",
                    title: "text-blue-900",
                    text: "text-blue-800",
                };
            default:
                return {
                    icon: FiFileText,
                    label: status || "Pending",
                    description: "Your application is currently being processed.",
                    wrapper: "border-neutral-200 bg-neutral-50",
                    iconWrapper: "bg-neutral-100 text-neutral-700",
                    title: "text-neutral-900",
                    text: "text-neutral-700",
                };
        }
    };

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-neutral-50 px-4">
                <div className="text-center">
                    <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-neutral-200 border-t-black" />
                    <p className="text-sm text-neutral-500">
                        Loading application status...
                    </p>
                </div>
            </div>
        );
    }

    if (!application) {
        return (
            <div className="min-h-screen bg-neutral-50 px-4 py-10 sm:px-6 lg:px-8">
                <main className="mx-auto max-w-2xl">
                    <div className="rounded-2xl border border-neutral-200 bg-white p-8 text-center shadow-sm">
                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-neutral-100">
                            <FiAlertCircle className="h-6 w-6 text-neutral-700" />
                        </div>
                        <h1 className="mt-4 text-xl font-semibold text-neutral-950">
                            No Application Found
                        </h1>
                        <p className="mt-2 text-sm text-neutral-500">
                            We could not find an application associated with your account.
                        </p>
                        <div className="mt-6 flex justify-center">
                            <Button
                                text="Back to Dashboard"
                                onClick={() => navigate("/student/dashboard")}
                            />
                        </div>
                    </div>
                </main>
            </div>
        );
    }

    const acceptedProgram = application.programChoice?.acceptedProgram;
    const statusConfig = getStatusConfig(application.status);
    const StatusIcon = statusConfig.icon;
    const isDecided = application.status === "Accepted" || application.status === "Rejected";

    const programmeChoices = [
        { label: "1st Choice", data: application.programChoice?.firstChoice },
        { label: "2nd Choice", data: application.programChoice?.secondChoice },
        { label: "3rd Choice", data: application.programChoice?.thirdChoice },
    ];

    const timeline = [
        {
            label: "Application Submitted",
            description: "Your application has been successfully submitted.",
            complete: true,
        },
        {
            label: "Application Review",
            description: "Your application is reviewed by the admissions team.",
            complete: isDecided,
        },
        {
            label: "Admission Decision",
            description: "Your final admission decision will be displayed here.",
            complete: application.status === "Accepted",
        },
    ];

    return (
        <div className="min-h-screen bg-neutral-50 px-4 py-6 sm:px-6 lg:px-8">
            <main className="mx-auto max-w-4xl pb-10">

                {/* Page Header */}
                <div className="mb-6">
                    <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
                        Student Portal
                    </p>
                    <h1 className="mt-1 text-2xl font-semibold tracking-tight text-neutral-950 sm:text-3xl">
                        Application Status
                    </h1>
                    <p className="mt-2 text-sm leading-6 text-neutral-500">
                        Track the progress and outcome of your college application.
                    </p>
                </div>

                {/* Current Status */}
                <section className={`mb-6 rounded-2xl border p-6 shadow-sm ${statusConfig.wrapper}`}>
                    <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-start gap-4">
                            <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${statusConfig.iconWrapper}`}>
                                <StatusIcon className="h-6 w-6" />
                            </div>
                            <div>
                                <p className={`text-xs font-semibold uppercase tracking-wider ${statusConfig.text}`}>
                                    Current Application Status
                                </p>
                                <h2 className={`mt-1 text-2xl font-bold ${statusConfig.title}`}>
                                    {statusConfig.label}
                                </h2>
                                <p className={`mt-1 text-sm leading-6 ${statusConfig.text}`}>
                                    {statusConfig.description}
                                </p>
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={loadApplication}
                            disabled={loading}
                            className="inline-flex items-center justify-center gap-2 self-start rounded-lg border border-neutral-300 bg-white px-4 py-2.5 text-sm font-medium text-neutral-800 shadow-sm transition-all hover:border-neutral-400 hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 sm:self-center"
                        >
                            <FiRefreshCw className="h-4 w-4" />
                            Refresh
                        </button>
                    </div>
                </section>

                {/* Admission Confirmation */}
                {application.status === "Accepted" && acceptedProgram && (
                    <section className="mb-6 overflow-hidden rounded-2xl border border-green-200 bg-white shadow-sm">
                        <div className="border-b border-green-200 bg-green-50 px-6 py-5">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-100 text-green-700">
                                    <FiCheckCircle className="h-5 w-5" />
                                </div>
                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-wider text-green-700">
                                        Admission Confirmed
                                    </p>
                                    <h2 className="mt-1 text-lg font-semibold text-green-950">
                                        Congratulations!
                                    </h2>
                                </div>
                            </div>
                        </div>
                        <div className="px-6 py-6">
                            <p className="text-sm text-neutral-500">
                                You have been accepted into the following programme:
                            </p>
                            <div className="mt-4 rounded-xl border border-neutral-200 bg-neutral-50 p-5">
                                <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
                                    Accepted Programme
                                </p>
                                <h3 className="mt-2 text-xl font-semibold text-neutral-950">
                                    {acceptedProgram.name}
                                </h3>
                            </div>
                        </div>
                    </section>
                )}

                {/* Programme Choices */}
                <section className="mb-6 overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">
                    <div className="border-b border-neutral-200 px-6 py-5">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-neutral-100 text-neutral-800">
                                <FiFileText className="h-5 w-5" />
                            </div>
                            <div>
                                <h2 className="text-base font-semibold text-neutral-950">
                                    Programme Choices
                                </h2>
                                <p className="mt-1 text-xs text-neutral-500">
                                    Your selected programme preferences.
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="grid gap-4 p-6 md:grid-cols-3">
                        {programmeChoices.map(({ label, data }) => (
                            <div key={label} className="rounded-xl border border-neutral-200 bg-neutral-50 p-4">
                                <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
                                    {label}
                                </p>
                                <p className="mt-2 text-sm font-semibold text-neutral-950">
                                    {data?.name || "Not selected"}
                                </p>
                            </div>
                        ))}
                    </div>
                    {application.status === "Accepted" && acceptedProgram && (
                        <div className="border-t border-neutral-200 px-6 py-5">
                            <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
                                Accepted Programme
                            </p>
                            <p className="mt-2 text-sm font-semibold text-green-700">
                                {acceptedProgram.name}
                            </p>
                        </div>
                    )}
                </section>

                {/* Remarks */}
                {application.remarks && (
                    <section className="mb-6 rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-neutral-100 text-neutral-800">
                                <FiAlertCircle className="h-5 w-5" />
                            </div>
                            <div>
                                <h2 className="text-base font-semibold text-neutral-950">
                                    Admissions Remarks
                                </h2>
                                <p className="mt-1 text-xs text-neutral-500">
                                    Additional information from the admissions team.
                                </p>
                            </div>
                        </div>
                        <div className="mt-5 rounded-xl border border-neutral-200 bg-neutral-50 p-4">
                            <p className="text-sm leading-6 text-neutral-700">
                                {application.remarks}
                            </p>
                        </div>
                    </section>
                )}

                {/* Application Timeline */}
                <section className="mb-6 rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
                    <div className="mb-5">
                        <h2 className="text-base font-semibold text-neutral-950">
                            Application Progress
                        </h2>
                        <p className="mt-1 text-xs text-neutral-500">
                            Your application journey from submission to admission.
                        </p>
                    </div>
                    <div className="space-y-5">
                        {timeline.map((step, index) => (
                            <div key={step.label}>
                                <div className="flex items-start gap-4">
                                    <div
                                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                                            step.complete
                                                ? "bg-black text-white"
                                                : "border-2 border-neutral-300 bg-white text-neutral-400"
                                        }`}
                                    >
                                        {step.complete ? "✓" : index + 1}
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-neutral-950">
                                            {step.label}
                                        </p>
                                        <p className="mt-1 text-xs text-neutral-500">
                                            {step.description}
                                        </p>
                                    </div>
                                </div>
                                {index < timeline.length - 1 && (
                                    <div className="ml-4 h-5 border-l border-neutral-300" />
                                )}
                            </div>
                        ))}
                    </div>
                </section>

                {/* Actions */}
                <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                    <Button
                        text="Back to Dashboard"
                        variant="secondary"
                        onClick={() => navigate("/student/dashboard")}
                    />
                </div>
            </main>
        </div>
    );
};

export default ApplicationStatus;