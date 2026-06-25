import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

const DashboardLayout = ({ children }) => {

    return (

        <div
            style={{
                display: "flex",
                minHeight: "100vh",
            }}
        >

            {/* LEFT SIDEBAR */}

            <Sidebar />



            {/* RIGHT SIDE */}

            <div
                style={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                }}
            >

                {/* TOPBAR */}

                <Topbar />



                {/* PAGE CONTENT */}

                <div
                    style={{
                        padding: "20px",
                    }}
                >

                    {children}

                </div>


            </div>


        </div>

    );

};


export default DashboardLayout;