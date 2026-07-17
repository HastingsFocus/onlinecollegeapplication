import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ApplicationStepper from "../../../components/student/ApplicationStepper";
import Input from "../../../components/ui/Input";
import Select from "../../../components/ui/Select";
import Button from "../../../components/ui/Button";
import {
  getMyApplication,
  updateContactInfo
} from "../../../services/studentApplicationService";
import malawiDistricts from "../../../constants/malawiDistricts";

const ContactInformation = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    phone: "",
    alternativePhone: "",
    address: "",
    district: "",
    country: "Malawi"
  });

  useEffect(() => {
    loadApplication();
  }, []);

  const loadApplication = async () => {
    try {
      const application = await getMyApplication();
      if (application.contactInfo) {
        setFormData({
          email: application.contactInfo.email || "",
          phone: application.contactInfo.phone || "",
          alternativePhone: application.contactInfo.alternativePhone || "",
          address: application.contactInfo.address || "",
          district: application.contactInfo.district || "",
          country: application.contactInfo.country || "Malawi"
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

  const saveContactInformation = async () => {
    return await updateContactInfo(formData);
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      await saveContactInformation();
      alert("Contact information saved successfully.");
    } catch (error) {
      alert(error.response?.data?.message || "Unable to save contact information.");
    } finally {
      setLoading(false);
    }
  };

  const handleContinue = async () => {
    try {
      setLoading(true);
      await saveContactInformation();
      navigate("/student/application/next-of-kin");
    } catch (error) {
      alert(error.response?.data?.message || "Unable to continue.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <ApplicationStepper currentStep={2} />
      <h2>Contact Information</h2>
      <p>Please provide your current contact information.</p>

      <Input
        label="Email Address"
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        required
      />
      <Input
        label="Phone Number"
        name="phone"
        value={formData.phone}
        onChange={handleChange}
        required
      />
      <Input
        label="Alternative Phone Number"
        name="alternativePhone"
        value={formData.alternativePhone}
        onChange={handleChange}
      />
      <Input
        label="Residential Address"
        name="address"
        value={formData.address}
        onChange={handleChange}
        required
      />
      <Select
        label="District"
        name="district"
        value={formData.district}
        onChange={handleChange}
        options={malawiDistricts}
        required
      />
      <Select
        label="Country"
        name="country"
        value={formData.country}
        onChange={handleChange}
        options={["Malawi"]}
        required
      />

      <div style={{ display: "flex", justifyContent: "space-between", marginTop: "30px" }}>
        <Button text="← Back" onClick={() => navigate("/student/application/personal")} />
        <div style={{ display: "flex", gap: "15px" }}>
          <Button text="Save" loading={loading} onClick={handleSave} />
          <Button text="Save & Continue" loading={loading} onClick={handleContinue} />
        </div>
      </div>
    </div>
  );
};

export default ContactInformation;