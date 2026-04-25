// src/pages/Services.jsx

import { useEffect, useState } from "react";
import {
  getVehicles,
  getBill,
  createService,
  getServices,
  
} from "../services/api";


function Services() {
  const [mode, setMode] = useState(""); 
  const [vehicles, setVehicles] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState("");
  const [bill, setBill] = useState(null);
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // 🔥 Get vehicles having issues
  useEffect(() => {
    fetchVehicles();
  }, []);

  useEffect(() => {
    if (mode === "view") {
      fetchOrders();
    }
  }, [mode]);

  const fetchVehicles = async () => {
    try {
      const res = await getVehicles();

      const list = res.data.map((v) => ({
        id: v.id,
        number: v.vehicle_number,
      }));

      setVehicles(list);
    } catch (err) {
      console.error(err);
    }
  };
  // 💰 Get bill
  const handleGetBill = async () => {
    if (!selectedVehicle) return alert("Select vehicle");

    try {
      const type = mode === "purchase" ? "new" : "repair";
      const res = await getBill(selectedVehicle, type);
      setBill(res.data);
    } catch (err) {
      alert(err.message);
    }
  };

  // 🧾 Place order
  const handlePlaceOrder = async () => {

  // ✅ VALIDATION
    if (!selectedVehicle) {
      alert("Select vehicle");
      return;
    }

    if (!bill || bill.items.length === 0) {
      alert("No items available to place order");
      return;
    }
    
    try {
      setLoading(true);
      // ✅ CREATE ORDER
      await createService({
        vehicle_id: Number(selectedVehicle),
        total_amount: bill.total,
        type: mode === "purchase" ? "new" : "repair",
      });


      // ✅ RESET
      setSelectedVehicle("");
      setBill(null);

      // 🔥 IMPORTANT: refresh orders + switch tab
      fetchVehicles();
      setSelectedOrder(null);   // ✅ ADD   
      setMode("view");
      setMessage("Order placed successfully");

    } catch (err) {
      alert(err.message || "Error");
    } finally {
      setLoading(false);  // 🔥 ALWAYS STOP LOADING
    }
  };
  // 📦 Fetch orders
  const fetchOrders = async () => {
    try {
      const res = await getServices();
      setOrders(res.data);
      setSelectedOrder(null); // 🔥 add this

    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="container">
      <h2>Services</h2>
      {message && (
        <p style={{ color: "green", marginBottom: "10px" }}>
          {message}
        </p>
      )}

      {/* 🔘 Buttons */}
      <button onClick={() => { setMode("purchase"); setSelectedOrder(null); setMessage(""); setSelectedVehicle(""); setBill(null); }}>
        Purchase Parts
      </button>

      <button onClick={() => { setMode("repair"); setSelectedOrder(null); setMessage(""); setSelectedVehicle(""); setBill(null); }}>
        Repair Services
      </button>

      <button onClick={() => { setMode("view"); setSelectedOrder(null); setMessage(""); setSelectedVehicle(""); setBill(null); }}>
        View Orders
      </button>
      {/* ================= */}
      {/* PLACE ORDER */}
      {/* ================= */}
      {(mode === "purchase" || mode === "repair") && (
        <div className="list-item">
          <h3> {mode === "purchase" ? "Purchase Parts" : "Repair Services"} </h3>

          
          <select
            value={selectedVehicle}
            onChange={(e) => {setSelectedVehicle(e.target.value); setMessage(""); setBill(null);}}
          >
            <option value="">Select Vehicle</option>

            {vehicles.map((v) => (
              <option key={v.id} value={v.id}>
                {v.number}
              </option>
            ))}
          </select>
          {vehicles.length === 0 && (
            <p style={{ marginTop: "10px", color: "gray" }}>
              No vehicles available for this service
            </p>
          )}

          <button onClick={handleGetBill} disabled={loading || !selectedVehicle || vehicles.length === 0}>
            Get Bill
          </button>

          {/* BILL */}
          {bill && bill.items.length > 0 ? (
            <div style={{ marginTop: "10px" }}>
              <h4>Total: ₹{bill.total}</h4>

              {bill.items.map((item, index) => (
                <div key={index}>
                  {item.component} ({item.type}) <br />
                  Qty: {item.quantity} | ₹{item.amount}
                  <hr />
                </div>
              ))}
              
              <button onClick={handlePlaceOrder} disabled={loading || !bill || bill.items.length === 0}>
                {loading ? "Placing..." : "Place Order"}
              </button>

            </div>
          ) : bill && bill.items.length === 0 ? (
            <p style={{ marginTop: "10px", color: "gray" }}>
              No pending services for this vehicle
            </p>
          ) : null}
        </div>
      )}

      {/* ================= */}
      {/* VIEW ORDERS */}
      {/* ================= */}
      {mode === "view" && (
        <div>
          <h3>Orders</h3>

          {orders.length === 0 ? (
            <p>No orders yet. Place your first order.</p>
          ) : (
            orders.map((o) => (
              <div
                key={o.id}
                className="list-item"
                onClick={() => setSelectedOrder(o)}   // ✅ clickable
                style={{ cursor: "pointer" }}
              >
                <strong>Vehicle:</strong>{" "}
                {o.vehicle?.vehicle_number || o.vehicle_id} <br />

                <strong>Type:</strong>{" "}
                {o.type === "new" ? "Item" : "Repair"} <br />

                <strong>Total:</strong> ₹{o.total_amount} <br />

                <strong>Status:</strong>{" "}
                {o.status === "pending" ? (
                  <span style={{ color: "orange", fontWeight: "bold" }}>
                    Pending
                  </span>
                ) : (
                  <span style={{ color: "green", fontWeight: "bold" }}>
                    Completed
                  </span>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {selectedOrder && (
        <div className="list-item">
          <h3>Order Details</h3>

          <p>
            <strong>Vehicle:</strong>{" "}
            {selectedOrder.vehicle?.vehicle_number || selectedOrder.vehicle_id}
          </p>

          <p>
            <strong>Type:</strong>{" "}
            {selectedOrder.type === "new" ? "Item" : "Repair"}
          </p>

          <p>
            <strong>Total Amount:</strong> ₹{selectedOrder.total_amount}
          </p>

          <p>
            <strong>Status:</strong>{" "}
            {selectedOrder.status === "pending" ? (
              <span style={{ color: "orange", fontWeight: "bold" }}>
                Pending
              </span>
            ) : (
              <span style={{ color: "green", fontWeight: "bold" }}>
                Completed
              </span>
            )}
          </p>

          <p>
            <strong>Date:</strong>{" "}
            {new Date(selectedOrder.created_at + "Z").toLocaleString("en-IN", {
              timeZone: "Asia/Kolkata"
            })}
          </p>
        </div>
      )}
    </div>
  );
}

export default Services;