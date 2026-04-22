import { useState } from "react";

import ComponentManagement from "./ComponentManagement";
import Orders from "./Orders";
import Revenue from "./Revenue";

function AdminDashboard() {
  const [tab, setTab] = useState("components");

  return (
    <div className="container">
      <h2>Admin Panel</h2>

      {/* 🔥 MAIN NAV */}
      <div className="nav-links">
        <button onClick={() => setTab("components")}>Components</button>
        <button onClick={() => setTab("orders")}>Orders</button>
        <button onClick={() => setTab("revenue")}>Revenue</button>
      </div>

      {/* 🔥 CONTENT */}
      {tab === "components" && <ComponentManagement />}
      {tab === "orders" && <Orders />}
      {tab === "revenue" && <Revenue />}
    </div>
  );
}

export default AdminDashboard;