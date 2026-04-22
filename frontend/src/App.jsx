import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

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

        {/* Service Portal */}
        <Route path="/service" element={<Dashboard />} />
        <Route path="/vehicles" element={<Vehicles />} />
        <Route path="/issues" element={<Issues />} />
        <Route path="/services" element={<Services />} />

        {/* Admin */}
        <Route path="/admin-login" element={<Login />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;