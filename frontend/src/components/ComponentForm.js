import { useState } from "react";
import { createComponent } from "../services/api";

function ComponentForm() {
  const [name, setName] = useState("");
  const [type, setType] = useState("new");
  const [price, setPrice] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const isError =
    message &&
    ["error", "required", "invalid", "exist"].some((word) =>
      message.toLowerCase().includes(word)
    );

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (!name.trim() || !price.trim()) {
    setMessage("All fields are required");
    return;
  }
  if (Number(price) <= 0) {
    setMessage("Enter valid price");
    return;
  }

  try {
    setLoading(true);
    setMessage("");
    await createComponent({
      name: name.trim(),
      type,
      price: Number(price),
    });

    setMessage("Component added successfully");
    setTimeout(() => {
      setMessage("");
    }, 10000);

    setName("");
    setType("new");
    setPrice("");

  } catch (err) {
    setMessage(err.response?.data?.detail || err.message || "Error adding component");
  } finally {
    setLoading(false);
  }
};

  return (
    <form onSubmit={handleSubmit}>
      <h3>Add Component</h3>

      <input
        autoFocus
        disabled={loading}
        placeholder="Component Name"
        value={name}
        onChange={(e) => {
          setName(e.target.value); 
          setMessage("");
        }}
      />

      <select 
        value={type} 
        disabled={loading} 
        onChange={(e) => {
          setType(e.target.value); 
          setMessage("");
        }}>
        <option value="new">New</option>
        <option value="repair">Repair</option>
      </select>

      <input
        type="number"
        min="1"
        placeholder="Price"
        value={price}
        disabled={loading}
        onChange={(e) => {
          setPrice(e.target.value); 
          setMessage("");
        }}
      />

      <button type="submit" disabled={loading || !name.trim() || !price.trim() || Number(price) <= 0}>  
        {loading ? "Adding..." : "Add Component"}
      </button>

      {message && (
        <p
          style={{
            color: isError ? "red" : "green",
            marginTop: "10px",
          }}
        >
          {message}
        </p>
      )}
    </form>
  );
}

export default ComponentForm;