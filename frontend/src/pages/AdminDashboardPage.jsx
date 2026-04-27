import { useEffect, useState } from "react";
import { getServices, updateServiceStatus } from "../services/api";

function AdminDashboardPage() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const [messages, setMessages] = useState({});
  const [processingId, setProcessingId] = useState(null);

  useEffect(() => {
    fetchServices();
  }, []);

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
        "Unable to load orders"
      );
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
      setProcessingId(id);

      await updateServiceStatus(id, { status: "completed" });

      setMessages((prev) => ({
        ...prev,
        [id]: "Order updated successfully",
      }));

      setTimeout(async () => {
        await fetchServices();

        setMessages((prev) => ({
          ...prev,
          [id]: "",
        }));
        setSelectedId(null);
        setProcessingId(null);
      }, 2000);

    } catch (err) {
      setMessages((prev) => ({
        ...prev,
        [id]: err.response?.data?.detail || err.message || "Failed to update order",
      }));
      setProcessingId(null);
    }
  };

  // split items & repairs
  const items = services.filter(
    (s) => s.type?.toLowerCase() === "new"
  );

  const repairs = services.filter(
    (s) => s.type?.toLowerCase() === "repair"
  );

  const renderSection = (title, data, buttonText) => (
    <>
      <h4 style={{ marginTop: "20px" }}>{title}</h4>

      {data.length === 0 ? (
        <p>No {title.toLowerCase()}</p>
      ) : (
        data.map((s) => {
          const isOpen = selectedId === s.id;          
          
          const isError =
            messages[s.id] &&
            ["error", "invalid", "fail", "not"].some((word) =>
              messages[s.id].toLowerCase().includes(word)
            );

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
              <div onClick={() => processingId === null && handleToggle(s.id)}>
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
                  {s.type?.toLowerCase() === "new" ? "Item" : "Repair"} <br />

                  <strong>Total:</strong> ₹{Number(s.total_amount).toFixed(2)} <br />

                  <strong>Order Date:</strong>{" "}
                  {new Date(s.created_at + "Z").toLocaleString("en-IN", {
                    timeZone: "Asia/Kolkata"
                  })} <br />

                  {/* ACTION BUTTON */}
                  <button
                    style={{ marginTop: "10px" }}
                    onClick={() => handleComplete(s.id)} disabled={processingId !== null}
                  >
                    {processingId === s.id
                      ? "Updating..."
                      : buttonText}
                  </button>

                  {/* MESSAGE */}
                  {messages[s.id] && (
                    <p
                      style={{
                        color: isError ? "red" : "green",
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
      <h3 style={{ marginBottom: "10px" }}>Pending Orders</h3>

      {error && (
        <p style={{ color: "red", marginTop: "10px" }}>
          {error}
        </p>
      )}

      {loading ? (
        <p style={{ marginTop: "10px" }}>Loading...</p>
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