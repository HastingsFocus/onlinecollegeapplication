import { useState } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import {
  FaHome,
  FaBell,
  FaSignOutAlt,
  FaChalkboardTeacher,
  FaBook,
  FaFileAlt,
  FaUserGraduate,
  FaChevronDown,
  FaChevronRight,
} from "react-icons/fa";
import { useAuth } from "../context/AuthContext";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  // =========================================
  // SECTION STATES
  // =========================================
  const [programsOpen, setProgramsOpen] = useState(
    location.pathname.startsWith("/lecturer/programs")
  );
  const [studentsOpen, setStudentsOpen] = useState(
    location.pathname.startsWith("/lecturer/students")
  );

  // =========================================
  // HANDLERS
  // =========================================
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleProgramsToggle = () => setProgramsOpen((prev) => !prev);
  const handleStudentsToggle = () => setStudentsOpen((prev) => !prev);

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
      {/* =========================================
          LOGO
      ========================================= */}
      <div style={{ padding: "20px", borderBottom: "1px solid #333" }}>
        <h2 style={{ margin: 0, textAlign: "center" }}>OCAS</h2>
      </div>

      {/* =========================================
          NAVIGATION
      ========================================= */}
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
        <NavLink
          to={`/${user.role}/dashboard`}
          style={({ isActive }) => ({
            ...linkStyle,
            background: isActive ? "#333" : "transparent",
          })}
        >
          <FaHome />
          <span>Dashboard</span>
        </NavLink>

        {/* =========================================
            ADMIN LINKS
        ========================================= */}
        {user.role === "admin" && (
          <>
            <NavLink
              to="/admin/lecturers/create"
              style={({ isActive }) => ({
                ...linkStyle,
                background: isActive ? "#333" : "transparent",
              })}
            >
              <FaChalkboardTeacher />
              <span>Create Lecturer</span>
            </NavLink>

            <NavLink
              to="/admin/lecturers"
              style={({ isActive }) => ({
                ...linkStyle,
                background: isActive ? "#333" : "transparent",
              })}
            >
              <FaChalkboardTeacher />
              <span>Manage Lecturers</span>
            </NavLink>
          </>
        )}

        {/* =========================================
            LECTURER LINKS
        ========================================= */}
        {user.role === "lecturer" && (
          <>
            {/* =====================================
                PROGRAMS SECTION
            ===================================== */}
            <div>
              <button
                type="button"
                onClick={handleProgramsToggle}
                style={{
                  ...linkStyle,
                  width: "100%",
                  border: "none",
                  background: programsOpen ? "#333" : "transparent",
                  color: "white",
                  cursor: "pointer",
                  textAlign: "left",
                }}
              >
                <FaBook />
                <span style={{ flex: 1 }}>Programs</span>
                {programsOpen ? (
                  <FaChevronDown size={12} />
                ) : (
                  <FaChevronRight size={12} />
                )}
              </button>

              {/* PROGRAM SUB-MENU */}
              {programsOpen && (
                <div
                  style={{
                    marginLeft: "20px",
                    marginTop: "5px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "5px",
                  }}
                >
                  <NavLink
                    to="/lecturer/programs"
                    end
                    style={({ isActive }) => ({
                      ...subLinkStyle,
                      background: isActive ? "#444" : "transparent",
                      color: isActive ? "#fff" : "#ccc",
                    })}
                  >
                    <span>Manage Programs</span>
                  </NavLink>

                  <NavLink
                    to="/lecturer/programs/create"
                    style={({ isActive }) => ({
                      ...subLinkStyle,
                      background: isActive ? "#444" : "transparent",
                      color: isActive ? "#fff" : "#ccc",
                    })}
                  >
                    <span>＋ Create Program</span>
                  </NavLink>
                </div>
              )}
            </div>

            {/* ADMISSIONS */}
            <NavLink
              to="/lecturer/admissions/intakes"
              style={({ isActive }) => ({
                ...linkStyle,
                background: isActive ? "#333" : "transparent",
              })}
            >
              <FaFileAlt />
              <span>Admissions</span>
            </NavLink>

            {/* =====================================
                STUDENTS SECTION
            ===================================== */}
            <div>
              <button
                type="button"
                onClick={handleStudentsToggle}
                style={{
                  ...linkStyle,
                  width: "100%",
                  border: "none",
                  background: studentsOpen ? "#333" : "transparent",
                  color: "white",
                  cursor: "pointer",
                  textAlign: "left",
                }}
              >
                <FaUserGraduate />
                <span style={{ flex: 1 }}>Students</span>
                {studentsOpen ? (
                  <FaChevronDown size={12} />
                ) : (
                  <FaChevronRight size={12} />
                )}
              </button>

              {/* STUDENT SUB-MENU */}
              {studentsOpen && (
                <div
                  style={{
                    marginLeft: "20px",
                    marginTop: "5px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "5px",
                  }}
                >
                  <NavLink
                    to="/lecturer/students"
                    end
                    style={({ isActive }) => ({
                      ...subLinkStyle,
                      background: isActive ? "#444" : "transparent",
                      color: isActive ? "#fff" : "#ccc",
                    })}
                  >
                    <span>Student Registry</span>
                  </NavLink>

                  <NavLink
                    to="/lecturer/students/accepted"
                    style={({ isActive }) => ({
                      ...subLinkStyle,
                      background: isActive ? "#444" : "transparent",
                      color: isActive ? "#fff" : "#ccc",
                    })}
                  >
                    <span>Accepted Students</span>
                  </NavLink>
                </div>
              )}
            </div>
          </>
        )}

        {/* NOTIFICATIONS */}
        <NavLink
          to="/notifications"
          style={({ isActive }) => ({
            ...linkStyle,
            background: isActive ? "#333" : "transparent",
          })}
        >
          <FaBell />
          <span>Notifications</span>
        </NavLink>
      </div>

      {/* =========================================
          LOGOUT
      ========================================= */}
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
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

/* =========================================
   MAIN LINK STYLE
========================================= */
const linkStyle = {
  color: "white",
  textDecoration: "none",
  display: "flex",
  alignItems: "center",
  gap: "12px",
  padding: "12px",
  borderRadius: "8px",
};

/* =========================================
   SUB LINK STYLE
========================================= */
const subLinkStyle = {
  color: "#ccc",
  textDecoration: "none",
  display: "flex",
  alignItems: "center",
  padding: "9px 12px",
  borderRadius: "6px",
  fontSize: "14px",
};

export default Sidebar;