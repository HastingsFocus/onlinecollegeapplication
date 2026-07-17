import api from "../api/axios";

export const createApplication = async () => {
  const response = await api.post("/student/application");
  return response.data;
};

export const getMyApplication = async () => {
  const response = await api.get("/student/application");
  return response.data;
};

export const updatePersonalInfo = async (personalInfo) => {
  const response = await api.put("/student/application/personal", personalInfo);
  return response.data;
};

export const updateContactInfo = async (contactInfo) => {
  const response = await api.put("/student/application/contact", contactInfo);
  return response.data;
};

export const updateNextOfKin = async (nextOfKin) => {
  const response = await api.put("/student/application/next-of-kin", nextOfKin);
  return response.data;
};

export const updateAcademicInfo = async (academicInfo) => {
  const response = await api.put("/student/application/academic", academicInfo);
  return response.data;
};

export const selectPrograms = async (programChoices) => {
  const response = await api.put("/student/application/programs", programChoices);
  return response.data;
};

export const uploadDocuments = async (documentData) => {
  const response = await api.put("/student/application/documents", documentData);
  return response.data;
};

export const submitApplication = async () => {
  const response = await api.put("/student/application/submit");
  return response.data;
};