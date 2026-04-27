import { useState, useEffect } from "react";
import { deleteComponent, updateComponentPrice } from "../services/api";

function ComponentDetails({ component, refresh }) {
  const [price, setPrice] = useState(component.price);
  const [loading, setLoading] = useState(false);
  const [action, setAction] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    setPrice(component.price);
    setMessage("");
  }, [component]);

  const isError =
    message &&
    ["error", "invalid"].some((word) =>
      message.toLowerCase().includes(word)
    );

  const unchanged =
    price !== "" &&
    Number(price) === Number(component.price);


  const handleUpdate = async () => {
    if (!price || Number(price) <= 0) {
        setMessage("Enter valid price");
        return;
      }
    try {
      setLoading(true);
      setAction("update");   
      setMessage(""); 
      await updateComponentPrice(component.id, { price: Number(price) });
      setMessage("Price updated successfully");
      refresh();

    } catch (err) {
      setMessage(err.response?.data?.detail || err.message || "Error updating");
    } finally {
      setLoading(false);
      setAction(null);
    }
  };

  const handleDelete = async () => {
 
    try {
      setLoading(true);
      setAction("delete");
      setMessage("");
      await deleteComponent(component.id);
      setMessage("Component deleted successfully");
      refresh();
    } catch (err) {
      setMessage(err.message || "Error deleting");
    } finally {
      setLoading(false);
      setAction(null);
    }
  };

  return (
    <div className="list-item">
      <h3>{component.name}</h3>
      <p>Type: {component.type}</p>

      <input
        autoFocus 
        min="1"
        type="number"
        value={price}
        disabled={loading}
        onChange={(e) => {setPrice(e.target.value); setMessage("");}}
      />

      <button onClick={handleUpdate} disabled={loading || unchanged}>
        {loading && action === "update"
          ? "Updating..."
          : "Update Price"}
      </button>
      <button onClick={handleDelete} disabled={loading}
        style={{
          backgroundColor: "red",
          marginLeft: "10px",
        }}
      >
        {loading && action === "delete"
          ? "Deleting..."
          : "Delete"}
      </button>
      {message && (
        <p style={{ color: isError ? "red" : "green", marginTop: "10px", }}>
          {message}
        </p>
      )}
    </div>
  );
}

export default ComponentDetails;