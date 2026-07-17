import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import ApplicationStepper from "../../../components/student/ApplicationStepper";
import Button from "../../../components/ui/Button";

import {
    getMyApplication,
    submitApplication
} from "../../../services/studentApplicationService";

const ReviewApplication = () => {

    const navigate = useNavigate();

    const [application, setApplication] = useState(null);

    const [loading, setLoading] = useState(false);

    const [confirmed, setConfirmed] = useState(false);

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

    const handleSubmit = async () => {

        if (!confirmed) {

            return alert(
                "Please confirm that the information is correct."
            );

        }

        try {

            setLoading(true);

            await submitApplication();

            alert(
                "Application submitted successfully."
            );

            navigate(
                "/student/application/status"
            );

        } catch (error) {

            alert(

                error.response?.data?.message ||

                "Submission failed."

            );

        } finally {

            setLoading(false);

        }

    };

    if (!application) {

        return <p>Loading...</p>;

    }

    return (

        <div>

            <ApplicationStepper currentStep={7} />

            <h2>Review Your Application</h2>

            <p>

                Please review all your information before submitting your application.

            </p>

            {/* PERSONAL */}

            <hr />

            <h3>Personal Information</h3>

            <p><strong>Name:</strong> {application.personalInfo.firstName} {application.personalInfo.middleName} {application.personalInfo.lastName}</p>

            <p><strong>Gender:</strong> {application.personalInfo.gender}</p>

            <p><strong>Date of Birth:</strong> {application.personalInfo.dateOfBirth?.substring(0,10)}</p>

            <p><strong>Nationality:</strong> {application.personalInfo.nationality}</p>

            <p><strong>National ID:</strong> {application.personalInfo.nationalId}</p>

            {/* CONTACT */}

            <hr />

            <h3>Contact Information</h3>

            <p><strong>Email:</strong> {application.contactInfo.email}</p>

            <p><strong>Phone:</strong> {application.contactInfo.phone}</p>

            <p><strong>Alternative Phone:</strong> {application.contactInfo.alternativePhone}</p>

            <p><strong>Address:</strong> {application.contactInfo.address}</p>

            <p><strong>District:</strong> {application.contactInfo.district}</p>

            {/* NEXT OF KIN */}

            <hr />

            <h3>Next of Kin</h3>

            <p><strong>Name:</strong> {application.nextOfKin.fullName}</p>

            <p><strong>Relationship:</strong> {application.nextOfKin.relationship}</p>

            <p><strong>Phone:</strong> {application.nextOfKin.phone}</p>

            <p><strong>Email:</strong> {application.nextOfKin.email}</p>

            {/* ACADEMICS */}

            <hr />

            <h3>Academic Information</h3>

            <p><strong>School:</strong> {application.academicInfo.schoolName}</p>

            <p><strong>Examination Number:</strong> {application.academicInfo.examinationNumber}</p>

            <p><strong>Year Completed:</strong> {application.academicInfo.yearCompleted}</p>

            <h4>Subjects</h4>

            <table border="1" cellPadding="8">

                <thead>

                    <tr>

                        <th>Subject</th>

                        <th>Grade</th>

                    </tr>

                </thead>

                <tbody>

                    {application.academicInfo.subjects?.map((subject,index)=>(

                        <tr key={index}>

                            <td>{subject.subject}</td>

                            <td>{subject.grade}</td>

                        </tr>

                    ))}

                </tbody>

            </table>

            {/* PROGRAMMES */}

            <hr />

            <h3>Programme Choices</h3>

            <p>

                <strong>1st Choice:</strong>

                {" "}

                {application.programChoice.firstChoice?.programName}

            </p>

            <p>

                <strong>2nd Choice:</strong>

                {" "}

                {application.programChoice.secondChoice?.programName}

            </p>

            <p>

                <strong>3rd Choice:</strong>

                {" "}

                {application.programChoice.thirdChoice?.programName}

            </p>

            {/* DOCUMENTS */}

            <hr />

            <h3>Uploaded Documents</h3>

            {

                application.documents.map((doc,index)=>(

                    <p key={index}>

                        ✅ {doc.documentType}

                    </p>

                ))

            }

            <hr />

            <label>

                <input

                    type="checkbox"

                    checked={confirmed}

                    onChange={(e)=>

                        setConfirmed(e.target.checked)

                    }

                />

                {" "}

                I confirm that all information provided is true and correct.

            </label>

            <br />

            <br />

            <Button

                text="Submit Application"

                loading={loading}

                onClick={handleSubmit}

            />

        </div>

    );

};

export default ReviewApplication;