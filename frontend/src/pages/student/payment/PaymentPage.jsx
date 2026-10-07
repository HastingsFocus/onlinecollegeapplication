import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ApplicationStepper from "../../../components/student/ApplicationStepper";
import PaymentSummary from "../../../components/payment/PaymentSummary";
import PaymentMethod from "../../../components/payment/PaymentMethod";
import Button from "../../../components/ui/Button";
import paymentMethods from "../../../constants/paymentMethods";
import { initiatePayment } from "../../../services/paymentService";

const PaymentPage = () => {
    const { applicationId } = useParams();
    const navigate = useNavigate();
    const [method, setMethod] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [loading, setLoading] = useState(false);

    const applicationFee = 25000;

    const handlePayment = async () => {
        if (!method) return alert("Please select a payment method.");
        if (!phoneNumber) return alert("Please enter your mobile money number.");

        try {
            setLoading(true);

            const response = await initiatePayment({
                applicationId,
                gateway: "PayChangu",
                method,
                phoneNumber,
            });

            alert("Payment request sent successfully. Please complete the payment on your phone.");

            if (response.sandbox) {
                navigate(`/student/payment/success/${applicationId}`);
            } else {
                navigate(`/student/payment/status/${applicationId}`);
            }
        } catch (error) {
            console.error(error);
            alert(error.response?.data?.message || "Unable to initiate payment.");
        } finally {
            setLoading(false);
        }
    };

    const instructions = [
        "Select your preferred mobile money provider.",
        "Enter your registered mobile money number.",
        <>Click <strong className="font-semibold">Pay Now</strong>.</>,
        "Approve the payment request on your phone.",
        "Once payment is successful, your application will be marked as paid.",
    ];

    return (
        <div className="min-h-screen bg-neutral-50 px-4 py-6 sm:px-6 lg:px-8">
            {/* Stepper */}
            <div className="mx-auto max-w-6xl">
                <ApplicationStepper currentStep={8} />
            </div>

            {/* Main Content */}
            <main className="mx-auto mt-6 max-w-3xl pb-10">
                <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">

                    {/* Header */}
                    <div className="border-b border-neutral-200 px-5 py-6 sm:px-8 sm:py-7">
                        <div className="flex items-start gap-4">
                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-black text-sm font-bold text-white shadow-sm">
                                8
                            </div>
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
                                    Step 8 of 9
                                </p>
                                <h1 className="mt-1 text-xl font-semibold tracking-tight text-neutral-950 sm:text-2xl">
                                    Application Payment
                                </h1>
                                <p className="mt-2 max-w-2xl text-sm leading-6 text-neutral-500">
                                    Pay the application fee to proceed with your application submission.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Payment Content */}
                    <div className="space-y-8 px-5 py-6 sm:px-8 sm:py-8">

                        {/* Payment Summary */}
                        <section>
                            <PaymentSummary amount={applicationFee} />
                        </section>

                        {/* Payment Instructions */}
                        <section className="rounded-xl border border-blue-200 bg-blue-50 p-5">
                            <div className="mb-5 flex items-start gap-3">
                                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-sm font-bold text-blue-700">
                                    i
                                </div>
                                <div>
                                    <h2 className="text-sm font-semibold text-blue-900">
                                        Payment Instructions
                                    </h2>
                                    <p className="mt-1 text-xs leading-5 text-blue-700">
                                        Follow these steps to complete your application payment.
                                    </p>
                                </div>
                            </div>
                            <ol className="space-y-3 text-sm leading-6 text-blue-900">
                                {instructions.map((step, index) => (
                                    <li key={index} className="flex items-start gap-3">
                                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-semibold text-blue-700">
                                            {index + 1}
                                        </span>
                                        <span className="pt-0.5">{step}</span>
                                    </li>
                                ))}
                            </ol>
                        </section>

                        {/* Payment Method */}
                        <section className="border-t border-neutral-200 pt-7">
                            <div className="mb-5">
                                <h2 className="text-base font-semibold text-neutral-950">
                                    Choose Payment Method
                                </h2>
                                <p className="mt-1 text-sm leading-5 text-neutral-500">
                                    Select the mobile money provider you want to use for your application fee.
                                </p>
                            </div>
                            <PaymentMethod
                                methods={paymentMethods}
                                selected={method}
                                setSelected={setMethod}
                            />
                        </section>

                        {/* Mobile Money Number */}
                        <section className="border-t border-neutral-200 pt-7">
                            <div className="mb-4">
                                <label htmlFor="phoneNumber" className="block text-sm font-medium text-neutral-800">
                                    Mobile Money Number
                                    <span className="ml-1 text-red-600" aria-hidden="true">*</span>
                                </label>
                                <p className="mt-1 text-xs leading-5 text-neutral-500">
                                    Enter the mobile number registered with your selected mobile money provider.
                                </p>
                            </div>
                            <input
                                id="phoneNumber"
                                type="tel"
                                inputMode="numeric"
                                autoComplete="tel"
                                placeholder="0991234567"
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                                className="
                                    w-full rounded-lg border border-neutral-300
                                    bg-white px-3.5 py-3 text-sm text-neutral-900
                                    placeholder:text-neutral-400 shadow-sm
                                    outline-none transition-all duration-200
                                    focus:border-neutral-900 focus:ring-2 focus:ring-neutral-900/10
                                "
                            />
                            <p className="mt-2 text-xs text-neutral-400">
                                Example: 0991234567
                            </p>
                        </section>

                        {/* Security Notice */}
                        <div className="rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-4">
                            <div className="flex items-start gap-3">
                                <div className="mt-0.5 text-sm font-bold text-neutral-700">!</div>
                                <p className="text-xs leading-5 text-neutral-600">
                                    <span className="font-semibold text-neutral-900">Important:</span>{" "}
                                    Make sure the mobile money number belongs to the account you intend to use for this payment. Never share your mobile money PIN with anyone.
                                </p>
                            </div>
                        </div>

                        {/* Payment Status Hint */}
                        <div className="rounded-xl border border-neutral-200 bg-white px-4 py-4">
                            <p className="text-xs leading-5 text-neutral-500">
                                After approving the payment on your phone, please wait for the payment confirmation before continuing. Your application will only proceed once the payment has been successfully confirmed.
                            </p>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col-reverse gap-3 border-t border-neutral-200 pt-6 sm:flex-row sm:items-center sm:justify-between">
                            <Button
                                text="← Back"
                                variant="secondary"
                                onClick={() => navigate("/student/application/review")}
                            />
                            <Button
                                text="Pay Now"
                                loading={loading}
                                disabled={!method || !phoneNumber}
                                onClick={handlePayment}
                            />
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default PaymentPage;