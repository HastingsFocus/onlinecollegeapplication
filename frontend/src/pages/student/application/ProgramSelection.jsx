import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ApplicationStepper from "../../../components/student/ApplicationStepper";
import Select from "../../../components/ui/Select";
import Button from "../../../components/ui/Button";
import { getApplicationPrograms, getMyApplication, selectPrograms } from "../../../services/studentApplicationService";

const ProgramSelection = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [programs, setPrograms] = useState([]);
    const [formData, setFormData] = useState({
        firstChoice: "",
        secondChoice: "",
        thirdChoice: "",
    });

    useEffect(() => {
        loadPrograms();
        loadApplication();
    }, []);

    const loadPrograms = async () => {
        try {
            const response = await getApplicationPrograms();
            setPrograms(response.programs || []);
        } catch (error) {
            console.error("Failed to load application programs:", error);
            alert(error.response?.data?.message || "Failed to load programs for this intake.");
        }
    };

    const loadApplication = async () => {
        try {
            const application = await getMyApplication();
            const choice = application.programChoice;
            if (!choice) return;

            setFormData({
                firstChoice: choice.firstChoice?._id || "",
                secondChoice: choice.secondChoice?._id || "",
                thirdChoice: choice.thirdChoice?._id || "",
            });
        } catch (error) {
            console.log(error);
        }
    };

    const handleChange = (e) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const getAvailablePrograms = (field) => {
        const selected = [formData.firstChoice, formData.secondChoice, formData.thirdChoice];
        return programs.filter((program) => !selected.includes(program._id) || formData[field] === program._id);
    };

    const formatPrograms = (field) =>
        getAvailablePrograms(field).map((program) => ({
            value: program._id,
            label: program.name,
        }));

    const validateChoices = () => {
        const choices = [formData.firstChoice, formData.secondChoice, formData.thirdChoice].filter(Boolean);

        if (new Set(choices).size !== choices.length) {
            alert("A programme cannot be selected more than once.");
            return false;
        }
        if (!formData.firstChoice) {
            alert("Please select your first programme choice.");
            return false;
        }
        return true;
    };

    const savePrograms = async () => {
        if (!validateChoices()) return false;
        await selectPrograms(formData);
        return true;
    };

    const handleSave = async () => {
        try {
            setLoading(true);
            await savePrograms();
            alert("Programme choices saved successfully.");
        } catch (error) {
            alert(error.response?.data?.message || "Failed to save programmes.");
        } finally {
            setLoading(false);
        }
    };

    const handleContinue = async () => {
        try {
            setLoading(true);
            const saved = await savePrograms();
            if (saved) navigate("/student/application/documents");
        } catch (error) {
            alert(error.response?.data?.message || "Unable to continue.");
        } finally {
            setLoading(false);
        }
    };

    const choices = [
        {
            field: "firstChoice",
            label: "First Choice",
            badge: "1",
            filled: true,
            description: "Your preferred programme. This selection is required.",
        },
        {
            field: "secondChoice",
            label: "Second Choice",
            badge: "2",
            filled: false,
            description: "Optional alternative programme.",
        },
        {
            field: "thirdChoice",
            label: "Third Choice",
            badge: "3",
            filled: false,
            description: "Optional alternative programme.",
        },
    ];

    return (
        <div className="min-h-screen bg-neutral-50 px-4 py-6 sm:px-6 lg:px-8">
            {/* Stepper */}
            <div className="mx-auto w-full max-w-6xl">
                <ApplicationStepper currentStep={5} />
            </div>

            {/* Form Card */}
            <div className="mx-auto mt-6 w-full max-w-3xl">
                <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">

                    {/* Header */}
                    <div className="border-b border-neutral-200 px-5 py-6 sm:px-8">
                        <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
                            Step 5 of 9
                        </p>
                        <h1 className="mt-2 text-2xl font-bold tracking-tight text-neutral-950">
                            Programme Selection
                        </h1>
                        <p className="mt-2 text-sm leading-6 text-neutral-500">
                            Select the programmes you would like to be considered for, in order of preference.
                        </p>
                    </div>

                    {/* Form Content */}
                    <div className="p-5 sm:p-8">

                        {/* Information Notice */}
                        <div className="mb-8 rounded-xl border border-blue-200 bg-blue-50 p-4">
                            <p className="text-sm font-semibold text-blue-900">
                                Programme preferences
                            </p>
                            <p className="mt-1 text-sm leading-6 text-blue-700">
                                Your first choice is required. You may also select a second and third choice if you wish. Each programme can only be selected once.
                            </p>
                        </div>

                        {/* Programme Choices */}
                        <div className="space-y-6">
                            {choices.map(({ field, label, badge, filled, description }) => (
                                <div key={field} className="rounded-xl border border-neutral-200 bg-neutral-50 p-5">
                                    <div className="mb-4 flex items-start gap-3">
                                        <div
                                            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                                                filled
                                                    ? "bg-black text-white"
                                                    : "border-2 border-neutral-300 bg-white text-neutral-500"
                                            }`}
                                        >
                                            {badge}
                                        </div>
                                        <div>
                                            <h2 className="text-sm font-semibold text-neutral-950">{label}</h2>
                                            <p className="mt-1 text-xs leading-5 text-neutral-500">{description}</p>
                                        </div>
                                    </div>

                                    <Select
                                        label={label}
                                        name={field}
                                        value={formData[field]}
                                        onChange={handleChange}
                                        options={formatPrograms(field)}
                                        required={filled}
                                    />
                                </div>
                            ))}
                        </div>

                        {/* Available Programme Count */}
                        <div className="mt-6 rounded-xl border border-neutral-200 bg-white p-4">
                            <div className="flex items-center justify-between gap-4">
                                <span className="text-sm text-neutral-600">
                                    Programmes available for this intake
                                </span>
                                <span className="text-sm font-semibold text-neutral-950">
                                    {programs.length}
                                </span>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="mt-8 flex flex-col gap-4 border-t border-neutral-200 pt-6 sm:flex-row sm:items-center sm:justify-between">
                            <Button
                                text="← Back"
                                variant="secondary"
                                onClick={() => navigate("/student/application/academic")}
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

            <p className="mx-auto mt-6 max-w-3xl text-center text-xs text-neutral-400">
                Programme availability is based on the programmes allocated to the current admission intake.
            </p>
        </div>
    );
};

export default ProgramSelection;