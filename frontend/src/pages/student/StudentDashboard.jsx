import DashboardLayout from "../../layouts/DashboardLayout";

const StudentDashboard = () => {

    return (

        <DashboardLayout>

            <div
                style={{
                    width: "100%",
                    minHeight: "100%",
                    boxSizing: "border-box",
                }}
            >

                <h1
                    style={{
                        marginTop: 0,
                        marginBottom: "20px",
                    }}
                >
                    Student Dashboard
                </h1>

                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns:
                            "repeat(auto-fit, minmax(250px, 1fr))",
                        gap: "20px",
                    }}
                >

                    <div
                        style={{
                            background: "#fff",
                            padding: "20px",
                            borderRadius: "10px",
                            boxShadow:
                                "0 2px 5px rgba(0,0,0,0.1)",
                        }}
                    >
                        <h3>Applications</h3>
                        <p>0 Submitted</p>
                    </div>

                    <div
                        style={{
                            background: "#fff",
                            padding: "20px",
                            borderRadius: "10px",
                            boxShadow:
                                "0 2px 5px rgba(0,0,0,0.1)",
                        }}
                    >
                        <h3>Payments</h3>
                        <p>0 Completed</p>
                    </div>

                    <div
                        style={{
                            background: "#fff",
                            padding: "20px",
                            borderRadius: "10px",
                            boxShadow:
                                "0 2px 5px rgba(0,0,0,0.1)",
                        }}
                    >
                        <h3>Status</h3>
                        <p>No Application Yet</p>
                    </div>

                </div>

            </div>

        </DashboardLayout>

    );

};

export default StudentDashboard;