import { useEffect, useState } from "react";
import { getComponents } from "../services/api";

function ComponentList({ type, onSelect, selected }) {
  const [components, setComponents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchComponents = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await getComponents();

      const filtered = res.data.filter(
        (c) =>
          c.type.toLowerCase() ===
          type.trim().toLowerCase()
      );

      setComponents(filtered);
    } catch (err) {
      setError("Unable to load components");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComponents();
  }, [type]);


  return (
    <div>
      <h3>{type?.toUpperCase()} Components</h3>

      {loading && <p>Loading components...</p>}
      {error && (<p style={{ color: "red", marginTop: "10px",}}>{error}</p>)}
      

      {!loading && !error && components.length === 0 ? (
        <p><p>No {type?.toLowerCase()} components</p></p>
      ) : (
        components.map((c) => (
          <div
            key={c.id}
            className="list-item"
            onClick={() => !loading && onSelect?.(c)}
            style={{
              cursor: onSelect && !loading ? "pointer" : "default",
              backgroundColor:
                selected?.id === c.id ? "#dff0ff" : "",
            }}
          >
            {c.name} - ₹{Number(c.price).toFixed(2)}
          </div>
        ))
      )}
    </div>
  );
}

export default ComponentList;