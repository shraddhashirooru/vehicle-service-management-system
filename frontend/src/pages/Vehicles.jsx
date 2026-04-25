// src/pages/Vehicles.jsx

import { useEffect, useState } from "react";
import {
  getVehicles,
  updateVehicle,
  deleteVehicle,
} from "../services/api";
import VehicleForm from "../components/VehicleForm";

function Vehicles() {
  const [vehicles, setVehicles] = useState([]);
  const [selected, setSelected] = useState(null);

  const [editNumber, setEditNumber] = useState("");
  const [editOwner, setEditOwner] = useState("");

  const fetchVehicles = async () => {
    try {
      const res = await getVehicles();
      setVehicles(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  // 🎯 Select vehicle
  const handleSelect = (v) => {
    setSelected(v);
    setEditNumber(v.vehicle_number);
    setEditOwner(v.owner_name);
  };

  // ✏️ Update vehicle
  const handleUpdate = async () => {
    try {
      await updateVehicle(selected.id, {
        vehicle_number: editNumber,
        owner_name: editOwner,
      });

      alert("Vehicle updated");
      setSelected(null);
      fetchVehicles();
    } catch (err) {
      alert(err.response?.data?.detail || "Error");
    }
  };

  // ❌ Delete vehicle
  const handleDelete = async () => {
    try {
      await deleteVehicle(selected.id);

      alert("Vehicle deleted");
      setSelected(null);
      fetchVehicles();
    } catch (err) {
      alert(err.response?.data?.detail || "Error");
    }
  };

  return (
    <div className="container">
      <h2>Vehicles</h2>

      <VehicleForm onSuccess={fetchVehicles} />

      <h3>Vehicle List</h3>

      {vehicles.length === 0 ? (
        <p>No vehicles added</p>
      ) : (
        vehicles.map((v) => (
          <div
            className="list-item"
            key={v.id}
            onClick={() => handleSelect(v)}   // ✅ CLICK ENABLED
            style={{
              cursor: "pointer",
              backgroundColor:
                selected?.id === v.id ? "#dff0ff" : "",
            }}
          >
            <strong>{v.vehicle_number}</strong> <br />
            Owner: {v.owner_name}
          </div>
        ))
      )}

      {/* 🔧 EDIT SECTION */}
      {selected && (
        <div className="list-item">
          <h3>Edit Vehicle</h3>

          <input
            value={editNumber}
            onChange={(e) => setEditNumber(e.target.value)}
            placeholder="Vehicle Number"
          />

          <input
            value={editOwner}
            onChange={(e) => setEditOwner(e.target.value)}
            placeholder="Owner Name"
          />

          <div style={{ marginTop: "10px" }}>
            <button onClick={handleUpdate}>
              Update
            </button>

            <button
              onClick={handleDelete}
              style={{
                backgroundColor: "red",
                marginLeft: "10px",
              }}
            >
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Vehicles;