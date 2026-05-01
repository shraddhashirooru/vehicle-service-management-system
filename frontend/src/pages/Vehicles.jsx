// src/pages/Vehicles.jsx

import { useEffect, useState, useRef } from "react";
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
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [action, setAction] = useState(null);

  const timerRef = useRef(null);

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

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (selected) {
      document.querySelector("input")?.focus();
    }
  }, [selected]);

  // 🎯 Select vehicle
  const handleSelect = (v) => {
    setSelected(v);
    setEditNumber(v.vehicle_number);
    setEditOwner(v.owner_name);
    setMessage(""); 
  };

  // ✏️ Update vehicle
  const handleUpdate = async () => {
    if (!editNumber.trim() || !editOwner.trim()) {
      setMessage("Please fill all fields");
      return;
    }

    try {
      setLoading(true);
      setAction("update");   
      setMessage("");

      await updateVehicle(selected.id, {
        vehicle_number: editNumber.trim(),
        owner_name: editOwner.trim().replace(/\s+/g, " "),
      });

      setMessage("Vehicle updated successfully");

      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      timerRef.current = setTimeout(() => {
        setMessage("");
      }, 2000);

      setSelected(null);
      fetchVehicles();
    } catch (err) {
        const detail =
          err.original?.response?.data?.detail ||
          err.response?.data?.detail;

        if (Array.isArray(detail)) {
          setMessage(detail[0]?.msg || "Invalid input");
        } else {
          setMessage(
            detail ||
            err.message ||
            "Error updating vehicle"
          );
        }
      } finally {
      setLoading(false);
      setAction(null);
     }
  };

  // ❌ Delete vehicle
  const handleDelete = async () => {
    try {
      setLoading(true);
      setAction("delete");   
      setMessage("");

      await deleteVehicle(selected.id);

      setMessage("Vehicle deleted successfully");
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      timerRef.current = setTimeout(() => {
        setMessage("");
      }, 2000);

      setSelected(null);
      fetchVehicles();
    } catch (err) {
      setMessage(
        err.original?.response?.data?.detail ||
        err.message ||
        "Error deleting vehicle"
      );
    } finally {
      setLoading(false);
      setAction(null);

    }
  };

  const safeMessage = String(message);

  const isError =
    message &&
    ["error", "invalid", "exist", "value", "please"].some((word) =>
      safeMessage.toLowerCase().includes(word)
    );

  const isUnchanged =
    selected &&
    editNumber.trim() === selected.vehicle_number &&
    editOwner.trim() === selected.owner_name;

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
            onClick={() => !loading && handleSelect(v)}   // ✅ CLICK ENABLED
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
            onChange={(e) => {
              setEditNumber(e.target.value.toUpperCase());
              setMessage("");
            }}
            placeholder="Vehicle Number"
          />

          <input
            type="text"
            value={editOwner}
            onChange={(e) => {
              setEditOwner(e.target.value);
              setMessage("");
            }}
            placeholder="Owner Name"
          />

          <div style={{ marginTop: "10px" }}>
            <button onClick={handleUpdate} disabled={loading || !editNumber.trim() || !editOwner.trim() || isUnchanged} >
              {loading && action === "update" ? "Updating..." : "Update"}
            </button>

            <button
              onClick={handleDelete}
              disabled={loading}
              style={{ backgroundColor: "red", marginLeft: "10px" }}
            >
              {loading && action === "delete" ? "Deleting..." : "Delete"}
            </button>
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
          </div>
        </div>
      )}
    </div>
  );
}

export default Vehicles;