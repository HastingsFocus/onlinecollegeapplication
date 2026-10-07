import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ApplicationStepper from "../../../components/student/ApplicationStepper";
import Input from "../../../components/ui/Input";
import Select from "../../../components/ui/Select";
import Button from "../../../components/ui/Button";
import { getMyApplication, updateNextOfKin } from "../../../services/studentApplicationService";
import relationships from "../../../constants/relationships";

const NextOfKin = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        fullName: "",
        relationship: "",
        phone: "",
        email: "",
    });

    useEffect(() => {
        loadApplication();
    }, []);

    const loadApplication = async () => {
        try {
            const application = await getMyApplication();
            const info = application.nextOfKin;
            if (!info) return;

            setFormData({
                fullName: info.fullName || "",
                relationship: info.relationship || "",
                phone: info.phone || "",
                email: info.email || "",
            });
        } catch (error) {
            console.log(error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const saveNextOfKin = () => updateNextOfKin(formData);

    const handleSave = async () => {
        try {
            setLoading(true);
            await saveNextOfKin();
            alert("Next of Kin information saved successfully.");
        } catch (error) {
            alert(error.response?.data?.message || "Unable to save information.");
        } finally {
            setLoading(false);
        }
    };

    const handleContinue = async () => {
        try {
            setLoading(true);
            await saveNextOfKin();
            navigate("/student/application/academic");
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
                <ApplicationStepper currentStep={3} />
            </div>

            {/* Form Container */}
            <div className="mx-auto mt-6 w-full max-w-3xl">
                <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">

                    {/* Header */}
                    <div className="border-b border-neutral-200 px-5 py-6 sm:px-8">
                        <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
                            Step 3 of 9
                        </p>
                        <h1 className="mt-2 text-2xl font-bold tracking-tight text-neutral-950">
                            Next of Kin Information
                        </h1>
                        <p className="mt-2 text-sm leading-6 text-neutral-500">
                            Please provide the details of your next of kin or emergency contact.
                        </p>
                    </div>

                    {/* Form */}
                    <div className="p-5 sm:p-8">
                        <div className="space-y-6">
                            <div className="grid gap-6 sm:grid-cols-2">
                                <Input
                                    label="Full Name"
                                    name="fullName"
                                    value={formData.fullName}
                                    onChange={handleChange}
                                    placeholder="Enter full name"
                                    required
                                />
                                <Select
                                    label="Relationship"
                                    name="relationship"
                                    value={formData.relationship}
                                    onChange={handleChange}
                                    options={relationships}
                                    required
                                />
                            </div>

                            <div className="grid gap-6 sm:grid-cols-2">
                                <Input
                                    label="Phone Number"
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    placeholder="Enter phone number"
                                    required
                                />
                                <Input
                                    label="Email Address"
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="Enter email address"
                                />
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="mt-8 flex flex-col gap-4 border-t border-neutral-200 pt-6 sm:flex-row sm:items-center sm:justify-between">
                            <Button
                                text="← Back"
                                variant="secondary"
                                onClick={() => navigate("/student/application/contact")}
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
                Please provide accurate contact details so your emergency contact can be reached when necessary.
            </p>

        </div>
    );
};

export default NextOfKin;