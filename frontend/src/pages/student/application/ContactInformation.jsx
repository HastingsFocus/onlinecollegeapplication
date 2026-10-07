import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ApplicationStepper from "../../../components/student/ApplicationStepper";
import Input from "../../../components/ui/Input";
import Select from "../../../components/ui/Select";
import Button from "../../../components/ui/Button";
import { getMyApplication, updateContactInfo } from "../../../services/studentApplicationService";
import malawiDistricts from "../../../constants/malawiDistricts";

const ContactInformation = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        email: "",
        phone: "",
        alternativePhone: "",
        address: "",
        district: "",
        country: "Malawi",
    });

    useEffect(() => {
        loadApplication();
    }, []);

    const loadApplication = async () => {
        try {
            const application = await getMyApplication();
            const info = application.contactInfo;
            if (!info) return;

            setFormData({
                email: info.email || "",
                phone: info.phone || "",
                alternativePhone: info.alternativePhone || "",
                address: info.address || "",
                district: info.district || "",
                country: info.country || "Malawi",
            });
        } catch (error) {
            console.log(error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const saveContactInformation = () => updateContactInfo(formData);

    const handleSave = async () => {
        try {
            setLoading(true);
            await saveContactInformation();
            alert("Contact information saved successfully.");
        } catch (error) {
            alert(error.response?.data?.message || "Unable to save contact information.");
        } finally {
            setLoading(false);
        }
    };

    const handleContinue = async () => {
        try {
            setLoading(true);
            await saveContactInformation();
            navigate("/student/application/next-of-kin");
        } catch (error) {
            alert(error.response?.data?.message || "Unable to continue.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-neutral-50 px-4 py-6 sm:px-6 lg:px-8">

            {/* Stepper */}
            <div className="mx-auto w-full max-w-6xl">
                <ApplicationStepper currentStep={2} />
            </div>

            {/* Form Container */}
            <div className="mx-auto mt-6 w-full max-w-3xl">
                <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">

                    {/* Header */}
                    <div className="border-b border-neutral-200 px-5 py-6 sm:px-8">
                        <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
                            Step 2 of 9
                        </p>
                        <h1 className="mt-2 text-2xl font-bold tracking-tight text-neutral-950">
                            Contact Information
                        </h1>
                        <p className="mt-2 text-sm leading-6 text-neutral-500">
                            Please provide your current contact information so the institution can reach you when necessary.
                        </p>
                    </div>

                    {/* Form */}
                    <div className="p-5 sm:p-8">
                        <div className="space-y-6">
                            <div className="grid gap-6 sm:grid-cols-2">
                                <Input
                                    label="Email Address"
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                                <Input
                                    label="Phone Number"
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <Input
                                label="Alternative Phone Number"
                                type="tel"
                                name="alternativePhone"
                                value={formData.alternativePhone}
                                onChange={handleChange}
                            />

                            <Input
                                label="Residential Address"
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                placeholder="Enter your current residential address"
                                required
                            />

                            <div className="grid gap-6 sm:grid-cols-2">
                                <Select
                                    label="District"
                                    name="district"
                                    value={formData.district}
                                    onChange={handleChange}
                                    options={malawiDistricts}
                                    required
                                />
                                <Select
                                    label="Country"
                                    name="country"
                                    value={formData.country}
                                    onChange={handleChange}
                                    options={["Malawi"]}
                                    required
                                />
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="mt-8 flex flex-col gap-4 border-t border-neutral-200 pt-6 sm:flex-row sm:items-center sm:justify-between">
                            <Button
                                text="← Back"
                                variant="secondary"
                                onClick={() => navigate("/student/application/personal")}
                            />
                            <div className="flex flex-col gap-3 sm:flex-row">
                                <Button
                                    text="Save"
                                    variant="secondary"
                                    loading={loading}
                                    onClick={handleSave}
                                />
                                <Button
                                    text="Save & Continue"
                                    loading={loading}
                                    onClick={handleContinue}
                                />
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            {/* Footer Note */}
            <p className="mx-auto mt-6 max-w-3xl text-center text-xs text-neutral-400">
                Your contact information will only be used for application and admission-related communication.
            </p>

        </div>
    );
};

export default ContactInformation;