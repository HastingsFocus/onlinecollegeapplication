import api from "../api/axios";

export const createLecturer = async (data) => {
    const response = await api.post("/users/lecturers", data);
    return response.data;
};

export const getLecturers = async () => {
    const response = await api.get("/users/lecturers");
    return response.data;
};

export const disableLecturer = async (id) => {
    const response = await api.patch(`/users/lecturers/${id}/disable`);
    return response.data;
};

export const enableLecturer = async (id) => {
    const response = await api.patch(`/users/lecturers/${id}/enable`);
    return response.data;
};

export const getUsers = async (params = {}) => {
    const response = await api.get("/users", {
        params
    });
 return response.data;
};

export const getUserById = async (userId) => {
    const response = await api.get(`/users/${userId}`);
    return response.data;
};