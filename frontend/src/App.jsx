import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import RoleSelect from "./pages/RoleSelect";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";

import Dashboard from "./pages/Dashboard";
import Vehicles from "./pages/Vehicles";
import Issues from "./pages/Issues";
import Services from "./pages/Services";


import Navbar from "./components/Navbar";

function App() {
  return (
    <Router>
      <Navbar />

      <Routes>
        {/* Entry */}
        <Route path="/" element={<RoleSelect />} />

        {/* User Portal */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/user" element={<Navigate to="/dashboard" />} />

        <Route path="/vehicles" element={<Vehicles />} />
        <Route path="/issues" element={<Issues />} />
        <Route path="/orders" element={<Services />} />

        {/* Admin */}
        <Route
          path="/admin-login"
          element={
            localStorage.getItem("adminAuth") === "true"
              ? <Navigate to="/admin" />
              : <Login />
          }
        />
        <Route
          path="/admin"
          element={
            localStorage.getItem("adminAuth") === "true"
              ? <AdminDashboard />
              : <Navigate to="/admin-login" />
          }
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;