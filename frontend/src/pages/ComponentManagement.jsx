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
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // UPDATE PRICE
  const showMessage = (text, error = false) => {
    setMessage(text);
    setIsError(error);

    setTimeout(() => {
      setMessage("");
    }, 3000);
  };

  const handleUpdate = async () => {
    if (!newPrice) {
      showMessage("Enter new price", true);
      return;
    }

    if (Number(newPrice) <= 0) {
      showMessage("Enter valid price", true);
      return;
    }

    setUpdating(true);


    try {
      await updateComponentPrice(selected.id, {
        price: Number(newPrice),
      });

      showMessage("Price updated successfully");

      setSelected(null);
      setNewPrice("");
      setRefreshKey((prev) => prev + 1); // simple refresh

    } catch (err) {
      showMessage(
        err.response?.data?.detail || "Error updating price",
        true
      );
    } finally {
      setUpdating(false);
    }
  };

  // DELETE COMPONENT
  const handleDelete = async () => {
    if (!window.confirm("Delete this component?"))
      return;
    
    setDeleting(true);

    try {
      await deleteComponent(selected.id);

      showMessage("Component deleted");

      setSelected(null);
      setRefreshKey((prev) => prev + 1);

    } catch (err) {
      showMessage(
        err.response?.data?.detail || "Error deleting component",
        true
      );
    } finally {
      setDeleting(false);
    }
  };

  const handleSelect = (item) => {
    setSelected(item);
    setMessage("");
    setIsError(false);
    setNewPrice("");
  };

  return (
    <div>
      <h3>Component Management</h3>

      {/* Add Component */}
      <ComponentForm />

      {/* Component Lists */}
      <ComponentList
        key={`new-${refreshKey}`}
        type="new"
        onSelect={handleSelect}         
        selected={selected}
      />

      <ComponentList
        key={`repair-${refreshKey}`}
        type="repair"
        onSelect={handleSelect}
        selected={selected}
      />

      {/* Message */}
      {message && (
        <p style={{ color: isError ? "red" : "green", fontWeight: "bold", marginTop: "10px" }}>
          {message}
        </p>
      )}


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
              min="1"
              step="1"
              placeholder="Enter new price"
              value={newPrice}
              onChange={(e) => setNewPrice(e.target.value)}
              disabled={updating || deleting}
            />

            <button
              style={{ marginRight: "10px" }}
              onClick={handleUpdate}
              disabled={updating || deleting || !selected}
            >
              {updating ? "Updating..." : "Update Price"}
            </button>

            {/* Delete */}
            <button
              style={{ backgroundColor: "red", color: "white", marginLeft: "10px" }}
              onClick={handleDelete}
              disabled={updating || deleting}
            >
              {deleting ? "Deleting..." : "Delete"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ComponentManagement;