// src/pages/Services.jsx

import { useState } from "react";
import axios from "axios";

function Services() {
  const [vehicleId, setVehicleId] = useState("");
  const [bill, setBill] = useState(null);

  const getBill = async () => {
    if (!vehicleId) {
      alert("Enter Vehicle ID");
      return;
    }

    try {
      const res = await axios.get(
        `http://127.0.0.1:8000/api/vehicles/${vehicleId}/bill`
      );
      setBill(res.data);
    } catch (err) {
      alert(err.response?.data?.detail || "Error fetching bill");
    }
  };

  return (
    <div className="container">
      <h2>Services</h2>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          getBill();
        }}
      >
        <h3>Get Vehicle Bill</h3>

        <input
          placeholder="Enter Vehicle ID"
          value={vehicleId}
          onChange={(e) => setVehicleId(e.target.value)}
        />

        <button type="submit">Get Bill</button>
      </form>

      {bill && (
        <div className="list-item">
          <h3>Total: ₹{bill.total}</h3>

          {bill.breakdown.map((item, index) => (
            <div key={index}>
              {item.component} ({item.type}) <br />
              Qty: {item.quantity} | Cost: ₹{item.cost}
              <hr />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Services;