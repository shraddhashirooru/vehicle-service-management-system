import { useEffect, useState } from "react";
import { getVehicles, getIssues } from "../services/api";

function Dashboard() {
  const [vehicles, setVehicles] = useState([]);
  const [issues, setIssues] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const v = await getVehicles();
      const i = await getIssues();

      setVehicles(v.data);
      setIssues(i.data);
    } catch (err) {
      console.error(err);
    }
  };

  // FILTER ONGOING (basic version)
  const ongoingIssues = issues.filter(i => i.status === "pending"); // later we improve with status

  return (
    <div className="container">
      <h2>User Dashboard</h2>

      {/* Ongoing Repairs */}
      <h3>Ongoing Repairs</h3>

      {ongoingIssues.length === 0 ? (
        <p>No ongoing repairs</p>
      ) : (
        ongoingIssues.map((i) => (
          <div key={i.id} className="list-item">
            Vehicle ID: {i.vehicle_id} <br />
            Issue: {i.description}
          </div>
        ))
      )}
    </div>
  );
}

export default Dashboard;