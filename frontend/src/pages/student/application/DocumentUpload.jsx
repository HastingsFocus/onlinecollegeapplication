import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import ApplicationStepper from "../../../components/student/ApplicationStepper";

import Button from "../../../components/ui/Button";
import Select from "../../../components/ui/Select";
import FileUpload from "../../../components/ui/FileUpload";

import documentTypes from "../../../constants/documentTypes";

import {
    getMyApplication,
    uploadDocuments
} from "../../../services/studentApplicationService";

const DocumentUpload = () => {

    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);

    const [documents, setDocuments] = useState([
        {
            documentType: "",
            documentName: "",
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

                    application.documents.map(doc => ({

                        documentType: doc.documentType,

                        documentName: doc.documentName,

                        documentUrl: doc.documentUrl,

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

    const handleFileChange = (index, file) => {

        const updated = [...documents];

        updated[index].file = file;

        updated[index].documentName = file.name;

        setDocuments(updated);

    };

    const addDocument = () => {

        setDocuments([

            ...documents,

            {

                documentType: "",

                documentName: "",

                file: null

            }

        ]);

    };

    const removeDocument = (index) => {

        const updated = [...documents];

        updated.splice(index, 1);

        setDocuments(updated);

    };

    const handleSave = async () => {

        try {

            setLoading(true);

            const formData = new FormData();

            documents.forEach((doc) => {

                formData.append("documents", doc.file);

                formData.append("documentTypes", doc.documentType);

            });

            await uploadDocuments(formData);

            alert("Documents saved successfully.");

        } catch (error) {

            alert(

                error.response?.data?.message ||
                "Unable to upload documents."

            );

        } finally {

            setLoading(false);

        }

    };

    const handleContinue = async () => {

        await handleSave();

        navigate("/student/application/review");

    };

    return (

        <div>

            <ApplicationStepper currentStep={6} />

            <h2>Supporting Documents</h2>

            <p>

                Upload all the required supporting documents for your application.

            </p>

            {

                documents.map((document, index) => (

                    <div
                        key={index}
                        style={{
                            border:"1px solid #ddd",
                            padding:"15px",
                            marginBottom:"20px"
                        }}
                    >

                        <Select

                            label="Document Type"

                            value={document.documentType}

                            onChange={(e)=>

                                handleTypeChange(

                                    index,

                                    e.target.value

                                )

                            }

                            options={documentTypes}

                        />

                        <FileUpload

                            label="Choose Document"

                            onChange={(e)=>

                                handleFileChange(

                                    index,

                                    e.target.files[0]

                                )

                            }

                            accept=".pdf,.jpg,.jpeg,.png"

                        />

                        <Button

                            text="Remove"

                            onClick={()=>

                                removeDocument(index)

                            }

                        />

                    </div>

                ))

            }

            <Button

                text="Add Another Document"

                onClick={addDocument}

            />

            <br />

            <br />

            <div
                style={{
                    display:"flex",
                    justifyContent:"space-between"
                }}
            >

                <Button

                    text="Save"

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

    );

};

export default DocumentUpload;