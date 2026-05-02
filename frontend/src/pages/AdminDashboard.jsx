import { useState } from "react";
import { useNavigate } from "react-router-dom";

import AdminDashboardPage from "./AdminDashboardPage";
import ComponentManagement from "./ComponentManagement";
import Orders from "./Orders";
import Revenue from "./Revenue";

function AdminDashboard({ setIsAdminAuth }) {
  const [tab, setTab] = useState("dashboard");
  const navigate = useNavigate();

  const handleLogout = () => {
      localStorage.removeItem("adminAuth");
      setIsAdminAuth(false);
      navigate("/admin-login");
    };

  return (
    <div className="container">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "15px"
        }}
      >
        <h2>Vehicle Service Admin Panel</h2>

        <button
          onClick={handleLogout}
          style={{
            backgroundColor: "red",
            color: "white"
          }}
        >
          Logout
        </button>
      </div>

      {/* MAIN NAV */}
      <div className="nav-links">
        <button   className={tab === "dashboard" ? "active" : ""} onClick={() => setTab("dashboard")}>Dashboard</button>
        <button   className={tab === "components" ? "active" : ""} onClick={() => setTab("components")}>Components</button>
        <button   className={tab === "orders" ? "active" : ""} onClick={() => setTab("orders")}>Orders</button>
        <button   className={tab === "revenue" ? "active" : ""} onClick={() => setTab("revenue")}>Revenue</button>
      </div>

      {/* CONTENT */}
      {tab === "dashboard" && <AdminDashboardPage />}
      {tab === "components" && <ComponentManagement />}
      {tab === "orders" && <Orders />}
      {tab === "revenue" && <Revenue />}
    </div>
  );
}

export default AdminDashboard;