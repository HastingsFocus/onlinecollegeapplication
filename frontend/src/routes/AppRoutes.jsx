import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "../pages/Login";
import Register from "../pages/Register";
import ForgotPassword from "../pages/ForgotPassword";
import ResetPassword from "../pages/ResetPassword";
import ProtectedRoute from "../components/ProtectedRoute";

// ===========================================
// ADMIN PAGES
// ===========================================
import AdminDashboard from "../pages/admin/AdminDashboard";
import CreateLecturer from "../pages/admin/CreateLecturer";

// ===========================================
// LECTURER PAGES
// ===========================================
import LecturerDashboard from "../pages/lecturer/LecturerDashboard";
import ActivateAccount from "../pages/lecturer/ActivateAccount";
import CreateProgram from "../pages/lecturer/CreateProgram";
// import ManagePrograms from "../pages/lecturer/ManagePrograms";
import EditProgram from "../pages/lecturer/EditProgram";
import ManagePayments from "../pages/lecturer/payments/ManagePayments";

// Lecturer Admissions
import Intakes from "../pages/lecturer/admissions/Intakes";
import CreateIntake from "../pages/lecturer/admissions/CreateIntake";
import IntakeDetails from "../pages/lecturer/admissions/IntakeDetails";
import EditIntake from "../pages/lecturer/admissions/EditIntake";
import Applications from "../pages/lecturer/admissions/Applications";
import ApplicationDetails from "../pages/lecturer/admissions/ApplicationDetails";

// ===========================================
// STUDENT PAGES
// ===========================================
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

// Student Payments
import PaymentPage from "../pages/student/payment/PaymentPage";
import PaymentStatus from "../pages/student/payment/PaymentStatus";
import PaymentSuccess from "../pages/student/payment/PaymentSuccess";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* ===========================================
            PUBLIC ROUTES
        =========================================== */}
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/activate-account/:token" element={<ActivateAccount />} />

        {/* ===========================================
            ADMIN ROUTES
        =========================================== */}
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

        {/* ===========================================
            LECTURER ROUTES
        =========================================== */}
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
          path="/lecturer/programs/edit/:id"
          element={
            <ProtectedRoute allowedRoles={["lecturer"]}>
              <EditProgram />
            </ProtectedRoute>
          }
        />

        <Route
          path="/lecturer/payments"
          element={
            <ProtectedRoute allowedRoles={["lecturer"]}>
              <ManagePayments />
            </ProtectedRoute>
          }
        />

        {/* ===========================================
            LECTURER ADMISSIONS - INTAKES
        =========================================== */}
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

        {/* ===========================================
            LECTURER ADMISSIONS - APPLICATIONS
        =========================================== */}
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

        {/* ===========================================
            STUDENT ROUTES
        =========================================== */}
        <Route
          path="/student"
          element={
            <ProtectedRoute allowedRoles={["student"]}>
              <StudentLanding />
            </ProtectedRoute>
          }
        />

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

        {/* ===========================================
            STUDENT PAYMENTS
        =========================================== */}
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

        {/* ===========================================
            404
        =========================================== */}
        <Route path="*" element={<h1>404 - Page Not Found</h1>} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;