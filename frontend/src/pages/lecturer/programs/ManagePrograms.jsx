import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../../layouts/DashboardLayout";
import { getPrograms, deleteProgram } from "../../../services/programService";

const ManagePrograms = () => {
  const navigate = useNavigate();

  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =========================================
  // LOAD PROGRAMS
  // =========================================
  const loadPrograms = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getPrograms();
      setPrograms(data);
    } catch (err) {
      console.error("Failed to load programs:", err);
      setError(
        err.response?.data?.message ||
          "Failed to load programs. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================================
  // INITIAL LOAD
  // =========================================
  useEffect(() => {
    loadPrograms();
  }, []);

  // =========================================
  // EDIT PROGRAM
  // =========================================
  const handleEdit = (programId) => {
    navigate(`/lecturer/programs/edit/${programId}`);
  };

  // =========================================
  // DELETE PROGRAM
  // =========================================
  const handleDelete = async (program) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${program.name}" (${program.code})?`
    );
    if (!confirmed) return;

    try {
      await deleteProgram(program._id);
      setPrograms((prevPrograms) =>
        prevPrograms.filter((item) => item._id !== program._id)
      );
    } catch (err) {
      console.error("Failed to delete program:", err);
      alert(
        err.response?.data?.message ||
          "Failed to delete program. Please try again."
      );
    }
  };

  return (
    <DashboardLayout>
      <div style={styles.container}>
        {/* HEADER */}
        <div style={styles.header}>
          <div>
            <h1 style={styles.title}>Manage Programs</h1>
            <p style={styles.subtitle}>
              View, edit and manage all academic programs.
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate("/lecturer/programs/create")}
            style={styles.createButton}
          >
            + Create Program
          </button>
        </div>

        {/* ERROR */}
        {error && <div style={styles.errorBox}>{error}</div>}

        {/* LOADING / EMPTY / TABLE */}
        {loading ? (
          <div style={styles.messageBox}>
            <p>Loading programs...</p>
          </div>
        ) : programs.length === 0 ? (
          <div style={styles.emptyBox}>
            <h3>No Programs Found</h3>
            <p>You haven't created any academic programs yet.</p>
            <button
              type="button"
              onClick={() => navigate("/lecturer/programs/create")}
              style={styles.createButton}
            >
              + Create Your First Program
            </button>
          </div>
        ) : (
          <div style={styles.tableContainer}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>#</th>
                  <th style={styles.th}>Program Code</th>
                  <th style={styles.th}>Program Name</th>
                  <th style={styles.th}>Level</th>
                  <th style={styles.th}>Duration</th>
                  <th style={styles.th}>Actions</th>
                </tr>
              </thead>

              <tbody>
                {programs.map((program, index) => (
                  <tr key={program._id}>
                    <td style={styles.td}>{index + 1}</td>

                    <td style={styles.td}>
                      <span style={styles.codeBadge}>{program.code}</span>
                    </td>

                    <td style={styles.td}>
                      <strong>{program.name}</strong>
                    </td>

                    <td style={styles.td}>{program.level || "—"}</td>
                    <td style={styles.td}>{program.duration || "—"}</td>

                    <td style={styles.td}>
                      <div style={styles.actions}>
                        <button
                          type="button"
                          onClick={() => handleEdit(program._id)}
                          style={styles.editButton}
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(program)}
                          style={styles.deleteButton}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

/* =========================================
   STYLES
========================================= */
const styles = {
  container: { padding: "30px", maxWidth: "1400px", margin: "0 auto" },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "25px",
    gap: "20px",
  },
  title: { margin: 0, fontSize: "28px", color: "#222" },
  subtitle: { margin: "6px 0 0", color: "#666", fontSize: "14px" },

  createButton: {
    border: "none",
    borderRadius: "8px",
    padding: "11px 18px",
    background: "#222",
    color: "#fff",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "600",
  },

  errorBox: {
    padding: "14px 16px",
    marginBottom: "20px",
    borderRadius: "8px",
    background: "#ffe5e5",
    color: "#b00020",
    border: "1px solid #ffb3b3",
  },

  messageBox: {
    padding: "50px 20px",
    textAlign: "center",
    background: "#fff",
    borderRadius: "10px",
    border: "1px solid #ddd",
  },
  emptyBox: {
    padding: "60px 20px",
    textAlign: "center",
    background: "#fff",
    borderRadius: "10px",
    border: "1px solid #ddd",
  },

  tableContainer: {
    background: "#fff",
    border: "1px solid #ddd",
    borderRadius: "10px",
    overflowX: "auto",
  },
  table: { width: "100%", borderCollapse: "collapse" },
  th: {
    textAlign: "left",
    padding: "14px 16px",
    background: "#f5f5f5",
    borderBottom: "1px solid #ddd",
    fontSize: "14px",
    color: "#333",
  },
  td: {
    padding: "15px 16px",
    borderBottom: "1px solid #eee",
    fontSize: "14px",
    color: "#444",
  },
  codeBadge: {
    display: "inline-block",
    padding: "5px 9px",
    borderRadius: "5px",
    background: "#eee",
    color: "#222",
    fontWeight: "700",
    fontSize: "12px",
  },

  actions: { display: "flex", gap: "8px" },
  editButton: {
    border: "none",
    borderRadius: "6px",
    padding: "8px 13px",
    background: "#333",
    color: "#fff",
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: "600",
  },
  deleteButton: {
    border: "none",
    borderRadius: "6px",
    padding: "8px 13px",
    background: "#b42318",
    color: "#fff",
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: "600",
  },
};

export default ManagePrograms;