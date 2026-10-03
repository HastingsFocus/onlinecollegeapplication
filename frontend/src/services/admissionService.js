import api from "../api/axios";

// ===========================================
// Get all intakes
// ===========================================
export const getIntakes = async () => {
  const response = await api.get("/intakes");

  return response.data;
};

// ===========================================
// Get applications for a specific intake
// Supports pagination, search, filtering & sorting
// ===========================================
export const getApplicationsByIntake = async (
  intakeId,
  params = {}
) => {
  const response = await api.get(
    `/admissions/intakes/${intakeId}/applications`,
    {
      params,
    }
  );

  return response.data;
};

// ===========================================
// Get one application
// ===========================================
export const getApplicationDetails = async (applicationId) => {
  const response = await api.get(
    `/admissions/applications/${applicationId}`
  );

  return response.data;
};

// ===========================================
// Move application to Under Review
// ===========================================
export const reviewApplication = async (
  applicationId,
  remarks = ""
) => {
  const response = await api.patch(
    `/admissions/applications/${applicationId}/review`,
    {
      remarks,
    }
  );

  return response.data;
};

// ===========================================
// Accept application
// ===========================================
export const acceptApplication = async (
  applicationId,
  acceptedProgram,
  remarks = ""
) => {
  const response = await api.patch(
    `/admissions/applications/${applicationId}/accept`,
    {
      acceptedProgram,
      remarks,
    }
  );

  return response.data;
};

// ===========================================
// Reject application
// ===========================================
export const rejectApplication = async (
  applicationId,
  remarks = ""
) => {
  const response = await api.patch(
    `/admissions/applications/${applicationId}/reject`,
    {
      remarks,
    }
  );

  return response.data;
};

// ===========================================
// Dashboard Statistics
// ===========================================
export const getIntakeStatistics = async (intakeId) => {
  const response = await api.get(
    `/admissions/intakes/${intakeId}/statistics`
  );

  return response.data;
};

export const createIntake = async (intakeData) => {
  const response = await api.post("/intakes", intakeData);
  return response.data;
};

export const updateIntake = async (intakeId, intakeData) => {
  const response = await api.put(`/intakes/${intakeId}`, intakeData);
  return response.data;
};

export const publishIntake = async (intakeId) => {
  const response = await api.patch(`/intakes/${intakeId}/publish`);
  return response.data;
};

export const closeIntake = async (intakeId) => {
  const response = await api.patch(`/intakes/${intakeId}/close`);
  return response.data;
};

export const archiveIntake = async (intakeId) => {
  const response = await api.patch(`/intakes/${intakeId}/archive`);
  return response.data;
}; 

export const getIntakeById = async (intakeId) => { const response = await api.get(`/intakes/${intakeId}`); return response.data; };