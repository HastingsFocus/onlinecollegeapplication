import api from "../api/axios";

export const getAcceptedStudents = async () => {
  const response = await api.get("/students/accepted");
  return response.data;
};

export const registerStudent = async (applicationId) => {
  const response = await api.post(`/students/${applicationId}/register`);
  return response.data;
};

export const getRegisteredStudents = async () => {
  const response = await api.get("/students");
  return response.data;
};

export const getStudentById = async (studentId) => {
  const response = await api.get(`/students/${studentId}`);
  return response.data;
};

export const getRegistrationPreview = async () => {
  const response = await api.get("/students/registration-preview");
  return response.data;
};

export const generateRegistrationNumbers = async () => {
  const response = await api.post("/students/generate-registration-numbers");
  return response.data;
};

export const updateStudentStatus = async (studentId, status) => {
  const response = await api.patch(`/students/${studentId}/status`, { status });
  return response.data;
};

export const getStudentStatistics = async () => {
  const response = await api.get("/students/statistics");
  return response.data;
};

export const sendAdmissionEmails = async () => {
  const response = await api.post(
    "/students/send-admission-emails"
  );

  return response.data;
};