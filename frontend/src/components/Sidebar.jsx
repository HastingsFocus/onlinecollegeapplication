import { NavLink, useNavigate } from "react-router-dom";
import {
  FaHome,
  FaBell,
  FaSignOutAlt,
  FaChalkboardTeacher,
  FaBook,
  FaEdit,
  FaFileAlt,
} from "react-icons/fa";
import { useAuth } from "../context/AuthContext";

const Sidebar = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div
      style={{
        width: "250px",
        minHeight: "100vh",
        background: "#222",
        color: "white",
        display: "flex",
        flexDirection: "column",
        boxSizing: "border-box",
        overflowY: "auto",
      }}
    >
      {/* LOGO */}
      <div style={{ padding: "20px", borderBottom: "1px solid #333" }}>
        <h2 style={{ margin: 0, textAlign: "center" }}>OCAS</h2>
      </div>

      {/* NAVIGATION */}
      <div
        style={{
          flex: 1,
          padding: "20px 15px",
          display: "flex",
          flexDirection: "column",
          gap: "10px",
        }}
      >
        {/* DASHBOARD */}
        <NavLink to={`/${user.role}/dashboard`} style={linkStyle}>
          <FaHome />
          Dashboard
        </NavLink>

        {/* ADMIN LINKS */}
        {user.role === "admin" && (
          <>
            <NavLink to="/admin/lecturers/create" style={linkStyle}>
              <FaChalkboardTeacher />
              Create Lecturer
            </NavLink>

            <NavLink to="/admin/lecturers" style={linkStyle}>
              <FaChalkboardTeacher />
              Manage Lecturers
            </NavLink>
          </>
        )}

        {/* LECTURER LINKS */}
        {user.role === "lecturer" && (
          <>
            <NavLink to="/lecturer/programs/create" style={linkStyle}>
              <FaBook />
              Create Program
            </NavLink>

            <NavLink to="/lecturer/programs" style={linkStyle}>
              <FaEdit />
              Manage Programs
            </NavLink>

            <NavLink to="/lecturer/admissions/intakes" style={linkStyle}>
              <FaFileAlt />
              Admissions
            </NavLink>

            <NavLink to="/lecturer/applications" style={linkStyle}>
              <FaFileAlt />
              View Applications
            </NavLink>
          </>
        )}

        {/* NOTIFICATIONS */}
        <NavLink to="/notifications" style={linkStyle}>
          <FaBell />
          Notifications
        </NavLink>
      </div>

      {/* LOGOUT */}
      <div style={{ padding: "15px", borderTop: "1px solid #333" }}>
        <button
          onClick={handleLogout}
          style={{
            width: "100%",
            padding: "12px",
            display: "flex",
            alignItems: "center",
            gap: "12px",
            border: "none",
            borderRadius: "8px",
            background: "#444",
            color: "white",
            cursor: "pointer",
          }}
        >
          <FaSignOutAlt />
          Logout
        </button>
      </div>
    </div>
  );
};

const linkStyle = {
  color: "white",
  textDecoration: "none",
  display: "flex",
  alignItems: "center",
  gap: "12px",
  padding: "12px",
  borderRadius: "8px",
};

export default Sidebar;