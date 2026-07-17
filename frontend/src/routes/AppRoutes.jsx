import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "../pages/Login";
import Register from "../pages/Register";
import ForgotPassword from "../pages/ForgotPassword";
import ResetPassword from "../pages/ResetPassword";

import ProtectedRoute from "../components/ProtectedRoute";

/* ==========================
   ADMIN
========================== */
import AdminDashboard from "../pages/admin/AdminDashboard";
import CreateLecturer from "../pages/admin/CreateLecturer";

/* ==========================
   LECTURER
========================== */
import LecturerDashboard from "../pages/lecturer/LecturerDashboard";
import ActivateAccount from "../pages/lecturer/ActivateAccount";
import CreateProgram from "../pages/lecturer/CreateProgram";
import ManagePrograms from "../pages/lecturer/ManagePrograms";
import EditProgram from "../pages/lecturer/EditProgram";

/* ==========================
   STUDENT
========================== */
import WelcomePage from "../pages/student/WelcomePage";

import PersonalInformation from "../pages/student/application/PersonalInformation";
import ContactInformation from "../pages/student/application/ContactInformation";
import NextOfKin from "../pages/student/application/NextOfKin";
import AcademicInformation from "../pages/student/application/AcademicInformation";
import ProgramSelection from "../pages/student/application/ProgramSelection";
import DocumentUpload from "../pages/student/application/DocumentUpload";
import ReviewApplication from "../pages/student/application/ReviewApplication";

const AppRoutes = () => {
    return (
        <BrowserRouter>
            <Routes>

                {/* ==========================
                    PUBLIC ROUTES
                ========================== */}

                <Route path="/" element={<Navigate to="/login" />} />

                <Route path="/login" element={<Login />} />

                <Route path="/register" element={<Register />} />

                <Route
                    path="/forgot-password"
                    element={<ForgotPassword />}
                />

                <Route
                    path="/reset-password/:token"
                    element={<ResetPassword />}
                />

                <Route
                    path="/activate-account/:token"
                    element={<ActivateAccount />}
                />

                {/* ==========================
                    ADMIN ROUTES
                ========================== */}

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

                {/* ==========================
                    LECTURER ROUTES
                ========================== */}

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

                {/* ==========================
                    STUDENT ROUTES
                ========================== */}

                <Route
                    path="/student/welcome"
                    element={
                        <ProtectedRoute allowedRoles={["student"]}>
                            <WelcomePage />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/student/application/personal"
                    element={
                        <ProtectedRoute allowedRoles={["student"]}>
                            <PersonalInformation />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/student/application/contact"
                    element={
                        <ProtectedRoute allowedRoles={["student"]}>
                            <ContactInformation />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/student/application/next-of-kin"
                    element={
                        <ProtectedRoute allowedRoles={["student"]}>
                            <NextOfKin />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/student/application/academic"
                    element={
                        <ProtectedRoute allowedRoles={["student"]}>
                            <AcademicInformation />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/student/application/programs"
                    element={
                        <ProtectedRoute allowedRoles={["student"]}>
                            <ProgramSelection />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/student/application/documents"
                    element={
                        <ProtectedRoute allowedRoles={["student"]}>
                            <DocumentUpload />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/student/application/review"
                    element={
                        <ProtectedRoute allowedRoles={["student"]}>
                            <ReviewApplication />
                        </ProtectedRoute>
                    }
                />

               


                {/* ==========================
                    PAGE NOT FOUND
                ========================== */}

                <Route
                    path="*"
                    element={<h1>404 - Page Not Found</h1>}
                />

            </Routes>
        </BrowserRouter>
    );
};

export default AppRoutes;