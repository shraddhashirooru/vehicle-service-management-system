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

      const res = await getServices(null, "new"); // get item orders
      setOrders(res.data);
    } catch (err) {
        setError("Unable to load item orders");
    } finally {
      setLoading(false);
    }
  };

  // filter ONLY "new" type
  const items = orders;

  const handleDeliver = async (id) => {
    try {
      setProcessingId(id);

      setMessages((prev) => ({ ...prev, [id]: "" }));

      await updateServiceStatus(id, { status: "delivered" });
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

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
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
        <p>No item orders found</p>
      ) : (
        items.map((o) => {

          const isError =
            messages[o.id] &&
            ["error", "invalid", "fail", "not"].some((word) =>
              messages[o.id].toLowerCase().includes(word)
            );
          return (
            <div key={o.id} className="list-item" style={{ marginBottom: "20px" }}>
              <h4>
                Order #
                {o.order_number ||
                  String(o.id).padStart(5, "0")}
              </h4>
              <p>
                <strong>Vehicle:</strong>{" "}
                {o.vehicle?.vehicle_number || o.vehicle_id}
              </p>

              <p>
                <strong>Order Date:</strong>{" "}
                {formatDate(o.created_at)}
              </p>

              {o.completed_at && (
                <p>
                  <strong>
                    Delivered Date:
                  </strong>{" "}
                  {formatDate(
                    o.completed_at
                  )}
                </p>
              )}

              <p>
                <strong>Status:</strong>{" "}
                {o.status === "pending" ? (
                  <span style={{ color: "orange" }}>Pending</span>
                ) : o.status === "completed" ? (
                  <span style={{ color: "green" }}>Completed</span>
                ) : (
                  <span style={{ color: "green" }}>Delivered</span>
                )}
              </p>

              {/* ITEMS TABLE */}
              {o.items?.length === 0 ? (
                <p style={{ marginTop: "10px", color: "gray" }}>
                  No items found
                </p>
              ) : (
                <table
                  style={{
                    width: "100%",
                    borderCollapse:
                      "collapse",
                    marginTop: "10px",
                  }}
                >
                  <thead>
                    <tr>
                      <th style={{ border: "1px solid #ccc", padding: "8px" }}>No</th>
                      <th style={{ border: "1px solid #ccc", padding: "8px" }}>Issue</th>
                      <th style={{ border: "1px solid #ccc", padding: "8px" }}>Items</th>
                      <th style={{ border: "1px solid #ccc", padding: "8px" }}>Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {o.items?.map(
                      (item, index) => (
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
                            ₹
                            {Number(
                              item.amount
                            ).toFixed(
                              2
                            )}
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              )}
              <p
                style={{
                  marginTop: "10px",
                  fontWeight: "bold",
                }}
              >
                Total Amount: ₹
                {Number(
                  o.total_amount
                ).toFixed(2)}
              </p>

              {/* BUTTON */}
              {o.status ===
                "pending" && (
                <>
                  <button style={{ marginTop: "10px" }}
                    onClick={() =>
                      handleDeliver(
                        o.id
                      )
                    }
                    disabled={
                      processingId ===
                      o.id
                    }
                  >
                    {processingId ===
                    o.id
                      ? "Updating..."
                      : "Mark as Delivered"}
                  </button>

                  {messages[o.id] && (
                    <p
                      style={{
                        color:
                          isError
                            ? "red"
                            : "green",
                        marginTop:
                          "8px",
                      }}
                    >
                      {
                        messages[
                          o.id
                        ]
                      }
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