import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiCheckCircle, FiChevronRight, FiFileText, FiUser, FiPhone, FiUsers, FiBookOpen, FiLayers } from "react-icons/fi";
import ApplicationStepper from "../../../components/student/ApplicationStepper";
import Button from "../../../components/ui/Button";
import { getMyApplication } from "../../../services/studentApplicationService";

const ReviewApplication = () => {
    const navigate = useNavigate();
    const [application, setApplication] = useState(null);

    useEffect(() => {
        loadApplication();
    }, []);

    const loadApplication = async () => {
        try {
            const data = await getMyApplication();
            setApplication(data);
        } catch (error) {
            console.log(error);
        }
    };

    if (!application) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-neutral-50 px-4">
                <div className="text-center">
                    <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-neutral-200 border-t-neutral-900" />
                    <p className="text-sm font-medium text-neutral-600">
                        Loading your application...
                    </p>
                </div>
            </div>
        );
    }

    const fullName = [
        application.personalInfo?.firstName,
        application.personalInfo?.middleName,
        application.personalInfo?.lastName,
    ]
        .filter(Boolean)
        .join(" ");

    const formatDate = (date) => (date ? date.substring(0, 10) : "Not provided");

    const Detail = ({ label, value }) => (
        <div>
            <p className="text-xs font-medium uppercase tracking-wide text-neutral-400">
                {label}
            </p>
            <p className="mt-1 text-sm font-medium text-neutral-900">
                {value || "Not provided"}
            </p>
        </div>
    );

    const SectionHeader = ({ icon: Icon, title, description, editPath }) => (
        <div className="flex flex-col gap-4 border-b border-neutral-200 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-neutral-100">
                    <Icon size={19} className="text-neutral-800" />
                </div>
                <div>
                    <h2 className="text-base font-semibold text-neutral-950">{title}</h2>
                    {description && (
                        <p className="mt-1 text-xs leading-5 text-neutral-500">{description}</p>
                    )}
                </div>
            </div>
            {editPath && (
                <button
                    type="button"
                    onClick={() => navigate(editPath)}
                    className="inline-flex items-center gap-1.5 self-start text-xs font-semibold text-neutral-700 transition-colors hover:text-black focus:outline-none focus:underline sm:self-auto"
                >
                    Edit
                    <FiChevronRight size={14} />
                </button>
            )}
        </div>
    );

    const programmeChoices = [
        { badge: "1", filled: true, label: "First Choice", data: application.programChoice?.firstChoice },
        { badge: "2", filled: false, label: "Second Choice", data: application.programChoice?.secondChoice },
        { badge: "3", filled: false, label: "Third Choice", data: application.programChoice?.thirdChoice },
    ];

    return (
        <div className="min-h-screen bg-neutral-50 px-4 py-6 sm:px-6 lg:px-8">
            {/* Stepper */}
            <div className="mx-auto w-full max-w-6xl">
                <ApplicationStepper currentStep={7} />
            </div>

            {/* Main Content */}
            <div className="mx-auto mt-6 w-full max-w-3xl">

                {/* Page Header */}
                <div className="mb-6">
                    <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
                        Step 7 of 9
                    </p>
                    <h1 className="mt-2 text-2xl font-bold tracking-tight text-neutral-950 sm:text-3xl">
                        Review Your Application
                    </h1>
                    <p className="mt-2 text-sm leading-6 text-neutral-500">
                        Carefully review all the information below before proceeding to the application payment.
                    </p>
                </div>

                {/* Review Notice */}
                <div className="mb-6 flex items-start gap-3 rounded-xl border border-blue-200 bg-blue-50 p-4">
                    <FiCheckCircle size={19} className="mt-0.5 shrink-0 text-blue-600" />
                    <div>
                        <p className="text-sm font-semibold text-blue-900">Final review</p>
                        <p className="mt-1 text-sm leading-5 text-blue-700">
                            Please make sure all details are correct. You can edit any section before proceeding to payment.
                        </p>
                    </div>
                </div>

                <div className="space-y-5">

                    {/* Personal Information */}
                    <section className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">
                        <SectionHeader
                            icon={FiUser}
                            title="Personal Information"
                            description="Your basic personal details."
                            editPath="/student/application/personal"
                        />
                        <div className="grid gap-x-6 gap-y-5 p-5 sm:grid-cols-2 sm:p-6">
                            <Detail label="Full Name" value={fullName} />
                            <Detail label="Gender" value={application.personalInfo?.gender} />
                            <Detail label="Date of Birth" value={formatDate(application.personalInfo?.dateOfBirth)} />
                            <Detail label="Nationality" value={application.personalInfo?.nationality} />
                            <Detail label="National ID / Passport" value={application.personalInfo?.nationalId} />
                        </div>
                    </section>

                    {/* Contact Information */}
                    <section className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">
                        <SectionHeader
                            icon={FiPhone}
                            title="Contact Information"
                            description="Your current contact details."
                            editPath="/student/application/contact"
                        />
                        <div className="grid gap-x-6 gap-y-5 p-5 sm:grid-cols-2 sm:p-6">
                            <Detail label="Email Address" value={application.contactInfo?.email} />
                            <Detail label="Phone Number" value={application.contactInfo?.phone} />
                            <Detail label="Alternative Phone" value={application.contactInfo?.alternativePhone} />
                            <Detail label="District" value={application.contactInfo?.district} />
                            <div className="sm:col-span-2">
                                <Detail label="Residential Address" value={application.contactInfo?.address} />
                            </div>
                        </div>
                    </section>

                    {/* Next of Kin */}
                    <section className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">
                        <SectionHeader
                            icon={FiUsers}
                            title="Next of Kin"
                            description="Your emergency contact information."
                            editPath="/student/application/next-of-kin"
                        />
                        <div className="grid gap-x-6 gap-y-5 p-5 sm:grid-cols-2 sm:p-6">
                            <Detail label="Full Name" value={application.nextOfKin?.fullName} />
                            <Detail label="Relationship" value={application.nextOfKin?.relationship} />
                            <Detail label="Phone Number" value={application.nextOfKin?.phone} />
                            <Detail label="Email Address" value={application.nextOfKin?.email} />
                        </div>
                    </section>

                    {/* Academic Information */}
                    <section className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">
                        <SectionHeader
                            icon={FiBookOpen}
                            title="Academic Information"
                            description="Your secondary school and MSCE results."
                            editPath="/student/application/academic"
                        />
                        <div className="p-5 sm:p-6">
                            <div className="grid gap-x-6 gap-y-5 sm:grid-cols-2">
                                <Detail label="School Name" value={application.academicInfo?.schoolName} />
                                <Detail label="Examination Number" value={application.academicInfo?.examinationNumber} />
                                <Detail label="Year Completed" value={application.academicInfo?.yearCompleted} />
                            </div>

                            <div className="mt-7">
                                <h3 className="mb-3 text-sm font-semibold text-neutral-900">
                                    MSCE Subjects and Grades
                                </h3>
                                {application.academicInfo?.subjects?.length ? (
                                    <div className="overflow-hidden rounded-xl border border-neutral-200">
                                        <div className="overflow-x-auto">
                                            <table className="w-full min-w-[420px] border-collapse text-left">
                                                <thead>
                                                    <tr className="border-b border-neutral-200 bg-neutral-50">
                                                        <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-neutral-500">#</th>
                                                        <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-neutral-500">Subject</th>
                                                        <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-neutral-500">Grade</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {application.academicInfo.subjects.map((subject, index) => (
                                                        <tr key={index} className="border-b border-neutral-100 last:border-b-0">
                                                            <td className="px-4 py-3 text-sm text-neutral-400">{index + 1}</td>
                                                            <td className="px-4 py-3 text-sm font-medium text-neutral-800">{subject.subject}</td>
                                                            <td className="px-4 py-3">
                                                                <span className="inline-flex rounded-md bg-neutral-100 px-2.5 py-1 text-xs font-semibold text-neutral-800">
                                                                    {subject.grade}
                                                                </span>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                ) : (
                                    <p className="rounded-lg bg-neutral-50 p-4 text-sm text-neutral-500">
                                        No subjects provided.
                                    </p>
                                )}
                            </div>
                        </div>
                    </section>

                    {/* Programme Choices */}
                    <section className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">
                        <SectionHeader
                            icon={FiLayers}
                            title="Programme Choices"
                            description="Your preferred programmes in order of preference."
                            editPath="/student/application/programs"
                        />
                        <div className="space-y-3 p-5 sm:p-6">
                            {programmeChoices.map(({ badge, filled, label, data }) => (
                                <div
                                    key={label}
                                    className={`flex items-center gap-4 rounded-xl border border-neutral-200 p-4 ${filled ? "bg-neutral-50" : ""}`}
                                >
                                    <div
                                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                                            filled
                                                ? "bg-black text-white"
                                                : "border-2 border-neutral-300 bg-white text-neutral-500"
                                        }`}
                                    >
                                        {badge}
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-xs font-medium uppercase tracking-wide text-neutral-400">{label}</p>
                                        <p className="mt-1 text-sm font-semibold text-neutral-900">
                                            {data?.name || "Not selected"}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Documents */}
                    <section className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">
                        <SectionHeader
                            icon={FiFileText}
                            title="Uploaded Documents"
                            description="Documents submitted with your application."
                            editPath="/student/application/documents"
                        />
                        <div className="p-5 sm:p-6">
                            {application.documents?.length > 0 ? (
                                <div className="space-y-3">
                                    {application.documents.map((doc, index) => (
                                        <div
                                            key={index}
                                            className="flex items-center gap-3 rounded-xl border border-neutral-200 bg-neutral-50 p-4"
                                        >
                                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white">
                                                <FiCheckCircle size={17} className="text-green-600" />
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-sm font-medium text-neutral-900">{doc.documentType}</p>
                                                {doc.fileName && (
                                                    <p className="mt-0.5 truncate text-xs text-neutral-500">{doc.fileName}</p>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="rounded-xl border border-red-200 bg-red-50 p-4">
                                    <p className="text-sm font-medium text-red-800">No documents uploaded.</p>
                                </div>
                            )}
                        </div>
                    </section>
                </div>

                {/* Payment Notice */}
                <div className="mt-6 rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm sm:p-6">
                    <div className="flex items-start gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-neutral-100">
                            <FiCheckCircle size={19} className="text-neutral-800" />
                        </div>
                        <div>
                            <h2 className="text-sm font-semibold text-neutral-950">Ready to proceed?</h2>
                            <p className="mt-1 text-sm leading-6 text-neutral-500">
                                Once you proceed to payment, you will be able to complete the application payment before final submission.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="mt-6 mb-10 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <Button
                        text="← Back"
                        variant="secondary"
                        onClick={() => navigate("/student/application/documents")}
                    />
                    <Button
                        text="Proceed to Payment →"
                        onClick={() => navigate(`/student/payment/${application._id}`)}
                    />
                </div>
            </div>
        </div>
    );
};

export default ReviewApplication;