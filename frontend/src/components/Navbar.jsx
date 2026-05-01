import { NavLink, useLocation } from "react-router-dom";

function Navbar() {
  const location = useLocation();

  // Hide navbar on home page
  if (location.pathname === "/") {
    return null;
  }

  return (
    <div>
      <div className="navbar">Vehicle Service Management System</div>

      {/* USER NAVIGATION */}
      {(location.pathname.startsWith("/dashboard") ||
        location.pathname.startsWith("/vehicles") ||
        location.pathname.startsWith("/issues") ||
        location.pathname.startsWith("/orders")) && (
        <nav className="nav-links">
          <NavLink to="/dashboard">Dashboard</NavLink>
          <NavLink to="/vehicles">Vehicles</NavLink>
          <NavLink to="/issues">Issues</NavLink>
          <NavLink to="/orders">Orders</NavLink>
        </nav>
      )}
    </div>
  );
}

export default Navbar;