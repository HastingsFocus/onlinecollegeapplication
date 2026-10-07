import { useNavigate } from "react-router-dom";
import { FiCheckCircle, FiArrowRight, FiShield } from "react-icons/fi";
import ApplicationStepper from "../../../components/student/ApplicationStepper";
import Button from "../../../components/ui/Button";

const PaymentSuccess = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-neutral-50 px-4 py-6 sm:px-6 lg:px-8">
            {/* Stepper */}
            <div className="mx-auto max-w-6xl">
                <ApplicationStepper currentStep={8} />
            </div>

            {/* Main Content */}
            <main className="mx-auto mt-6 max-w-2xl pb-10">
                <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">

                    {/* Success Header */}
                    <div className="border-b border-neutral-200 px-5 py-8 text-center sm:px-8">
                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-50 text-green-600">
                            <FiCheckCircle className="h-9 w-9" />
                        </div>
                        <p className="mt-5 text-xs font-semibold uppercase tracking-wider text-neutral-500">
                            Payment Complete
                        </p>
                        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-neutral-950 sm:text-3xl">
                            Payment Successful
                        </h1>
                        <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-neutral-500">
                            Your application fee has been received successfully.
                        </p>
                    </div>

                    {/* Content */}
                    <div className="space-y-6 px-5 py-6 sm:px-8 sm:py-8">

                        {/* Confirmation */}
                        <div className="rounded-xl border border-green-200 bg-green-50 p-5">
                            <div className="flex items-start gap-3">
                                <FiCheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-green-600" />
                                <div>
                                    <h2 className="text-sm font-semibold text-green-900">
                                        Payment confirmed
                                    </h2>
                                    <p className="mt-1 text-sm leading-6 text-green-800">
                                        Your application payment has been successfully recorded. You can now proceed to the final submission step.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Next Step */}
                        <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-5">
                            <div className="flex items-start gap-3">
                                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-black text-sm font-bold text-white">
                                    9
                                </div>
                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
                                        Next Step
                                    </p>
                                    <h2 className="mt-1 text-base font-semibold text-neutral-950">
                                        Submit Your Application
                                    </h2>
                                    <p className="mt-1 text-sm leading-6 text-neutral-500">
                                        Review the final submission details and submit your application for admission.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Security Notice */}
                        <div className="flex items-start gap-3 rounded-xl border border-neutral-200 bg-white p-4">
                            <FiShield className="mt-0.5 h-5 w-5 shrink-0 text-neutral-700" />
                            <p className="text-xs leading-5 text-neutral-500">
                                Your payment has been securely processed and your application payment status has been recorded in the system.
                            </p>
                        </div>

                        {/* Action */}
                        <div className="border-t border-neutral-200 pt-6">
                            <Button
                                text="Continue to Submission"
                                onClick={() => navigate("/student/application/submit")}
                            />
                            <div className="mt-3 flex items-center justify-center gap-1 text-xs text-neutral-400">
                                <span>Continue to Step 9</span>
                                <FiArrowRight className="h-3.5 w-3.5" />
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default PaymentSuccess;