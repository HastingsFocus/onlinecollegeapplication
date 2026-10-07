import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ApplicationStepper from "../../../components/student/ApplicationStepper";
import Input from "../../../components/ui/Input";
import Select from "../../../components/ui/Select";
import DateInput from "../../../components/ui/DateInput";
import Button from "../../../components/ui/Button";
import { getMyApplication, updatePersonalInfo } from "../../../services/studentApplicationService";

const PersonalInformation = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        firstName: "",
        middleName: "",
        lastName: "",
        gender: "",
        dateOfBirth: "",
        nationality: "Malawian",
        nationalId: "",
    });

    useEffect(() => {
        loadApplication();
    }, []);

    const loadApplication = async () => {
        try {
            const application = await getMyApplication();
            const info = application.personalInfo;
            if (!info) return;

            setFormData({
                firstName: info.firstName || "",
                middleName: info.middleName || "",
                lastName: info.lastName || "",
                gender: info.gender || "",
                dateOfBirth: info.dateOfBirth ? info.dateOfBirth.substring(0, 10) : "",
                nationality: info.nationality || "Malawian",
                nationalId: info.nationalId || "",
            });
        } catch (error) {
            console.log(error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const savePersonalInformation = () => updatePersonalInfo(formData);

    const handleSave = async () => {
        try {
            setLoading(true);
            await savePersonalInformation();
            alert("Personal information saved successfully.");
        } catch (error) {
            alert(error.response?.data?.message || "Unable to save personal information.");
        } finally {
            setLoading(false);
        }
    };

    const handleContinue = async () => {
        try {
            setLoading(true);
            await savePersonalInformation();
            navigate("/student/application/contact");
        } catch (error) {
            alert(error.response?.data?.message || "Unable to save personal information.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-neutral-50 px-4 py-6 sm:px-6 lg:px-8">

            {/* Stepper */}
            <div className="mx-auto w-full max-w-6xl">
                <ApplicationStepper currentStep={1} />
            </div>

            {/* Form Container */}
            <div className="mx-auto mt-6 w-full max-w-3xl">
                <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">

                    {/* Header */}
                    <div className="border-b border-neutral-200 px-5 py-6 sm:px-8">
                        <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
                            Step 1 of 9
                        </p>
                        <h1 className="mt-2 text-2xl font-bold tracking-tight text-neutral-950">
                            Personal Information
                        </h1>
                        <p className="mt-2 max-w-2xl text-sm leading-6 text-neutral-500">
                            Please provide your personal details exactly as they appear on your National ID or Passport.
                        </p>
                    </div>

                    {/* Form */}
                    <div className="p-5 sm:p-8">
                        <div className="space-y-6">
                            <div className="grid gap-6 sm:grid-cols-2">
                                <Input
                                    label="First Name"
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    required
                                />
                                <Input
                                    label="Middle Name"
                                    name="middleName"
                                    value={formData.middleName}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="grid gap-6 sm:grid-cols-2">
                                <Input
                                    label="Last Name"
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    required
                                />
                                <Select
                                    label="Gender"
                                    name="gender"
                                    value={formData.gender}
                                    onChange={handleChange}
                                    options={["Male", "Female"]}
                                    required
                                />
                            </div>

                            <div className="grid gap-6 sm:grid-cols-2">
                                <DateInput
                                    label="Date of Birth"
                                    name="dateOfBirth"
                                    value={formData.dateOfBirth}
                                    onChange={handleChange}
                                    required
                                />
                                <Input
                                    label="Nationality"
                                    name="nationality"
                                    value={formData.nationality}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <Input
                                label="National ID / Passport Number"
                                name="nationalId"
                                value={formData.nationalId}
                                onChange={handleChange}
                            />
                        </div>

                        {/* Actions */}
                        <div className="mt-8 flex flex-col-reverse gap-3 border-t border-neutral-200 pt-6 sm:flex-row sm:justify-end">
                            <Button
                                text="Save"
                                loading={loading}
                                onClick={handleSave}
                                variant="secondary"
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
    );
};

export default PersonalInformation;