import { useEffect, useState } from "react";
import { getServices, updateServiceStatus } from "../services/api";

function ItemOrders() {
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
      setMessages({}); // 🔥 CLEAR OLD MESSAGES
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // 🔥 filter ONLY "new" type
  const items = orders.filter((o) => o.type === "new");

  const handleComplete = async (id) => {
    console.log("Clicked ID:", id); // 🔥 ADD THIS

    try {
      setMessages((prev) => ({ ...prev, [id]: "" }));

      await updateServiceStatus(id, { status: "completed" });
      setMessages((prev) => ({
        ...prev,
        [id]: "Order marked as delivered",
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
    <div>
      <h4>Item Orders</h4>

      {loading ? (
        <p>Loading...</p>
      ) : items.length === 0 ? (
        <p>No item orders</p>
      ) : (
        items.map((o) => (
          <div key={o.id} className="list-item">
            <strong>Vehicle:</strong>{" "}
            {o.vehicle?.vehicle_number || o.vehicle_id} <br />
            <strong>Type:</strong> {o.type === "new" ? "Item" : "Repair"} <br />

            <strong>Total:</strong> ₹{o.total_amount} <br />

            <strong>Status:</strong>{" "}
            {o.status === "pending" ? (
              <span style={{ color: "orange" }}>Pending</span>
            ) : (
              <span style={{ color: "green" }}>Completed</span>
            )}

            <br />

            {/* 🔥 BUTTON ONLY IF PENDING */}
            {o.status === "pending" && (
              <>
                <button onClick={() => handleComplete(o.id)}>
                  Mark as Delivered
                </button>
                {messages[o.id] && (
                  <p
                    style={{
                      color:
                        messages[o.id]?.toLowerCase().includes("not") ||
                        messages[o.id]?.toLowerCase().includes("invalid")
                          ? "red"
                          : "green",
                      marginTop: "5px",
                    }}
                  >
                    {messages[o.id]}
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

export default ItemOrders;