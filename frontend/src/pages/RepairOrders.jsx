import { useEffect, useState } from "react";
import { getServices, updateServiceStatus } from "../services/api";

function RepairOrders() {
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
      const res = await getServices(); 
      setOrders(res.data);
    } catch (err) {
      setError("Unable to load repair orders");
    } finally {
      setLoading(false);
    }
  };

  // filter ONLY repair type
  const repairs = orders.filter((o) => o.type?.toLowerCase() === "repair");

  const handleComplete = async (id) => {
    try {
      setProcessingId(id);
      setMessages((prev) => ({ ...prev, [id]: "" }));

      await updateServiceStatus(id, { status: "completed" });
      setMessages((prev) => ({
        ...prev,
        [id]: "Repair marked as completed",
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
        [id]: err.response?.data?.detail || err.message || "Failed to update repair",
      }));
      setProcessingId(null);
    }
  };

  return (
    <div className="container">
      <h3 style={{ marginBottom: "10px" }}>Repair Orders</h3>
      {error && (
        <p style={{ color: "red", marginTop: "10px" }}>
          {error}
        </p>
      )}

      {loading ? (
        <p style={{ marginTop: "10px" }}>Loading...</p>
      ) : repairs.length === 0 ? (
        <p>No repairs</p>
      ) : (
        repairs.map((r) => {
          const isError =
            messages[r.id] &&
            ["error", "invalid", "fail", "not"].some((word) =>
              messages[r.id].toLowerCase().includes(word)
            );

          return (
          <div key={r.id} className="list-item">
            <strong>Vehicle:</strong>{" "}
            {r.vehicle?.vehicle_number || r.vehicle_id} <br />
            <strong>Type:</strong> {r.type} <br />

            <strong>Total:</strong> ₹{Number(r.total_amount).toFixed(2)} <br />

            <strong>Status:</strong>{" "}
            {r.status === "pending" ? (
              <span style={{ color: "orange" }}>Pending</span>
            ) : (
              <span style={{ color: "green" }}>Completed</span>
            )}

            <br />

            {/* BUTTON ONLY IF PENDING */}
            {r.status === "pending" && (
            <>
              <button
                style={{ marginTop: "10px" }}
                onClick={() => handleComplete(r.id)}
                disabled={processingId === r.id}
              >
                {processingId === r.id
                  ? "Updating..."
                  : "Mark as Completed"}
              </button>

              {messages[r.id] && (
                <p
                  style={{
                    color: isError ? "red" : "green",
                    marginTop: "5px",
                  }}
                >
                  {messages[r.id]}
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

export default RepairOrders;