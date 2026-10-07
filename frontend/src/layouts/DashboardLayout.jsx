import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

const SIDEBAR_WIDTH = 250;
const TOPBAR_HEIGHT = 70;

const DashboardLayout = ({ children }) => {
  return (
    <div style={{ minHeight: "100vh", background: "#f5f5f5" }}>
      {/* FIXED SIDEBAR */}
      <Sidebar />

      {/* FIXED TOPBAR */}
      <Topbar />

      {/* MAIN CONTENT — offset for fixed sidebar + topbar */}
      <main
        style={{
          marginLeft: `${SIDEBAR_WIDTH}px`,
          marginTop: `${TOPBAR_HEIGHT}px`,
          padding: "30px",
          minHeight: `calc(100vh - ${TOPBAR_HEIGHT}px)`,
          boxSizing: "border-box",
        }}
      >
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;