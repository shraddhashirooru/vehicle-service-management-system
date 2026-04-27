import { useEffect, useState } from "react";
import { getServices, updateServiceStatus } from "../services/api";

function ItemOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState({});
  const [processingId, setProcessingId] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await getServices(); // 🔥 get ALL orders
      setOrders(res.data);
    } catch (err) {
        setError("Unable to load item orders");
    } finally {
      setLoading(false);
    }
  };

  // filter ONLY "new" type
  const items = orders.filter((o) => o.type?.toLowerCase() === "new");

  const handleComplete = async (id) => {

    try {
      setProcessingId(id);

      setMessages((prev) => ({ ...prev, [id]: "" }));

      await updateServiceStatus(id, { status: "completed" });
      setMessages((prev) => ({
        ...prev,
        [id]: "Order marked as delivered",
      }));

      setTimeout(async () => {
        await fetchOrders();

        setMessages((prev) => ({
          ...prev,
          [id]: "",
        }));
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

  return (
    <div>
      <h4 style={{ marginBottom: "10px" }}>Item Orders</h4>
      {error && (
        <p
          style={{
            color: "red",
            marginTop: "10px",
          }}
        >
          {error}
        </p>
      )}

      {loading ? (
        <p style={{ marginTop: "10px" }}>Loading...</p>
      ) : items.length === 0 ? (
        <p>No item orders</p>
      ) : (
        items.map((o) => {

          const isError =
            messages[o.id] &&
            ["error", "invalid", "fail", "not"].some((word) =>
              messages[o.id].toLowerCase().includes(word)
            );
          return (
            <div key={o.id} className="list-item">
              <strong>Vehicle:</strong>{" "}
              {o.vehicle?.vehicle_number || o.vehicle_id} <br />
              <strong>Type:</strong> {o.type?.toLowerCase() === "new" ? "Item" : "Repair"} <br />

              <strong>Total:</strong> ₹{Number(o.total_amount).toFixed(2)} <br />

              <strong>Status:</strong>{" "}
              {o.status === "pending" ? (
                <span style={{ color: "orange" }}>Pending</span>
              ) : (
                <span style={{ color: "green" }}>Completed</span>
              )}

              <br />

              {/* BUTTON ONLY IF PENDING */}
              {o.status === "pending" && (
                <>
                  <button onClick={() => handleComplete(o.id)} disabled={processingId === o.id}>
                    {processingId === o.id
                      ? "Updating..."
                      : "Mark as Delivered"}
                  </button>
                  {messages[o.id] && (
                    <p
                      style={{
                        color: isError ? "red" : "green",
                        marginTop: "5px",
                      }}
                    >
                      {messages[o.id]}
                    </p>
                  )}
                </>
              )}
            </div>
          );
        })
        )}
    </div>
  );
}

export default ItemOrders;