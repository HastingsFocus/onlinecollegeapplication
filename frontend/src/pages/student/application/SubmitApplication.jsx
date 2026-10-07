import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiAlertTriangle, FiArrowRight, FiCheckCircle, FiFileText } from "react-icons/fi";
import ApplicationStepper from "../../../components/student/ApplicationStepper";
import Button from "../../../components/ui/Button";
import { submitApplication } from "../../../services/studentApplicationService";

const SubmitApplication = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        const confirmed = window.confirm(
            "Are you sure you want to submit your application? You will not be able to edit it afterwards."
        );
        if (!confirmed) return;

        try {
            setLoading(true);
            await submitApplication();
            alert("Application submitted successfully.");
            navigate("/student/application/status");
        } catch (error) {
            console.error(error);
            alert(error.response?.data?.message || "Unable to submit application.");
        } finally {
            setLoading(false);
        }
    };

    const declarations = [
        "I declare that the information provided in this application is true and accurate to the best of my knowledge.",
        "I understand that providing false or misleading information may result in the rejection of my application.",
        "I understand that after submission, I will no longer be able to edit my application.",
    ];

    return (
        <div className="min-h-screen bg-neutral-50 px-4 py-6 sm:px-6 lg:px-8">
            {/* Stepper */}
            <div className="mx-auto max-w-6xl">
                <ApplicationStepper currentStep={9} />
            </div>

            {/* Main Content */}
            <main className="mx-auto mt-6 max-w-3xl pb-10">
                <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">

                    {/* Header */}
                    <div className="border-b border-neutral-200 px-5 py-6 sm:px-8">
                        <div className="mb-3 flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-black text-sm font-bold text-white">
                                9
                            </div>
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
                                    Step 9 of 9
                                </p>
                                <h1 className="mt-1 text-xl font-semibold tracking-tight text-neutral-950 sm:text-2xl">
                                    Submit Application
                                </h1>
                            </div>
                        </div>
                        <p className="max-w-2xl text-sm leading-6 text-neutral-500">
                            You have completed the application process. Please read the declaration carefully before submitting.
                        </p>
                    </div>

                    {/* Content */}
                    <div className="space-y-6 px-5 py-6 sm:px-8 sm:py-8">

                        {/* Final Warning */}
                        <section className="rounded-xl border border-amber-200 bg-amber-50 p-5">
                            <div className="flex items-start gap-3">
                                <FiAlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
                                <div>
                                    <h2 className="text-sm font-semibold text-amber-900">Final submission</h2>
                                    <p className="mt-1 text-sm leading-6 text-amber-800">
                                        Before you submit, make sure all the information and documents in your application are correct. Once submitted, you will no longer be able to edit your application.
                                    </p>
                                </div>
                            </div>
                        </section>

                        {/* Declaration */}
                        <section className="rounded-xl border border-neutral-200 bg-white">
                            <div className="flex items-center gap-3 border-b border-neutral-200 px-5 py-4">
                                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-neutral-100 text-neutral-800">
                                    <FiFileText className="h-5 w-5" />
                                </div>
                                <div>
                                    <h2 className="text-base font-semibold text-neutral-950">
                                        Applicant Declaration
                                    </h2>
                                    <p className="text-xs text-neutral-500">
                                        Please confirm the information you have provided.
                                    </p>
                                </div>
                            </div>
                            <div className="space-y-4 px-5 py-5 text-sm leading-6 text-neutral-600">
                                {declarations.map((text) => (
                                    <div key={text} className="flex items-start gap-3">
                                        <FiCheckCircle className="mt-1 h-4 w-4 shrink-0 text-neutral-700" />
                                        <p>{text}</p>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* What Happens Next */}
                        <section className="rounded-xl border border-blue-200 bg-blue-50 p-5">
                            <div className="flex items-start gap-3">
                                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-sm font-bold text-blue-700">
                                    <FiArrowRight className="h-4 w-4" />
                                </div>
                                <div>
                                    <h2 className="text-sm font-semibold text-blue-900">
                                        What happens after submission?
                                    </h2>
                                    <p className="mt-1 text-sm leading-6 text-blue-800">
                                        Your application will be submitted for review. You will be able to track its status from your application status page.
                                    </p>
                                </div>
                            </div>
                        </section>

                        {/* Actions */}
                        <div className="flex flex-col-reverse gap-3 border-t border-neutral-200 pt-6 sm:flex-row sm:items-center sm:justify-between">
                            <Button
                                text="← Back"
                                variant="secondary"
                                onClick={() => navigate("/student/payment/success")}
                            />
                            <Button
                                text="Submit Application"
                                loading={loading}
                                onClick={handleSubmit}
                            />
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default SubmitApplication;