import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiCheckCircle, FiFileText, FiUploadCloud } from "react-icons/fi";
import ApplicationStepper from "../../../components/student/ApplicationStepper";
import Button from "../../../components/ui/Button";
import Select from "../../../components/ui/Select";
import FileUpload from "../../../components/ui/FileUpload";
import documentTypes from "../../../constants/documentTypes";
import compressImage from "../../../utils/compressImage";
import { getMyApplication, uploadDocuments } from "../../../services/studentApplicationService";

const DocumentUpload = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState("");
    const [documents, setDocuments] = useState([
        { documentType: "", documentName: "", documentUrl: "", file: null },
    ]);

    useEffect(() => {
        loadApplication();
    }, []);

    const loadApplication = async () => {
        try {
            const application = await getMyApplication();
            if (!application.documents?.length) return;

            setDocuments(
                application.documents.map((doc) => ({
                    documentType: doc.documentType,
                    documentName: doc.fileName || "",
                    documentUrl: doc.fileUrl || "",
                    file: null,
                }))
            );
        } catch (error) {
            console.log(error);
        }
    };

    const handleTypeChange = (index, value) => {
        const updated = [...documents];
        updated[index].documentType = value;
        setDocuments(updated);
    };

    // Compress immediately after file selection
    const handleFileChange = async (index, file) => {
        if (!file) return;

        try {
            setLoading(true);
            setLoadingMessage("Optimizing image...");

            const finalFile = file.type.startsWith("image/") ? await compressImage(file) : file;

            const updated = [...documents];
            updated[index].file = finalFile;
            updated[index].documentName = finalFile.name;
            setDocuments(updated);
        } catch (error) {
            console.error(error);
            const updated = [...documents];
            updated[index].file = file;
            updated[index].documentName = file.name;
            setDocuments(updated);
        } finally {
            setLoading(false);
            setLoadingMessage("");
        }
    };

    const getAvailableDocumentTypes = (currentIndex) =>
        documentTypes.filter(
            (type) => !documents.some((doc, index) => index !== currentIndex && doc.documentType === type)
        );

    const addDocument = () => {
        if (documents.length >= documentTypes.length) {
            alert("All document types have already been added.");
            return;
        }
        setDocuments((prev) => [
            ...prev,
            { documentType: "", documentName: "", documentUrl: "", file: null },
        ]);
    };

    const removeDocument = (index) => {
        setDocuments(documents.filter((_, i) => i !== index));
    };

    const validateDocuments = () => {
        if (documents.length === 0) return "Please upload at least one document.";

        for (const doc of documents) {
            if (!doc.documentType) return "Please select a document type.";
            if (!doc.file && !doc.documentUrl) return `Please upload "${doc.documentType}".`;
        }

        return null;
    };

    const uploadAllDocuments = () => {
        const formData = new FormData();
        documents.forEach((doc) => {
            if (doc.file) {
                formData.append("documents", doc.file);
                formData.append("documentTypes", doc.documentType);
            }
        });
        setLoadingMessage("Uploading documents...");
        return uploadDocuments(formData);
    };

    const handleSave = async () => {
        const validationError = validateDocuments();
        if (validationError) {
            alert(validationError);
            return;
        }

        try {
            setLoading(true);
            await uploadAllDocuments();
            alert("Documents uploaded successfully.");
        } catch (error) {
            alert(error.response?.data?.message || "Unable to upload documents.");
        } finally {
            setLoading(false);
            setLoadingMessage("");
        }
    };

    const handleContinue = async () => {
        const validationError = validateDocuments();
        if (validationError) {
            alert(validationError);
            return;
        }

        try {
            setLoading(true);
            await uploadAllDocuments();
            navigate("/student/application/review");
        } catch (error) {
            alert(error.response?.data?.message || "Unable to continue.");
        } finally {
            setLoading(false);
            setLoadingMessage("");
        }
    };

    return (
        <div className="min-h-screen bg-neutral-50 px-4 py-6 sm:px-6 lg:px-8">
            {/* Stepper */}
            <div className="mx-auto w-full max-w-6xl">
                <ApplicationStepper currentStep={6} />
            </div>

            {/* Main Card */}
            <div className="mx-auto mt-6 w-full max-w-3xl">
                <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">

                    {/* Header */}
                    <div className="border-b border-neutral-200 px-5 py-6 sm:px-8">
                        <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
                            Step 6 of 9
                        </p>
                        <h1 className="mt-2 text-2xl font-bold tracking-tight text-neutral-950">
                            Supporting Documents
                        </h1>
                        <p className="mt-2 text-sm leading-6 text-neutral-500">
                            Upload the required documents to support your application. Make sure each document is clear and readable.
                        </p>
                    </div>

                    {/* Content */}
                    <div className="p-5 sm:p-8">

                        {/* Upload Information */}
                        <div className="mb-8 grid gap-4 sm:grid-cols-2">
                            <div className="flex items-start gap-3 rounded-xl border border-neutral-200 bg-neutral-50 p-4">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white shadow-sm">
                                    <FiUploadCloud size={20} className="text-neutral-800" />
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-neutral-900">
                                        Accepted formats
                                    </p>
                                    <p className="mt-1 text-xs leading-5 text-neutral-500">
                                        PDF, JPG, JPEG and PNG files are supported.
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3 rounded-xl border border-neutral-200 bg-neutral-50 p-4">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white shadow-sm">
                                    <FiCheckCircle size={20} className="text-neutral-800" />
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-neutral-900">
                                        Clear documents
                                    </p>
                                    <p className="mt-1 text-xs leading-5 text-neutral-500">
                                        Ensure all uploaded documents are readable and complete.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Loading Message */}
                        {loadingMessage && (
                            <div className="mb-6 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3">
                                <div className="flex items-center gap-3">
                                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-blue-200 border-t-blue-600" />
                                    <p className="text-sm font-medium text-blue-800">
                                        {loadingMessage}
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Documents */}
                        <div>
                            <div className="mb-5 flex items-end justify-between gap-4">
                                <div>
                                    <h2 className="text-base font-semibold text-neutral-950">
                                        Your Documents
                                    </h2>
                                    <p className="mt-1 text-sm text-neutral-500">
                                        Add each supporting document and select its document type.
                                    </p>
                                </div>
                                <span className="shrink-0 rounded-full bg-neutral-100 px-3 py-1 text-xs font-medium text-neutral-600">
                                    {documents.length} {documents.length === 1 ? "document" : "documents"}
                                </span>
                            </div>

                            <div className="space-y-4">
                                {documents.map((document, index) => (
                                    <div key={index} className="rounded-xl border border-neutral-200 bg-neutral-50 p-5">
                                        {/* Document Header */}
                                        <div className="mb-5 flex items-center justify-between gap-4">
                                            <div className="flex items-center gap-3">
                                                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-black text-white">
                                                    <FiFileText size={17} />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-semibold text-neutral-900">
                                                        Document {index + 1}
                                                    </p>
                                                    <p className="text-xs text-neutral-500">
                                                        Supporting document
                                                    </p>
                                                </div>
                                            </div>
                                            {documents.length > 1 && (
                                                <button
                                                    type="button"
                                                    onClick={() => removeDocument(index)}
                                                    className="text-xs font-medium text-red-600 transition-colors hover:text-red-700 focus:outline-none focus:underline"
                                                >
                                                    Remove
                                                </button>
                                            )}
                                        </div>

                                        {/* Document Fields */}
                                        <div className="space-y-5">
                                            <Select
                                                label="Document Type"
                                                name={`documentType-${index}`}
                                                value={document.documentType}
                                                onChange={(e) => handleTypeChange(index, e.target.value)}
                                                options={getAvailableDocumentTypes(index)}
                                                required
                                            />
                                            <FileUpload
                                                label="Choose Document"
                                                name={`document-${index}`}
                                                accept=".pdf,.jpg,.jpeg,.png"
                                                onChange={(e) => handleFileChange(index, e.target.files[0])}
                                            />

                                            {document.documentName && (
                                                <div className="flex items-start gap-3 rounded-lg border border-green-200 bg-green-50 px-3 py-3">
                                                    <FiCheckCircle className="mt-0.5 shrink-0 text-green-600" size={17} />
                                                    <div className="min-w-0">
                                                        <p className="text-xs font-medium text-green-800">
                                                            File selected
                                                        </p>
                                                        <p className="mt-0.5 truncate text-xs text-green-700">
                                                            {document.documentName}
                                                        </p>
                                                    </div>
                                                </div>
                                            )}

                                            {document.documentUrl && (
                                                <div className="flex items-center gap-2 text-xs text-neutral-500">
                                                    <FiCheckCircle size={15} className="text-green-600" />
                                                    <span>Previously uploaded document</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Add Document */}
                        {documents.length < documentTypes.length && (
                            <div className="mt-5">
                                <Button
                                    text="+ Add Another Document"
                                    variant="secondary"
                                    onClick={addDocument}
                                />
                            </div>
                        )}

                        {/* Document Note */}
                        <div className="mt-6 rounded-xl border border-blue-200 bg-blue-50 p-4">
                            <p className="text-sm font-medium text-blue-900">
                                Before continuing
                            </p>
                            <p className="mt-1 text-sm leading-5 text-blue-700">
                                Check that every document has the correct document type and that all files are clear, readable and complete.
                            </p>
                        </div>

                        {/* Actions */}
                        <div className="mt-8 flex flex-col gap-4 border-t border-neutral-200 pt-6 sm:flex-row sm:items-center sm:justify-between">
                            <Button
                                text="← Back"
                                variant="secondary"
                                onClick={() => navigate("/student/application/programs")}
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
                Your documents are securely associated with your application and used for admission processing.
            </p>
        </div>
    );
};

export default DocumentUpload;