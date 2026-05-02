import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login({ setIsAdminAuth }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();


  const handleLogin = () => {
    if (username.trim() === "admin" && password === "admin123") {
      localStorage.setItem("adminAuth", "true");
      setIsAdminAuth(true);
      navigate("/admin");
    } else {
      setError("Invalid credentials");
    }
  };

  return (
    <div className="container">
      <h2>Admin Login</h2>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleLogin();
        }}
      >
        <input
          placeholder="Username"
          value={username}
          onChange={(e) => {setUsername(e.target.value); 
            setError("");
          }}
          
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => {setPassword(e.target.value);
            setError("");
          }}
        />

        <button type="submit" disabled={!username || !password}>Login</button>
        {error && (
          <p style={{ color: "red", marginTop: "10px" }}>
            {error}
          </p>
        )}
      </form>
    </div>
  );
}

export default Login;