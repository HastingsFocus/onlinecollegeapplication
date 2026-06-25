import api from "../api/axios";

export const registerStudent = async (userData) => {
    const response = await api.post(
        "/auth/register",
        userData
    );

    return response.data;
};

export const loginUser = async (userData) => {
    const response = await api.post(
        "/auth/login",
        userData
    );

    return response.data;
};

export const forgotPassword = async (email) => {
    const response = await api.post("/auth/forgot-password", { email });
    return response.data;
};

export const resetPassword = async (token, password) => {
    const response = await api.post("/auth/reset-password", { token, password });
    return response.data;
};