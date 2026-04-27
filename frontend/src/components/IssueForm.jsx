// src/components/IssueForm.jsx

import { useEffect, useState, useRef } from "react";
import {
  getVehicles,
  createIssue,
  getComponents,
  addComponentToIssue,
  deleteIssue, 
} from "../services/api";

function IssueForm({ onSuccess }) {
  const [vehicles, setVehicles] = useState([]);
  const [vehicleId, setVehicleId] = useState("");
  const [description, setDescription] = useState("");

  const [resolutionType, setResolutionType] = useState("new");
  const [components, setComponents] = useState([]);
  const [selectedComponent, setSelectedComponent] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const timerRef = useRef(null);

  const clearTimer = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  useEffect(() => {
    return () => clearTimer();
  }, []);
  

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
      const res = await getComponents(resolutionType); // ✅ optimized
      setComponents(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!vehicleId || !description.trim()) {
      setError("Please fill all fields");
      return;
    }

    if (!selectedComponent) {
      setError("Please select component");
      return;
    }
    
    if (!quantity || quantity <= 0) {
      setError("Quantity must be greater than 0");
      return;
    }

    let res;
    try {
      // CHECK DUPLICATE
      // const existing = await getIssues();

      // const duplicate = existing.data.find((i) =>
      //   i.vehicle_id === Number(vehicleId) &&
      //   i.components?.some(
      //     (c) => c.component_id === Number(selectedComponent) && c.component?.type === resolutionType
      //   )
      // );

      // if (duplicate) {
      //   setError("Issue already exists. Update to change.");
      //   return;
      // }

      // ✅ CREATE ISSUE
      setLoading(true);
      res = await createIssue({
        vehicle_id: Number(vehicleId),
        description: description.trim(),
      });

      // ✅ ADD COMPONENT
      await addComponentToIssue({
        issue_id: res.data.id,
        component_id: Number(selectedComponent),
        quantity: Number(quantity),
      });

      setMessage("Issue added successfully");
      clearTimer();
      timerRef.current = setTimeout(() => {
        setMessage("");
      }, 10000);

      setError("");

      // reset
      setDescription("");
      setSelectedComponent("");
      setQuantity(1);
      setVehicleId("");
      setResolutionType("new");

      if (onSuccess) onSuccess();

    } catch (err) {
      const msg = err.message;

      // ✅ DELETE EMPTY ISSUE IF CREATED
      if (res?.data?.id) {
        try {
          await deleteIssue(res.data.id);
        } catch (e) {
          console.error("Cleanup failed:", e);
        }
      }

      if (msg?.toLowerCase().includes("already exists")) {
        setError("This component already exists for this vehicle. Update instead.");
        setMessage("");
      } else {
        setError(msg || "Something went wrong");
        setMessage("");   // ✅ STOP LOADING ALWAYS
      } 
    } finally {
        setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Add Issue</h3>

      {/* Vehicle Selection */}
      <select
        autoFocus
        disabled={loading}
        value={vehicleId}
        onChange={(e) => {setVehicleId(e.target.value); 
          clearTimer();
          setError(""); 
          setMessage(""); }}
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
        type="text"
        disabled={loading}
        placeholder="Issue Description"
        value={description}
        onChange={(e) => {setDescription(e.target.value); 
          clearTimer();
          setError(""); 
          setMessage("");}}
      />

      {/* Resolution Type */}
      <h4>Resolution Type</h4>
      <select
        disabled={loading}
        value={resolutionType}
        onChange={(e) => {setResolutionType(e.target.value); 
          clearTimer();
          setSelectedComponent(""); 
          setError(""); 
          setMessage("");}
        }
      >
        <option value="new">New Component</option>
        <option value="repair">Repair</option>
      </select>

      {/* Component Selection */}
      <h4>Select Component</h4>
      <select
        disabled={loading}
        value={selectedComponent}
        onChange={(e) => {setSelectedComponent(e.target.value); 
          clearTimer();
          setError(""); 
          setMessage("");}
        }
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
        disabled={loading}
        type="number"
        min="1"
        placeholder="Quantity"
        value={quantity}
        onChange={(e) => {setQuantity(e.target.value === "" ? "" : Number(e.target.value)); 
          clearTimer();

          setError(""); 
          setMessage("");}
        }
      />

      <button type="submit" disabled={loading || !vehicleId ||
        !description.trim() ||
        !selectedComponent ||
        quantity <= 0
        }>
        {loading ? "Adding..." : "Add Issue"}
      </button>

      {error && <p style={{ color: "red" }}>{error}</p>}
      {message && <p style={{ color: "green" }}>{message}</p>}
    </form>
  );
}

export default IssueForm;