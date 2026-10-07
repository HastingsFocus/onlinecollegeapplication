import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ApplicationStepper from "../../../components/student/ApplicationStepper";
import Input from "../../../components/ui/Input";
import Button from "../../../components/ui/Button";
import Select from "../../../components/ui/Select";
import academicSubjects from "../../../constants/academicSubjects";
import grades from "../../../constants/grades";
import academicYears from "../../../constants/academicYears";
import { getMyApplication, updateAcademicInfo } from "../../../services/studentApplicationService";

const AcademicInformation = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        schoolName: "",
        examinationNumber: "",
        yearCompleted: "",
        subjects: [{ subject: "", grade: "" }],
    });

    useEffect(() => {
        loadApplication();
    }, []);

    const loadApplication = async () => {
        try {
            const application = await getMyApplication();
            const info = application.academicInfo;
            if (!info) return;

            setFormData({
                schoolName: info.schoolName || "",
                examinationNumber: info.examinationNumber || "",
                yearCompleted: info.yearCompleted ? info.yearCompleted.toString() : "",
                subjects: info.subjects?.length ? info.subjects : [{ subject: "", grade: "" }],
            });
        } catch (error) {
            console.log(error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubjectChange = (index, field, value) => {
        const updatedSubjects = [...formData.subjects];
        updatedSubjects[index] = { ...updatedSubjects[index], [field]: value };
        setFormData((prev) => ({ ...prev, subjects: updatedSubjects }));
    };

    const getAvailableSubjects = (currentIndex) => {
        const selected = formData.subjects
            .filter((_, index) => index !== currentIndex)
            .map((item) => item.subject)
            .filter(Boolean);
        return academicSubjects.filter((subject) => !selected.includes(subject));
    };

    const addSubject = () => {
        if (formData.subjects.length >= 10) {
            alert("Maximum of 10 subjects allowed.");
            return;
        }
        setFormData((prev) => ({
            ...prev,
            subjects: [...prev.subjects, { subject: "", grade: "" }],
        }));
    };

    const removeSubject = (index) => {
        setFormData((prev) => ({
            ...prev,
            subjects: prev.subjects.filter((_, i) => i !== index),
        }));
    };

    const validateAcademicInformation = () => {
        if (!formData.schoolName) return "School name is required.";
        if (!formData.examinationNumber) return "Examination number is required.";
        if (!formData.yearCompleted) return "Please select year completed.";
        if (formData.subjects.length < 6) return "You must provide at least 6 MSCE subjects.";

        const incomplete = formData.subjects.some((s) => !s.subject || !s.grade);
        if (incomplete) return "Please select subject and grade for all entries.";

        return null;
    };

    const saveAcademicInformation = async () => {
        const validationError = validateAcademicInformation();
        if (validationError) throw new Error(validationError);
        return updateAcademicInfo(formData);
    };

    const handleSave = async () => {
        try {
            setLoading(true);
            await saveAcademicInformation();
            alert("Academic information saved successfully.");
        } catch (error) {
            alert(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleContinue = async () => {
        try {
            setLoading(true);
            await saveAcademicInformation();
            navigate("/student/application/programs");
        } catch (error) {
            alert(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-neutral-50 px-4 py-6 sm:px-6 lg:px-8">
            {/* Stepper */}
            <div className="mx-auto w-full max-w-6xl">
                <ApplicationStepper currentStep={4} />
            </div>

            {/* Form Card */}
            <div className="mx-auto mt-6 w-full max-w-3xl">
                <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">

                    {/* Header */}
                    <div className="border-b border-neutral-200 px-5 py-6 sm:px-8">
                        <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
                            Step 4 of 9
                        </p>
                        <h1 className="mt-2 text-2xl font-bold tracking-tight text-neutral-950">
                            Academic Information
                        </h1>
                        <p className="mt-2 text-sm leading-6 text-neutral-500">
                            Please provide your secondary school academic details and MSCE subjects and grades.
                        </p>
                    </div>

                    {/* Form Content */}
                    <div className="p-5 sm:p-8">

                        {/* School Information */}
                        <section>
                            <div className="mb-5">
                                <h2 className="text-base font-semibold text-neutral-950">
                                    Secondary School Details
                                </h2>
                                <p className="mt-1 text-sm text-neutral-500">
                                    Enter the details of the school where you completed your secondary education.
                                </p>
                            </div>

                            <div className="space-y-6">
                                <Input
                                    label="School Name"
                                    name="schoolName"
                                    value={formData.schoolName}
                                    onChange={handleChange}
                                    placeholder="Enter school name"
                                    required
                                />
                                <div className="grid gap-6 sm:grid-cols-2">
                                    <Input
                                        label="Examination Number"
                                        name="examinationNumber"
                                        value={formData.examinationNumber}
                                        onChange={handleChange}
                                        placeholder="Enter examination number"
                                        required
                                    />
                                    <Select
                                        label="Year Completed"
                                        name="yearCompleted"
                                        value={formData.yearCompleted}
                                        onChange={handleChange}
                                        options={academicYears}
                                        required
                                    />
                                </div>
                            </div>
                        </section>

                        {/* Subjects */}
                        <section className="mt-10 border-t border-neutral-200 pt-8">
                            <div className="mb-5">
                                <h2 className="text-base font-semibold text-neutral-950">
                                    MSCE Subjects and Grades
                                </h2>
                                <p className="mt-1 text-sm leading-6 text-neutral-500">
                                    Add a minimum of 6 subjects. Each subject must have a corresponding grade before you can continue.
                                </p>
                            </div>

                            <div className="space-y-4">
                                {formData.subjects.map((subject, index) => (
                                    <div
                                        key={index}
                                        className="rounded-xl border border-neutral-200 bg-neutral-50 p-4"
                                    >
                                        <div className="mb-4 flex items-center justify-between">
                                            <p className="text-sm font-semibold text-neutral-800">
                                                Subject {index + 1}
                                            </p>
                                            {formData.subjects.length > 1 && (
                                                <button
                                                    type="button"
                                                    onClick={() => removeSubject(index)}
                                                    className="text-xs font-medium text-red-600 transition-colors hover:text-red-700 focus:outline-none focus:underline"
                                                >
                                                    Remove
                                                </button>
                                            )}
                                        </div>

                                        <div className="grid gap-4 sm:grid-cols-[1fr_180px]">
                                            <Select
                                                label="Subject"
                                                name={`subject-${index}`}
                                                value={subject.subject}
                                                onChange={(e) => handleSubjectChange(index, "subject", e.target.value)}
                                                options={getAvailableSubjects(index)}
                                                required
                                            />
                                            <Select
                                                label="Grade"
                                                name={`grade-${index}`}
                                                value={subject.grade}
                                                onChange={(e) => handleSubjectChange(index, "grade", e.target.value)}
                                                options={grades}
                                                required
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Add Subject */}
                            <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                <p className="text-xs text-neutral-500">
                                    {formData.subjects.length} of 10 subjects added
                                </p>
                                <Button
                                    text="Add Subject"
                                    variant="secondary"
                                    onClick={addSubject}
                                    disabled={formData.subjects.length >= 10}
                                />
                            </div>

                            {/* Requirement Notice */}
                            <div className="mt-5 rounded-xl border border-blue-200 bg-blue-50 p-4">
                                <p className="text-sm font-medium text-blue-900">
                                    Academic requirement
                                </p>
                                <p className="mt-1 text-sm leading-5 text-blue-700">
                                    You must provide at least 6 MSCE subjects with their corresponding grades.
                                </p>
                            </div>
                        </section>

                        {/* Actions */}
                        <div className="mt-8 flex flex-col gap-4 border-t border-neutral-200 pt-6 sm:flex-row sm:items-center sm:justify-between">
                            <Button
                                text="← Back"
                                variant="secondary"
                                onClick={() => navigate("/student/application/next-of-kin")}
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
                Make sure the academic information matches your official MSCE results.
            </p>
        </div>
    );
};

export default AcademicInformation;