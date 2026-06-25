import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUser = sessionStorage.getItem("user");
        const storedToken = sessionStorage.getItem("token");
        if (storedUser && storedToken) {
            setUser(JSON.parse(storedUser));
            setToken(storedToken);
        }
        setLoading(false);
    }, []);

    const login = (userData, userToken) => {
        sessionStorage.setItem("user", JSON.stringify(userData));
        sessionStorage.setItem("token", userToken);
        setUser(userData);
        setToken(userToken);
    };

    const logout = () => {
        sessionStorage.removeItem("user");
        sessionStorage.removeItem("token");
        setUser(null);
        setToken(null);
    };

    const isAdmin = () => {
        return user?.role === "admin";
    };

    const isLecturer = () => {
        return user?.role === "lecturer";
    };

    const isStudent = () => {
        return user?.role === "student";
    };

    const value = {
        user,
        token,
        loading,
        login,
        logout,
        isAdmin,
        isLecturer,
        isStudent
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};