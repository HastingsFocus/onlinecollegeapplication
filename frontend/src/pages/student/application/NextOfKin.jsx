import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ApplicationStepper from "../../../components/student/ApplicationStepper";
import Input from "../../../components/ui/Input";
import Select from "../../../components/ui/Select";
import Button from "../../../components/ui/Button";
import {
  getMyApplication,
  updateNextOfKin
} from "../../../services/studentApplicationService";
import relationships from "../../../constants/relationships";

const NextOfKin = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    relationship: "",
    phone: "",
    email: ""
  });

  useEffect(() => {
    loadApplication();
  }, []);

  const loadApplication = async () => {
    try {
      const application = await getMyApplication();
      if (application.nextOfKin) {
        setFormData({
          fullName: application.nextOfKin.fullName || "",
          relationship: application.nextOfKin.relationship || "",
          phone: application.nextOfKin.phone || "",
          email: application.nextOfKin.email || ""
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

  const saveNextOfKin = async () => {
    return await updateNextOfKin(formData);
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      await saveNextOfKin();
      alert("Next of Kin information saved successfully.");
    } catch (error) {
      alert(error.response?.data?.message || "Unable to save information.");
    } finally {
      setLoading(false);
    }
  };

  const handleContinue = async () => {
    try {
      setLoading(true);
      await saveNextOfKin();
      navigate("/student/application/academic");
    } catch (error) {
      alert(error.response?.data?.message || "Unable to continue.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <ApplicationStepper currentStep={3} />
      <h2>Next of Kin Information</h2>
      <p>Please provide the details of your next of kin or emergency contact.</p>

      <Input
        label="Full Name"
        name="fullName"
        value={formData.fullName}
        onChange={handleChange}
        required
      />
      <Select
        label="Relationship"
        name="relationship"
        value={formData.relationship}
        onChange={handleChange}
        options={relationships}
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
        label="Email Address"
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
      />

      <div style={{ display: "flex", justifyContent: "space-between", marginTop: "30px" }}>
        <Button text="← Back" onClick={() => navigate("/student/application/contact")} />
        <div style={{ display: "flex", gap: "15px" }}>
          <Button text="Save" loading={loading} onClick={handleSave} />
          <Button text="Save & Continue" loading={loading} onClick={handleContinue} />
        </div>
      </div>
    </div>
  );
};

export default NextOfKin;