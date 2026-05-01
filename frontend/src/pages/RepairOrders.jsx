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
      const res = await getServices(null, "repair"); 
      setOrders(res.data);
    } catch (err) {
      setError("Unable to load repair orders");
    } finally {
      setLoading(false);
    }
  };

  // filter ONLY repair type

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

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="container">
      <h4 style={{ marginBottom: "10px" }}>Repair Orders</h4>
      {error && (
        <p style={{ color: "red", marginTop: "10px" }}>
          {error}
        </p>
      )}

      {loading ? (
        <p style={{ marginTop: "10px" }}>Loading...</p>
      ) : orders.length === 0 ? (
        <p>No repair orders found</p>
      ) : (
        orders.map((r) => {
          const isError =
            messages[r.id] &&
            ["error", "invalid", "fail", "not", "unable"].some((word) =>
              String(messages[r.id]).toLowerCase().includes(word)
            );

          return (
            <div key={r.id} className="list-item" style={{ marginBottom: "20px" }}>
              <h4>
                  Order #
                  {r.order_number ||
                    String(r.id).padStart(5, "0")}
              </h4>

              <p>
                <strong>Vehicle:</strong>{" "}
                {r.vehicle?.vehicle_number || r.vehicle_id}
              </p>

              <p>
                <strong>Order Date:</strong>{" "}
                {formatDate(r.created_at)}
              </p>

              {r.completed_at && (
                <p>
                  <strong>
                    Completed Date:
                  </strong>{" "}
                  {formatDate(
                    r.completed_at
                  )}
                </p>
              )}

              <p>
                <strong>Status:</strong>{" "}
                {r.status === "pending" ? (
                  <span
                    style={{
                      color: "orange",
                    }}
                  >
                    Pending
                  </span>
                ) : (
                  <span
                    style={{
                      color: "green",
                    }}
                  >
                    Completed
                  </span>
                )}
              </p>

              {/* REPAIR TABLE */}
              {r.items?.length === 0 ? (
                <p
                  style={{
                    marginTop: "10px",
                    color: "gray",
                  }}
                >
                  No repairs found
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
                      <th
                        style={{
                          border:
                            "1px solid #ccc",
                          padding: "8px",
                        }}
                      >
                        No
                      </th>

                      <th
                        style={{
                          border:
                            "1px solid #ccc",
                          padding: "8px",
                        }}
                      >
                        Issue
                      </th>

                      <th
                        style={{
                          border:
                            "1px solid #ccc",
                          padding: "8px",
                        }}
                      >
                        Repair
                      </th>

                      <th
                        style={{
                          border:
                            "1px solid #ccc",
                          padding: "8px",
                        }}
                      >
                        Amount
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {r.items?.map(
                      (
                        item,
                        index
                      ) => (
                        <tr
                          key={index}
                        >
                          <td
                            style={{
                              border:
                                "1px solid #ccc",
                              padding:
                                "8px",
                            }}
                          >
                            {index + 1}
                          </td>

                          <td
                            style={{
                              border:
                                "1px solid #ccc",
                              padding:
                                "8px",
                            }}
                          >
                            {
                              item.issue
                            }
                          </td>

                          <td
                            style={{
                              border:
                                "1px solid #ccc",
                              padding:
                                "8px",
                            }}
                          >
                            {
                              item.item_name
                            }
                          </td>

                          <td
                            style={{
                              border:
                                "1px solid #ccc",
                              padding:
                                "8px",
                            }}
                          >
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
                  r.total_amount
                ).toFixed(2)}
              </p>
              {/* BUTTON */}
              {r.status ===
                "pending" && (
                <>
                  <button
                    style={{
                      marginTop:
                        "10px",
                    }}
                    onClick={() =>
                      handleComplete(
                        r.id
                      )
                    }
                    disabled={
                      processingId ===
                      r.id
                    }
                  >
                    {processingId ===
                    r.id
                      ? "Updating..."
                      : "Mark as Completed"}
                  </button>

                  {messages[r.id] && (
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
                          r.id
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

export default RepairOrders;