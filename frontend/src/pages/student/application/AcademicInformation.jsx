import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ApplicationStepper from "../../../components/student/ApplicationStepper";
import Input from "../../../components/ui/Input";
import Button from "../../../components/ui/Button";
import Select from "../../../components/ui/Select";
import academicSubjects from "../../../constants/academicSubjects";
import grades from "../../../constants/grades";
import academicYears from "../../../constants/academicYears";
import {
  getMyApplication,
  updateAcademicInfo
} from "../../../services/studentApplicationService";

const AcademicInformation = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    schoolName: "",
    examinationNumber: "",
    yearCompleted: "",
    subjects: [{ subject: "", grade: "" }]
  });

  useEffect(() => {
    loadApplication();
  }, []);

  const loadApplication = async () => {
    try {
      const application = await getMyApplication();
      if (application.academicInfo) {
        setFormData({
          schoolName: application.academicInfo.schoolName || "",
          examinationNumber: application.academicInfo.examinationNumber || "",
          yearCompleted: application.academicInfo.yearCompleted
            ? application.academicInfo.yearCompleted.toString()
            : "",
          subjects: application.academicInfo.subjects?.length
            ? application.academicInfo.subjects
            : [{ subject: "", grade: "" }]
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

  const handleSubjectChange = (index, field, value) => {


  const updatedSubjects = [...formData.subjects];


  updatedSubjects[index][field] = value;


  setFormData(prev => ({
    ...prev,
    subjects: updatedSubjects
  }));

};

  const getAvailableSubjects = (currentIndex) => {

  // Get subjects selected in other rows
  const selectedSubjects = formData.subjects
    .filter((_, index) => index !== currentIndex)
    .map(item => item.subject)
    .filter(Boolean);


  // Remove already selected subjects
  return academicSubjects.filter(
    subject => !selectedSubjects.includes(subject)
  );

};

  const addSubject = () => {
    if (formData.subjects.length >= 10) {
      alert("Maximum of 10 subjects allowed.");
      return;
    }
    setFormData(prev => ({
      ...prev,
      subjects: [...prev.subjects, { subject: "", grade: "" }]
    }));
  };

  const removeSubject = (index) => {
    const updatedSubjects = formData.subjects.filter((_, i) => i !== index);
    setFormData(prev => ({
      ...prev,
      subjects: updatedSubjects
    }));
  };

  const validateAcademicInformation = () => {
    if (!formData.schoolName) {
      return "School name is required.";
    }
    if (!formData.examinationNumber) {
      return "Examination number is required.";
    }
    if (!formData.yearCompleted) {
      return "Please select year completed.";
    }
    if (formData.subjects.length < 6) {
      return "You must provide at least 6 MSCE subjects.";
    }
    const incompleteSubject = formData.subjects.some(
      subject => !subject.subject || !subject.grade
    );
    if (incompleteSubject) {
      return "Please select subject and grade for all entries.";
    }
    return null;
  };

  const saveAcademicInformation = async () => {
    const validationError = validateAcademicInformation();
    if (validationError) {
      throw new Error(validationError);
    }
    return await updateAcademicInfo(formData);
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
    <div>
      <ApplicationStepper currentStep={4} />
      <h2>Academic Information</h2>
      <p>Please provide your secondary school academic details.</p>

      <Input
        label="School Name"
        name="schoolName"
        value={formData.schoolName}
        onChange={handleChange}
        required
      />
      <Input
        label="Examination Number"
        name="examinationNumber"
        value={formData.examinationNumber}
        onChange={handleChange}
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

       <h3>
    MSCE Subjects and Grades
</h3>

<p>
    Add a minimum of 6 subjects. Make sure each subject has a corresponding grade before continuing.
</p>
      {formData.subjects.map((subject, index) => (
        <div
          key={index}
          style={{ display: "flex", gap: "10px", marginBottom: "15px", alignItems: "center" }}
        >
          <Select
    label="Subject"
    value={subject.subject}
    onChange={(e) => 
        handleSubjectChange(
            index,
            "subject",
            e.target.value
        )
    }
    options={getAvailableSubjects(index)}
/>
          <Select
            label="Grade"
            value={subject.grade}
            onChange={(e) => handleSubjectChange(index, "grade", e.target.value)}
            options={grades}
          />
          {formData.subjects.length > 1 && (
            <Button text="Remove" onClick={() => removeSubject(index)} />
          )}
        </div>
      ))}

      <Button text="Add Subject" onClick={addSubject} />

      <div style={{ display: "flex", justifyContent: "space-between", marginTop: "30px" }}>
        <Button text="← Back" onClick={() => navigate("/student/application/next-of-kin")} />
        <div style={{ display: "flex", gap: "15px" }}>
          <Button text="Save" loading={loading} onClick={handleSave} />
          <Button text="Save & Continue" loading={loading} onClick={handleContinue} />
        </div>
      </div>
    </div>
  );
};

export default AcademicInformation;