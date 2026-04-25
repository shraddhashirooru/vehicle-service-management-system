// components/VehicleForm.jsx

import { useState } from "react";
import { createVehicle } from "../services/api";

function VehicleForm() {
  const [vehicleNumber, setVehicleNumber] = useState("");
  const [ownerName, setOwnerName] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!vehicleNumber || !ownerName) {
      alert("Please fill all fields");
      return;
    }

    try {
      await createVehicle({
        vehicle_number: vehicleNumber,
        owner_name: ownerName,
      });
      onSuccess();
      alert("Vehicle added");

      setVehicleNumber("");
      setOwnerName("");
    } catch (err) {
      alert(err.response?.data?.detail || "Error");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Add Vehicle</h3>

      <input
        placeholder="Vehicle Number"
        value={vehicleNumber}
        onChange={(e) => setVehicleNumber(e.target.value)}
      />

      <input
        placeholder="Owner Name"
        value={ownerName}
        onChange={(e) => setOwnerName(e.target.value)}
      />

      <button type="submit">Add</button>
    </form>
  );
}

export default VehicleForm;