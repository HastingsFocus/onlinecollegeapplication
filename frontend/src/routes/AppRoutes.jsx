import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "../pages/Login";
import Register from "../pages/Register";
import ForgotPassword from "../pages/ForgotPassword";
import ResetPassword from "../pages/ResetPassword";
import ActivateAccount from "../pages/lecturer/ActivateAccount";
import ProtectedRoute from "../components/ProtectedRoute";

// ===============================
// ADMIN
// ===============================
import AdminDashboard from "../pages/admin/AdminDashboard";
import CreateLecturer from "../pages/admin/CreateLecturer";
import Users from "../pages/admin/Users";
import UserDetails from "../pages/admin/UserDetails";

// ===============================
// LECTURER
// ===============================
import LecturerDashboard from "../pages/lecturer/LecturerDashboard";
import CreateProgram from "../pages/lecturer/programs/CreateProgram";
import EditProgram from "../pages/lecturer/programs/EditProgram";
import ManagePrograms from "../pages/lecturer/programs/ManagePrograms";
import ManagePayments from "../pages/lecturer/payments/ManagePayments";

// ===============================
// LECTURER ADMISSIONS
// ===============================
import Intakes from "../pages/lecturer/admissions/Intakes";
import CreateIntake from "../pages/lecturer/admissions/CreateIntake";
import IntakeDetails from "../pages/lecturer/admissions/IntakeDetails";
import EditIntake from "../pages/lecturer/admissions/EditIntake";
import Applications from "../pages/lecturer/admissions/Applications";
import ApplicationDetails from "../pages/lecturer/admissions/ApplicationDetails";

// ===============================
// LECTURER STUDENT REGISTRY
// ===============================
import StudentRegistry from "../pages/lecturer/students/StudentRegistry";
import AcceptedStudents from "../pages/lecturer/students/AcceptedStudents";

// ===============================
// STUDENT
// ===============================
import StudentLanding from "../pages/student/StudentLanding";
import WelcomePage from "../pages/student/WelcomePage";
import PersonalInformation from "../pages/student/application/PersonalInformation";
import ContactInformation from "../pages/student/application/ContactInformation";
import NextOfKin from "../pages/student/application/NextOfKin";
import AcademicInformation from "../pages/student/application/AcademicInformation";
import ProgramSelection from "../pages/student/application/ProgramSelection";
import DocumentUpload from "../pages/student/application/DocumentUpload";
import ReviewApplication from "../pages/student/application/ReviewApplication";
import ApplicationStatus from "../pages/student/application/ApplicationStatus";
import SubmitApplication from "../pages/student/application/SubmitApplication";

// ===============================
// STUDENT PAYMENTS
// ===============================
import PaymentPage from "../pages/student/payment/PaymentPage";
import PaymentStatus from "../pages/student/payment/PaymentStatus";
import PaymentSuccess from "../pages/student/payment/PaymentSuccess";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* =========================================
            PUBLIC ROUTES
        ========================================= */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/activate-account/:token" element={<ActivateAccount />} />

        {/* =========================================
            ADMIN ROUTES
        ========================================= */}
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
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <Users />
            </ProtectedRoute>
          }
        />
        <Route
  path="/admin/users/:id"
  element={
    <ProtectedRoute allowedRoles={["admin"]}>
      <UserDetails />
    </ProtectedRoute>
  }
/>

        {/* =========================================
            LECTURER DASHBOARD
        ========================================= */}
        <Route
          path="/lecturer/dashboard"
          element={
            <ProtectedRoute allowedRoles={["lecturer"]}>
              <LecturerDashboard />
            </ProtectedRoute>
          }
        />

        {/* =========================================
            LECTURER PROGRAMS
        ========================================= */}
        
        <Route
          path="/lecturer/programs"
          element={
            <ProtectedRoute allowedRoles={["lecturer"]}>
              <ManagePrograms />
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
          path="/lecturer/programs/edit/:id"
          element={
            <ProtectedRoute allowedRoles={["lecturer"]}>
              <EditProgram />
            </ProtectedRoute>
          }
        />

        {/* =========================================
            LECTURER PAYMENTS
        ========================================= */}
        <Route
          path="/lecturer/payments"
          element={
            <ProtectedRoute allowedRoles={["lecturer"]}>
              <ManagePayments />
            </ProtectedRoute>
          }
        />

        {/* =========================================
            LECTURER ADMISSIONS - INTAKES
        ========================================= */}
        <Route
          path="/lecturer/admissions/intakes"
          element={
            <ProtectedRoute allowedRoles={["lecturer"]}>
              <Intakes />
            </ProtectedRoute>
          }
        />
        <Route
          path="/lecturer/admissions/intakes/create"
          element={
            <ProtectedRoute allowedRoles={["lecturer"]}>
              <CreateIntake />
            </ProtectedRoute>
          }
        />
        <Route
          path="/lecturer/admissions/intakes/:intakeId"
          element={
            <ProtectedRoute allowedRoles={["lecturer"]}>
              <IntakeDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/lecturer/admissions/intakes/:intakeId/edit"
          element={
            <ProtectedRoute allowedRoles={["lecturer"]}>
              <EditIntake />
            </ProtectedRoute>
          }
        />
        <Route
          path="/lecturer/admissions/intakes/:intakeId/applications"
          element={
            <ProtectedRoute allowedRoles={["lecturer"]}>
              <Applications />
            </ProtectedRoute>
          }
        />
        <Route
          path="/lecturer/admissions/applications/:id"
          element={
            <ProtectedRoute allowedRoles={["lecturer"]}>
              <ApplicationDetails />
            </ProtectedRoute>
          }
        />

        {/* =========================================
            LECTURER STUDENT REGISTRY
        ========================================= */}
        <Route
          path="/lecturer/students"
          element={
            <ProtectedRoute allowedRoles={["lecturer"]}>
              <StudentRegistry />
            </ProtectedRoute>
          }
        />
        <Route
          path="/lecturer/students/accepted"
          element={
            <ProtectedRoute allowedRoles={["lecturer"]}>
              <AcceptedStudents />
            </ProtectedRoute>
          }
        />

        {/* =========================================
            STUDENT LANDING
        ========================================= */}
        <Route
          path="/student"
          element={
            <ProtectedRoute allowedRoles={["student"]}>
              <StudentLanding />
            </ProtectedRoute>
          }
        />

        {/* =========================================
            STUDENT APPLICATION
        ========================================= */}
        <Route
          path="/student/application/welcome"
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
        <Route
          path="/student/application/submit"
          element={
            <ProtectedRoute allowedRoles={["student"]}>
              <SubmitApplication />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/application/status"
          element={
            <ProtectedRoute allowedRoles={["student"]}>
              <ApplicationStatus />
            </ProtectedRoute>
          }
        />

        {/* =========================================
            STUDENT PAYMENTS
        ========================================= */}
        <Route
          path="/student/payment/:applicationId"
          element={
            <ProtectedRoute allowedRoles={["student"]}>
              <PaymentPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/payment/status/:applicationId"
          element={
            <ProtectedRoute allowedRoles={["student"]}>
              <PaymentStatus />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/payment/success/:applicationId"
          element={
            <ProtectedRoute allowedRoles={["student"]}>
              <PaymentSuccess />
            </ProtectedRoute>
          }
        />

        {/* =========================================
            404
        ========================================= */}
        <Route
          path="*"
          element={
            <div style={{ padding: "40px", textAlign: "center" }}>
              <h1>404 - Page Not Found</h1>
            </div>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;