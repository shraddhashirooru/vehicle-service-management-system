import { useEffect, useState } from "react";
import { getVehicles, getIssues } from "../services/api";

function AdminVehicles() {
  const [vehicles, setVehicles] = useState([]);
  const [issues, setIssues] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const v = await getVehicles();
    const i = await getIssues();

    setVehicles(v.data);
    setIssues(i.data);
  };

  return (
    <div>
      <h3>Vehicle Repairs</h3>

      {vehicles.map((v) => (
        <div key={v.id} className="list-item">
          <strong>{v.vehicle_number}</strong> - {v.owner_name}

          <div style={{ marginLeft: "10px" }}>
            {issues
              .filter((i) => i.vehicle_id === v.id)
              .map((i) => (
                <div key={i.id}>
                  • {i.description}
                </div>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default AdminVehicles;