// components/VehicleForm.jsx

import { useState, useRef, useEffect } from "react";
import { createVehicle } from "../services/api";



function VehicleForm({onSuccess}) {
  const [vehicleNumber, setVehicleNumber] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  
  const timerRef = useRef(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, []);

  const isError =
    message &&
    ["error", "invalid", "exist"].some((word) =>
      message.toLowerCase().includes(word)
    );

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!vehicleNumber.trim() || !ownerName.trim()) {
      setMessage("Please fill all fields");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      await createVehicle({
        vehicle_number: vehicleNumber.trim(),
        owner_name: ownerName.trim(),
      });

      setMessage("Vehicle added successfully");

      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      timerRef.current = setTimeout(() => {
        setMessage("");
      }, 2000);

      if (onSuccess) onSuccess();

      setVehicleNumber("");
      setOwnerName("");
    } catch (err) {
      setMessage(
        err.original?.response?.data?.detail ||
        err.message ||
        "Error adding vehicle"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Add Vehicle</h3>

      <input
        autoFocus
        placeholder="Vehicle Number"
        value={vehicleNumber}
        onChange={(e) => {setVehicleNumber(e.target.value);
          setMessage("");
          if (timerRef.current) {
            clearTimeout(timerRef.current);
            timerRef.current = null;
          }
        }}
      />

      <input
        type="text"
        placeholder="Owner Name"
        value={ownerName}
        onChange={(e) => {setOwnerName(e.target.value);
          setMessage("");
          if (timerRef.current) {
            clearTimeout(timerRef.current);
            timerRef.current = null;
          }
        }}
      />

      <button type="submit" disabled={loading || !vehicleNumber.trim() || !ownerName.trim()}>
        {loading ? "Adding..." : "Add Vehicle"}
      </button>

      {/* MESSAGE */}
      {message && (
        <p
          style={{
            color: isError ? "red" : "green",
            marginTop: "10px",
          }}
        >
          {message}
        </p>
      )}
    </form>
  );
}

export default VehicleForm;