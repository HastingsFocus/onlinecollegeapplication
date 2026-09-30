import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "./frontend/src/layouts/DashboardLayout";
import { getPrograms, deleteProgram } from "./frontend/src/services/programService";

const ManagePrograms = () => {
    const navigate = useNavigate();
    const [programs, setPrograms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");

    const fetchPrograms = async () => {
        try {
            const data = await getPrograms();
            setPrograms(data);
        } catch (error) {
            console.error(error);
            setMessage("Failed to load programs");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPrograms();
    }, []);

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this program?");
        if (!confirmDelete) return;

        try {
            await deleteProgram(id);
            setPrograms(programs.filter((program) => program._id !== id));
        } catch (error) {
            console.error(error);
            setMessage("Failed to delete program");
        }
    };

    return (
        <DashboardLayout>
            <h1>Manage Programs</h1>

            {message && <p>{message}</p>}

            {loading ? (
                <p>Loading programs...</p>
            ) : (
                <table style={{
                    width: "100%",
                    marginTop: "20px",
                    borderCollapse: "collapse",
                    background: "#fff"
                }}>
                    <thead>
                        <tr>
                            <th style={tableHeader}>Program Name</th>
                            <th style={tableHeader}>Department</th>
                            <th style={tableHeader}>Duration</th>
                            <th style={tableHeader}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {programs.map((program) => (
                            <tr key={program._id}>
                                <td style={tableCell}>{program.name}</td>
                                <td style={tableCell}>{program.department}</td>
                                <td style={tableCell}>{program.duration}</td>
                                <td style={tableCell}>
                                    <button
                                        style={editButton}
                                        onClick={() => navigate(`/lecturer/programs/edit/${program._id}`)}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(program._id)}
                                        style={deleteButton}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </DashboardLayout>
    );
};

const tableHeader = {
    border: "1px solid #ddd",
    padding: "12px",
    background: "#222",
    color: "#fff",
    textAlign: "left"
};

const tableCell = {
    border: "1px solid #ddd",
    padding: "12px"
};

const editButton = {
    padding: "8px 12px",
    marginRight: "10px",
    border: "none",
    borderRadius: "6px",
    background: "#444",
    color: "white",
    cursor: "pointer"
};

const deleteButton = {
    padding: "8px 12px",
    border: "none",
    borderRadius: "6px",
    background: "#c0392b",
    color: "white",
    cursor: "pointer"
};

export default ManagePrograms;