// src/pages/Vehicles.jsx

import { useEffect, useState } from "react";
import { getVehicles } from "../services/api";
import VehicleForm from "../components/VehicleForm";

function Vehicles() {
  const [vehicles, setVehicles] = useState([]);

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

  return (
    <div className="container">
      <h2>Vehicles</h2>

      <VehicleForm />

      <h3>Vehicle List</h3>

      {vehicles.length === 0 ? (
        <p>No vehicles added</p>
      ) : (
        vehicles.map((v) => (
          <div className="list-item" key={v.id}>
            <strong>{v.vehicle_number}</strong> <br />
            Owner: {v.owner_name}
          </div>
        ))
      )}
    </div>
  );
}

export default Vehicles;