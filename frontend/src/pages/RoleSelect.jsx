import { useNavigate } from "react-router-dom";

function RoleSelect() {
  const navigate = useNavigate();

  return (
    <div className="container">
      <h2>Select Access Mode</h2>

      <button onClick={() => navigate("/user")}>User</button>
      <button onClick={() => navigate("/admin-login")}>Admin</button>
      
    </div>
  );
}

export default RoleSelect;