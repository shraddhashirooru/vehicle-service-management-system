import { useEffect, useState } from "react";
import { getComponents } from "../services/api";

function ComponentList({ type, onSelect, selected }) {
  const [components, setComponents] = useState([]);

  useEffect(() => {
    fetchComponents();
  }, [type]);

  const fetchComponents = async () => {
    try {
      const res = await getComponents();

      const filtered = res.data.filter(
        (c) => c.type === type
      );

      setComponents(filtered);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h3>{type.toUpperCase()} Components</h3>

      {components.length === 0 ? (
        <p>No {type} components</p>
      ) : (
        components.map((c) => (
          <div
            key={c.id}
            className="list-item"
            onClick={() => onSelect && onSelect(c)}
            style={{cursor: "pointer", backgroundColor: selected?.id === c.id ? "#dff0ff" : ""}}
          >
            {c.name} - ₹{c.price}
          </div>
        ))
      )}
    </div>
  );
}

export default ComponentList;