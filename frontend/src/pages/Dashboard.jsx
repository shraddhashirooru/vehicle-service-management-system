import { useEffect, useState } from "react";
import { getServices } from "../services/api";


function Dashboard() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    fetchServices();   
  }, []);

  const handleToggle = (id) => {
    setSelectedId((prev) => (prev === id ? null : id));
  };

  const fetchServices = async () => {
    try {
      setLoading(true);

      const res = await getServices("pending");
      
      setServices(res.data);
    } catch (err) {
        setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // filter from services
 

  return (
    <div className="container">

      {/* Ongoing Orders */}
      <h2>Ongoing Services</h2>
      {error && (
        <p style={{ color: "red", marginTop: "10px" }}>
          {error}
        </p>
      )}
      {loading ? (
        <p>Loading...</p>
      ) : services.length === 0 ? (
        <p>No ongoing services</p>
      ) : (
        services.map((s) => {
          const isOpen = selectedId === s.id;

          return (
            <div
              key={s.id}
              className="list-item"
              style={{
                cursor: "pointer",
                background: isOpen ? "#f9f9f9" : "white",
                transition: "0.2s ease"
              }}
            >
            <div onClick={() => handleToggle(s.id)} >

              <strong>Vehicle:</strong>{" "}
              {s.vehicle?.vehicle_number || s.vehicle_id} <br />

              <strong>Status:</strong>{" "}
              <span style={{ color: "orange", fontWeight: "bold" }}>
                Ongoing
              </span>
            </div>

              {/* 🔽 EXPANDED DETAILS */}
              {isOpen && (
                <div style={{ marginTop: "10px" }}>
                  <strong>Type:</strong>{" "}
                  {s.type
                    ? s.type.charAt(0).toUpperCase() + s.type.slice(1)
                    : "-"}{" "}
                  <br />

                  <strong>Total:</strong> ₹{s.total_amount} <br />

                  <strong>Order Date:</strong>{" "}
                  {new Date(s.created_at).toLocaleString()}
                </div>
              )}
            </div>
          );
        })
      )}
    </div>
  );
}

export default Dashboard;