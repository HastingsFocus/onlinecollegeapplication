import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/Login";
import Register from "../pages/Register";
import ForgotPassword from "../pages/ForgotPassword";
import ResetPassword from "../pages/ResetPassword";
import AdminDashboard from "../pages/admin/AdminDashboard";
import LecturerDashboard from "../pages/lecturer/LecturerDashboard";
import StudentDashboard from "../pages/student/StudentDashboard";
import ProtectedRoute from "../components/ProtectedRoute";
import CreateLecturer from "../pages/admin/CreateLecturer";
import ActivateAccount from "../pages/lecturer/ActivateAccount";
import CreateProgram from "../pages/lecturer/CreateProgram";
import ManagePrograms from "../pages/lecturer/ManagePrograms";
import EditProgram from "../pages/lecturer/EditProgram";

const AppRoutes = () => {
    return (
        <BrowserRouter>
            <Routes>
                {/* PUBLIC ROUTES */}
                <Route path="/" element={<Navigate to="/login" />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password/:token" element={<ResetPassword />} />
                <Route path="/activate-account/:token" element={<ActivateAccount />} />

                {/* ADMIN ROUTES */}
                <Route
                    path="/admin/dashboard"
                    element={
                        <ProtectedRoute allowedRoles={["admin"]}>
                            <AdminDashboard />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/admin/lecturers/create"
                    element={
                        <ProtectedRoute allowedRoles={["admin"]}>
                            <CreateLecturer />
                        </ProtectedRoute>
                    }
                />

                {/* LECTURER ROUTES */}
                <Route
                    path="/lecturer/dashboard"
                    element={
                        <ProtectedRoute allowedRoles={["lecturer"]}>
                            <LecturerDashboard />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/lecturer/programs/create"
                    element={
                        <ProtectedRoute allowedRoles={["lecturer"]}>
                            <CreateProgram />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/lecturer/programs"
                    element={
                        <ProtectedRoute allowedRoles={["lecturer"]}>
                            <ManagePrograms />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/lecturer/programs/edit/:id"
                    element={
                        <ProtectedRoute allowedRoles={["lecturer"]}>
                            <EditProgram />
                        </ProtectedRoute>
                    }
                />

                {/* STUDENT ROUTES */}
                <Route
                    path="/student/dashboard"
                    element={
                        <ProtectedRoute allowedRoles={["student"]}>
                            <StudentDashboard />
                        </ProtectedRoute>
                    }
                />

                {/* PAGE NOT FOUND */}
                <Route path="*" element={<h1>404 - Page Not Found</h1>} />
            </Routes>
        </BrowserRouter>
    );
};

export default AppRoutes;