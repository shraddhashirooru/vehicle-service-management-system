import { Link, useLocation } from "react-router-dom";

function Navbar() {
  const location = useLocation();

  // ❌ Hide navbar on home page
  if (location.pathname === "/") {
    return null;
  }

  return (
    <div>
      <div className="navbar">Vehicle Service System</div>

      {/* USER NAVIGATION */}
      {(location.pathname.startsWith("/user") ||
        location.pathname.startsWith("/vehicles") ||
        location.pathname.startsWith("/issues") ||
        location.pathname.startsWith("/services")) && (
        <div className="nav-links">
          <Link to="/user">Dashboard</Link>
          <Link to="/vehicles">Vehicles</Link>
          <Link to="/issues">Issues</Link>
          <Link to="/services">Services</Link>
        </div>
      )}
    </div>
  );
}

export default Navbar;