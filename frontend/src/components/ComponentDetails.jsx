import { useState } from "react";
import { deleteComponent, updateComponentPrice } from "../services/api";

function ComponentDetails({ component, refresh }) {
  const [price, setPrice] = useState(component.price);

  const handleUpdate = async () => {
    try {
      await updateComponentPrice(component.id, { price });
      alert("Updated");
      refresh();
    } catch (err) {
      alert("Error updating");
    }
  };

  const handleDelete = async () => {
    try {
      await deleteComponent(component.id);
      alert("Deleted");
      refresh();
    } catch (err) {
      alert("Error deleting");
    }
  };

  return (
    <div className="list-item">
      <h3>{component.name}</h3>
      <p>Type: {component.type}</p>

      <input
        type="number"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
      />

      <button onClick={handleUpdate}>Update Price</button>
      <button onClick={handleDelete}>Delete</button>
    </div>
  );
}

export default ComponentDetails;