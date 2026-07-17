import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ApplicationStepper from "../../../components/student/ApplicationStepper";
import Input from "../../../components/ui/Input";
import Select from "../../../components/ui/Select";
import DateInput from "../../../components/ui/DateInput";
import Button from "../../../components/ui/Button";
import {
  getMyApplication,
  updatePersonalInfo
} from "../../../services/studentApplicationService";

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
    nationalId: ""
  });

  useEffect(() => {
    loadApplication();
  }, []);

  const loadApplication = async () => {
    try {
      const application = await getMyApplication();
      if (application.personalInfo) {
        setFormData({
          firstName: application.personalInfo.firstName || "",
          middleName: application.personalInfo.middleName || "",
          lastName: application.personalInfo.lastName || "",
          gender: application.personalInfo.gender || "",
          dateOfBirth: application.personalInfo.dateOfBirth
            ? application.personalInfo.dateOfBirth.substring(0, 10)
            : "",
          nationality: application.personalInfo.nationality || "Malawian",
          nationalId: application.personalInfo.nationalId || ""
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const savePersonalInformation = async () => {
    const response = await updatePersonalInfo(formData);
    return response;
  };

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
    <div>
      <ApplicationStepper currentStep={1} />
      <h2>Personal Information</h2>
      <p>
        Please provide your personal details exactly as they
        appear on your National ID or Passport.
      </p>

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
      <Input
        label="National ID / Passport Number"
        name="nationalId"
        value={formData.nationalId}
        onChange={handleChange}
      />

      <div style={{ display: "flex", gap: "15px", marginTop: "30px" }}>
        <Button text="Save" loading={loading} onClick={handleSave} />
        <Button text="Save & Continue" loading={loading} onClick={handleContinue} />
      </div>
    </div>
  );
};

export default PersonalInformation;