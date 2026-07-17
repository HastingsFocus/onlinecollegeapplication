import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ApplicationStepper from "../../../components/student/ApplicationStepper";
import Select from "../../../components/ui/Select";
import Button from "../../../components/ui/Button";
import { getPrograms } from "../../../services/programService";
import {
  getMyApplication,
  selectPrograms
} from "../../../services/studentApplicationService";

const ProgramSelection = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [programs, setPrograms] = useState([]);
  const [formData, setFormData] = useState({
    firstChoice: "",
    secondChoice: "",
    thirdChoice: ""
  });

  useEffect(() => {
    loadPrograms();
    loadApplication();
  }, []);

  const loadPrograms = async()=>{

    try{

        const response = await getPrograms();

        console.log("PROGRAMS FROM API:", response);

        setPrograms(response);

    }catch(error){

        console.log(error);

    }

};

  const loadApplication = async () => {
    try {
      const application = await getMyApplication();
      if (application.programChoice) {
        setFormData({
          firstChoice: application.programChoice.firstChoice?._id || "",
          secondChoice: application.programChoice.secondChoice?._id || "",
          thirdChoice: application.programChoice.thirdChoice?._id || ""
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const getAvailablePrograms = (field) => {
    return programs.filter(program => {
      const selectedPrograms = [
        formData.firstChoice,
        formData.secondChoice,
        formData.thirdChoice
      ];
      return !selectedPrograms.includes(program._id) || formData[field] === program._id;
    });
  };

  const formatPrograms = (field) => {

    return getAvailablePrograms(field)
    .map(program => ({

        value: program._id,

        label: program.name

    }));

};
  const validateChoices = () => {
    const choices = [
      formData.firstChoice,
      formData.secondChoice,
      formData.thirdChoice
    ].filter(Boolean);

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
      if (saved) {
        navigate("/student/application/documents");
      }
    } catch (error) {
      alert(error.response?.data?.message || "Unable to continue.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <ApplicationStepper currentStep={5} />
      <h2>Programme Selection</h2>
      <p>Choose your programmes according to preference.</p>

      <Select
        label="First Choice"
        name="firstChoice"
        value={formData.firstChoice}
        onChange={handleChange}
        options={formatPrograms("firstChoice")}
        required
      />
      <Select
        label="Second Choice"
        name="secondChoice"
        value={formData.secondChoice}
        onChange={handleChange}
        options={formatPrograms("secondChoice")}
      />
      <Select
        label="Third Choice"
        name="thirdChoice"
        value={formData.thirdChoice}
        onChange={handleChange}
        options={formatPrograms("thirdChoice")}
      />

      <div style={{ display: "flex", justifyContent: "space-between", marginTop: "30px" }}>
        <Button text="← Back" onClick={() => navigate("/student/application/academic")} />
        <div style={{ display: "flex", gap: "15px" }}>
          <Button text="Save" loading={loading} onClick={handleSave} />
          <Button text="Save & Continue" loading={loading} onClick={handleContinue} />
        </div>
      </div>
    </div>
  );
};

export default ProgramSelection;