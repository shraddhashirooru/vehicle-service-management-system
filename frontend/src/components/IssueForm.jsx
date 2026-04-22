// src/components/IssueForm.jsx

import { useEffect, useState } from "react";
import {
  getVehicles,
  createIssue,
  getComponents,
  addComponentToIssue,
} from "../services/api";

function IssueForm({ onSuccess }) {
  const [vehicles, setVehicles] = useState([]);
  const [vehicleId, setVehicleId] = useState("");
  const [description, setDescription] = useState("");

  const [resolutionType, setResolutionType] = useState("new");
  const [components, setComponents] = useState([]);
  const [selectedComponent, setSelectedComponent] = useState("");
  const [quantity, setQuantity] = useState(1);

  // Load vehicles
  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    try {
      const res = await getVehicles();
      setVehicles(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // Load components based on type
  useEffect(() => {
    fetchComponents();
  }, [resolutionType]);

  const fetchComponents = async () => {
    try {
      const res = await getComponents();

      // filter by type (new / repair)
      const filtered = res.data.filter(
        (c) => c.type === resolutionType
      );

      setComponents(filtered);
    } catch (err) {
      console.error(err);
    }
  };

  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!vehicleId || !description) {
      alert("Please fill all fields");
      return;
    }

    if (!selectedComponent) {
      alert("Please select component");
      return;
    }

    try {
      // Create issue
      const res = await createIssue({
        vehicle_id: Number(vehicleId),
        description,
      });

      // Attach component
      if (selectedComponent){
        await addComponentToIssue({
        issue_id: res.data.id,
        component_id: Number(selectedComponent),
        quantity: Number(quantity),
      });
    }

      alert("Issue added successfully");

      // reset form
      setDescription("");
      setSelectedComponent("");
      setQuantity(1);

      if (onSuccess) onSuccess();

    } catch (err) {
      alert(err.response?.data?.detail || "Error");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Add Issue</h3>

      {/* Vehicle Selection */}
      <select
        value={vehicleId}
        onChange={(e) => setVehicleId(e.target.value)}
      >
        <option value="">Select Vehicle</option>

        {vehicles.map((v) => (
          <option key={v.id} value={v.id}>
            {v.vehicle_number}
          </option>
        ))}
      </select>

      {/* Description */}
      <input
        placeholder="Issue Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      {/* Resolution Type */}
      <h4>Resolution Type</h4>
      <select
        value={resolutionType}
        onChange={(e) => setResolutionType(e.target.value)}
      >
        <option value="new">New Component</option>
        <option value="repair">Repair</option>
      </select>

      {/* Component Selection */}
      <h4>Select Component</h4>
      <select
        value={selectedComponent}
        onChange={(e) => setSelectedComponent(e.target.value)}
      >
        <option value="">Select Component</option>

        {components.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name} - ₹{c.price}
          </option>
        ))}
      </select>

      {/* Quantity */}
      <input
        type="number"
        placeholder="Quantity"
        value={quantity}
        onChange={(e) => setQuantity(e.target.value)}
      />

      <button type="submit">Add Issue</button>
    </form>
  );
}

export default IssueForm;