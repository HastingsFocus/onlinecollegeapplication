import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({
    children,
    allowedRoles = []
}) => {
    const { user, loading } = useAuth();
    if (loading) {
        return <h2>Loading...</h2>;
    }
    if (!user) {
        return <Navigate to="/login" replace />;
    }
    if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
        if (user.role === "admin") {
            return <Navigate to="/admin/dashboard" replace />;
        }
        if (user.role === "lecturer") {
            return <Navigate to="/lecturer/dashboard" replace />;
        }
        return <Navigate to="/student/dashboard" replace />;
    }
    return children;
};
export default ProtectedRoute;