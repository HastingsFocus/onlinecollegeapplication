import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ApplicationStepper from "../../../components/student/ApplicationStepper";
import Button from "../../../components/ui/Button";
import Select from "../../../components/ui/Select";
import FileUpload from "../../../components/ui/FileUpload";
import documentTypes from "../../../constants/documentTypes";
import compressImage from "../../../utils/compressImage";
import {
  getMyApplication,
  uploadDocuments
} from "../../../services/studentApplicationService";

const DocumentUpload = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");

  const [documents, setDocuments] = useState([
    {
      documentType: "",
      documentName: "",
      documentUrl: "",
      file: null
    }
  ]);

  useEffect(() => {
    loadApplication();
  }, []);

  const loadApplication = async () => {
    try {
      const application = await getMyApplication();

      if (application.documents?.length) {
        setDocuments(
          application.documents.map((doc) => ({
            documentType: doc.documentType,
            documentName: doc.fileName || "",
            documentUrl: doc.fileUrl || "",
            file: null
          }))
        );
      }
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

      let finalFile = file;

      if (file.type.startsWith("image/")) {
        finalFile = await compressImage(file);
      }

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

  const getAvailableDocumentTypes = (currentIndex) => {
    return documentTypes.filter((type) => {
      return !documents.some(
        (doc, index) =>
          index !== currentIndex &&
          doc.documentType === type
      );
    });
  };

  const addDocument = () => {
    if (documents.length >= documentTypes.length) {
      alert("All document types have already been added.");
      return;
    }

    setDocuments((prev) => [
      ...prev,
      {
        documentType: "",
        documentName: "",
        documentUrl: "",
        file: null
      }
    ]);
  };

  const removeDocument = (index) => {
    setDocuments(documents.filter((_, i) => i !== index));
  };

  const validateDocuments = () => {
    if (documents.length === 0) {
      return "Please upload at least one document.";
    }

    for (const doc of documents) {
      if (!doc.documentType) {
        return "Please select a document type.";
      }

      if (!doc.file && !doc.documentUrl) {
        return `Please upload "${doc.documentType}".`;
      }
    }

    return null;
  };

  const uploadAllDocuments = async () => {
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
      alert(
        error.response?.data?.message ||
          "Unable to upload documents."
      );
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
      alert(
        error.response?.data?.message ||
          "Unable to continue."
      );
    } finally {
      setLoading(false);
      setLoadingMessage("");
    }
  };

  return (
    <div>
      <ApplicationStepper currentStep={6} />

      <h2>Supporting Documents</h2>

      <p>
        Upload all the required supporting documents.
      </p>

      {loadingMessage && (
        <p
          style={{
            color: "#2563eb",
            fontWeight: "bold",
            marginBottom: "20px"
          }}
        >
          {loadingMessage}
        </p>
      )}

      {documents.map((document, index) => (
        <div
          key={index}
          style={{
            border: "1px solid #ddd",
            borderRadius: "8px",
            padding: "20px",
            marginBottom: "20px"
          }}
        >
          <Select
            label="Document Type"
            value={document.documentType}
            onChange={(e) =>
              handleTypeChange(index, e.target.value)
            }
            options={getAvailableDocumentTypes(index)}
            required
          />

          <FileUpload
            label="Choose Document"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={(e) =>
              handleFileChange(index, e.target.files[0])
            }
          />

          {document.documentName && (
            <p
              style={{
                color: "#16a34a",
                marginTop: "10px"
              }}
            >
              Selected File: {document.documentName}
            </p>
          )}

          {documents.length > 1 && (
            <div style={{ marginTop: "15px" }}>
              <Button
                text="Remove Document"
                onClick={() => removeDocument(index)}
              />
            </div>
          )}
        </div>
      ))}

      {documents.length < documentTypes.length && (
        <Button
          text="Add Another Document"
          onClick={addDocument}
        />
      )}

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: "30px"
        }}
      >
        <Button
          text="← Back"
          onClick={() =>
            navigate("/student/application/programs")
          }
        />

        <div
          style={{
            display: "flex",
            gap: "15px"
          }}
        >
          <Button
            text={loading ? loadingMessage || "Please wait..." : "Save"}
            loading={loading}
            onClick={handleSave}
          />

          <Button
            text={
              loading
                ? loadingMessage || "Please wait..."
                : "Save & Continue"
            }
            loading={loading}
            onClick={handleContinue}
          />
        </div>
      </div>
    </div>
  );
};

export default DocumentUpload;