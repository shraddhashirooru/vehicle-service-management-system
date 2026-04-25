import { useEffect, useState } from "react";
import { getServices, updateServiceStatus } from "../services/api";

function AdminDashboardPage() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const [messages, setMessages] = useState({});

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const res = await getServices("pending");
      setServices(res.data);
      setMessages({});
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = (id) => {
    setSelectedId((prev) => (prev === id ? null : id));
  };

  const handleComplete = async (id) => {
    try {
      setMessages((prev) => ({ ...prev, [id]: "" }));

      await updateServiceStatus(id, { status: "completed" });

      setMessages((prev) => ({
        ...prev,
        [id]: "Order updated successfully",
      }));

      setTimeout(() => {
        fetchServices();
      }, 800);

    } catch (err) {
      setMessages((prev) => ({
        ...prev,
        [id]: err.message,
      }));
    }
  };

  // 🔥 split items & repairs
  const items = services.filter((s) => s.type === "new");
  const repairs = services.filter((s) => s.type === "repair");

  const renderSection = (title, data, buttonText) => (
    <>
      <h4 style={{ marginTop: "20px" }}>{title}</h4>

      {data.length === 0 ? (
        <p>No {title.toLowerCase()}</p>
      ) : (
        data.map((s) => {
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
              {/* CLICK AREA */}
              <div onClick={() => handleToggle(s.id)}>
                <strong>Vehicle:</strong>{" "}
                {s.vehicle?.vehicle_number || s.vehicle_id} <br />

                <strong>Status:</strong>{" "}
                <span style={{ color: "orange", fontWeight: "bold" }}>
                  Pending
                </span>
              </div>

              {/* DETAILS */}
              {isOpen && (
                <div style={{ marginTop: "10px" }}>
                  <strong>Type:</strong>{" "}
                  {s.type === "new" ? "Item" : "Repair"} <br />

                  <strong>Total:</strong> ₹{s.total_amount} <br />

                  <strong>Order Date:</strong>{" "}
                  {new Date(s.created_at + "Z").toLocaleString("en-IN", {
                    timeZone: "Asia/Kolkata"
                  })} <br />

                  {/* ACTION BUTTON */}
                  <button
                    style={{ marginTop: "10px" }}
                    onClick={() => handleComplete(s.id)}
                  >
                    {buttonText}
                  </button>

                  {/* MESSAGE */}
                  {messages[s.id] && (
                    <p
                      style={{
                        color:
                          messages[s.id]?.toLowerCase().includes("not") ||
                          messages[s.id]?.toLowerCase().includes("invalid")
                            ? "red"
                            : "green",
                        marginTop: "5px",
                      }}
                    >
                      {messages[s.id]}
                    </p>
                  )}
                </div>
              )}
            </div>
          );
        })
      )}
    </>
  );

  return (
    <div>
      <h3>Pending Orders</h3>

      {error && (
        <p style={{ color: "red", marginTop: "10px" }}>
          {error}
        </p>
      )}

      {loading ? (
        <p>Loading...</p>
      ) : services.length === 0 ? (
        <p>No pending orders</p>
      ) : (
        <>
          {renderSection("Item Orders", items, "Mark as Delivered")}
          {renderSection("Repair Orders", repairs, "Mark as Completed")}
        </>
      )}
    </div>
  );
}

export default AdminDashboardPage;