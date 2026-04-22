import { useState } from "react";
import ComponentForm from "../components/ComponentForm";
import ComponentList from "../components/ComponentList";
import {
  updateComponentPrice,
  deleteComponent,
} from "../services/api";

function ComponentManagement() {
  const [selected, setSelected] = useState(null);
  const [newPrice, setNewPrice] = useState("");

  // UPDATE PRICE
  const handleUpdate = async () => {
    if (!newPrice) {
      alert("Enter new price");
      return;
    }

    try {
      await updateComponentPrice(selected.id, {
        price: Number(newPrice),
      });

      alert("Price updated successfully");

      setSelected(null);
      setNewPrice("");

      window.location.reload(); // 🔥 simple refresh

    } catch (err) {
      alert(err.response?.data?.detail || "Error updating price");
    }
  };

  // DELETE COMPONENT
  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this component?"))
      return;

    try {
      await deleteComponent(selected.id);

      alert("Component deleted");

      setSelected(null);

      window.location.reload();

    } catch (err) {
      alert(err.response?.data?.detail || "Error deleting component");
    }
  };

  return (
    <div>
      <h3>Component Management</h3>

      {/* Add Component */}
      <ComponentForm />

      {/* Component Lists */}
      <ComponentList
        type="new"
        onSelect={setSelected}
        selected={selected}
      />

      <ComponentList
        type="repair"
        onSelect={setSelected}
        selected={selected}
      />

      {/* SELECTED COMPONENT ACTION */}
      {selected && (
        <div className="list-item">
          <h4>Manage Component</h4>

          <p><strong>Name:</strong> {selected.name}</p>
          <p><strong>Type:</strong> {selected.type}</p>
          <p><strong>Price:</strong> ₹{selected.price}</p>

          <div style={{ marginTop: "10px" }}>
            {/* Update Price */}
            <input
              type="number"
              placeholder="Enter new price"
              value={newPrice}
              onChange={(e) => setNewPrice(e.target.value)}
            />

            <button
              style={{ marginRight: "10px" }}
              onClick={handleUpdate}
            >
              Update Price
            </button>

            {/* Delete */}
            <button
              style={{ backgroundColor: "red", color: "white" }}
              onClick={handleDelete}
            >
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ComponentManagement;