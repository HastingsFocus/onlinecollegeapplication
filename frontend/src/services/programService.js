import api from "../api/axios";

// CREATE PROGRAM - Lecturer only
export const createProgram = async (programData) => {
    const response = await api.post("/programs", programData);
    return response.data;
};

// GET ALL PROGRAMS - Used by lecturer and students
export const getPrograms = async () => {
    const response = await api.get("/programs");
    return response.data;
};

// GET SINGLE PROGRAM
export const getProgramById = async (id) => {
    const response = await api.get(`/programs/${id}`);
    return response.data;
};

// UPDATE PROGRAM - Lecturer edits program
export const updateProgram = async (id, programData) => {
    const response = await api.put(`/programs/${id}`, programData);
    return response.data;
};

// DELETE PROGRAM - Lecturer removes program
export const deleteProgram = async (id) => {
    const response = await api.delete(`/programs/${id}`);
    return response.data;
};