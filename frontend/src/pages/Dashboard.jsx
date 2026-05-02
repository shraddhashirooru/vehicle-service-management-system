import { useEffect, useState } from "react";
import { getServices } from "../services/api";


function Dashboard() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    fetchServices();   
    const timer = setInterval(fetchServices, 30000);
    return () => clearInterval(timer);
  }, []);

  const handleToggle = (id) => {
    setSelectedId((prev) => (prev === id ? null : id));
  };

  const fetchServices = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await getServices("pending");
      
      setServices(res.data);
    } catch (err) {
        setError(
          err.response?.data?.detail ||
          err.message ||
          "Unable to load active orders"
        )
    } finally {
      setLoading(false);
    }
  };

  // filter from services
 

  return (
    <div className="container">

      {/* Ongoing Orders */}
      <h2>Active Orders</h2>
      {error && (
        <p style={{ color: "red", marginTop: "10px" }}>
          {error}
        </p>
      )}
      {loading ? (
        <p>Loading active services...</p>
      ) : services.length === 0 ? (
        <p>No active services</p>
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
                In Progress
              </span>
            </div>

              {/* EXPANDED DETAILS */}
              {isOpen && (
                <div style={{ marginTop: "10px" }}>

                  <strong>Order:</strong> #
                  {s.order_number || String(s.id).padStart(5, "0")} <br />

                  <strong>Total:</strong> ₹
                  {Number(s.total_amount).toFixed(2)} <br />

                  <strong>Order Date:</strong>{" "} 
                  {new Date(s.created_at + "Z").toLocaleString("en-IN", {
                    timeZone: "Asia/Kolkata"
                  })} <br />

                  {/* ITEMS TABLE */}
                  {s.items?.length > 0 && (
                    <table
                      style={{
                        width: "100%",
                        marginTop: "10px",
                        borderCollapse: "collapse"
                      }}
                    >
                      <thead>
                        <tr>
                          <th style={{ border: "1px solid #ccc", padding: "8px" }}>
                            No
                          </th>

                          <th style={{ border: "1px solid #ccc", padding: "8px" }}>
                            Issue
                          </th>

                          <th style={{ border: "1px solid #ccc", padding: "8px" }}>
                            {s.type === "new" ? "Item" : "Repair"}
                          </th>

                          <th style={{ border: "1px solid #ccc", padding: "8px" }}>
                            Amount
                          </th>
                        </tr>
                      </thead>

                      <tbody>
                        {s.items.map((item, index) => (
                          <tr key={index}>
                            <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                              {index + 1}
                            </td>

                            <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                              {item.issue}
                            </td>

                            <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                              {item.item_name}
                            </td>

                            <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                              ₹{Number(item.amount).toFixed(2)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
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