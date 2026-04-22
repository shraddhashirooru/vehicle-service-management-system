import { useEffect, useState } from "react";
import { getIssues } from "../services/api";

function RepairOrders() {
  const [repairs, setRepairs] = useState([]);

  useEffect(() => {
    fetchRepairs();
  }, []);

  const fetchRepairs = async () => {
    const res = await getIssues();

    // 🔥 filter repair type
    const filtered = res.data.filter((i) =>
      i.components?.some((c) => c.type === "repair")
    );

    setRepairs(filtered);
  };

  return (
    <div>
      <h4>Repair Orders</h4>

      {repairs.length === 0 ? (
        <p>No repairs</p>
      ) : (
        repairs.map((r) => (
          <div key={r.id} className="list-item">
            Vehicle: {r.vehicle_id} <br />
            Issue: {r.description}

            <button>Mark as Completed</button>
          </div>
        ))
      )}
    </div>
  );
}

export default RepairOrders;