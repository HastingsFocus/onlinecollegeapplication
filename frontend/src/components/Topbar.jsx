import { useAuth } from "../context/AuthContext";

const Topbar = () => {
    const { user } = useAuth();

    return (
      <div
  style={{
    height: "70px",
    background: "#fff",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0 30px",
    position: "fixed",
    top: 0,
    left: "250px",     // starts where the sidebar ends
    right: 0,          // stretches to the right edge
    boxSizing: "border-box",
    zIndex: 1000,
    boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
  }}
>
            <div>
                <h2 style={{
                    margin: 0,
                    fontSize: "22px"
                }}>
                    Welcome, {user?.firstName}
                </h2>
            </div>
            <div>
                <span
    style={{
        background: "#222",
        color: "#fff",
        padding: "10px 20px",
        borderRadius: "25px",
        fontSize: "14px",
        fontWeight: "600",
        letterSpacing: "1px",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        minWidth: "100px",
    }}
>
    {user?.role?.toUpperCase()}
</span>
            </div>
        </div>
    );
};

export default Topbar;