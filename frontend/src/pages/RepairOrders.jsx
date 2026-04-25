import { useEffect, useState } from "react";
import { getServices, updateServiceStatus } from "../services/api";

function RepairOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState({});

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await getServices(); // 🔥 get ALL orders
      setOrders(res.data);
      setMessages({}); // 🔥 ADD THIS

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // 🔥 filter ONLY repair type
  const repairs = orders.filter((o) => o.type === "repair");

  const handleComplete = async (id) => {
    try {
      setMessages((prev) => ({ ...prev, [id]: "" }));

      await updateServiceStatus(id, { status: "completed" });
      setMessages((prev) => ({
        ...prev,
        [id]: "Repair marked as completed",
      }));
      setTimeout(() => {
        fetchOrders();
      }, 800);

    } catch (err) {
      setMessages((prev) => ({
        ...prev,
        [id]: err.message,
      }));
    }
  };

  return (
    <div className="container">
      <h3>Repair Orders</h3>

      {loading ? (
        <p>Loading...</p>
      ) : repairs.length === 0 ? (
        <p>No repairs</p>
      ) : (
        repairs.map((r) => (
          <div key={r.id} className="list-item">
            <strong>Vehicle:</strong>{" "}
            {r.vehicle?.vehicle_number || r.vehicle_id} <br />
            <strong>Type:</strong> Repair <br />

            <strong>Total:</strong> ₹{r.total_amount} <br />

            <strong>Status:</strong>{" "}
            {r.status === "pending" ? (
              <span style={{ color: "orange" }}>Pending</span>
            ) : (
              <span style={{ color: "green" }}>Completed</span>
            )}

            <br />

            {/* 🔥 BUTTON ONLY IF PENDING */}
            {r.status === "pending" && (
            <>
              <button
                style={{ marginTop: "10px" }}
                onClick={() => handleComplete(r.id)}
              >
                Mark as Completed
              </button>

              {messages[r.id] && (
                <p
                  style={{
                    color:
                      messages[r.id]?.toLowerCase().includes("not") ||
                      messages[r.id]?.toLowerCase().includes("invalid")
                        ? "red"
                        : "green",
                    marginTop: "5px",
                  }}
                >
                  {messages[r.id]}
                </p>
              )}
            </>
            )}
          </div>
        ))
      )}
    </div>
  );
}

export default RepairOrders;