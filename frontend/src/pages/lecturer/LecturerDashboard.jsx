import DashboardLayout from "../../layouts/DashboardLayout";

const LecturerDashboard = () => {
    return (
        <DashboardLayout>
            <h1>Lecturer Dashboard</h1>
            <p>Welcome to the lecturer panel.</p>

            <div style={{
                marginTop: "30px",
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: "20px"
            }}>
                <div style={{
                    background: "#fff",
                    padding: "25px",
                    borderRadius: "10px",
                    boxShadow: "0 2px 5px rgba(0,0,0,0.1)"
                }}>
                    <h3>Programs</h3>
                    <p>Manage your college programs.</p>
                </div>

                <div style={{
                    background: "#fff",
                    padding: "25px",
                    borderRadius: "10px",
                    boxShadow: "0 2px 5px rgba(0,0,0,0.1)"
                }}>
                    <h3>Applications</h3>
                    <p>Review student applications.</p>
                </div>

                <div style={{
                    background: "#fff",
                    padding: "25px",
                    borderRadius: "10px",
                    boxShadow: "0 2px 5px rgba(0,0,0,0.1)"
                }}>
                    <h3>Remarks</h3>
                    <p>Manage application feedback.</p>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default LecturerDashboard;