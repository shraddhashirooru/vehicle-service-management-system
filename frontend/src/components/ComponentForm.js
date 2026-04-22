import { useState } from "react";
import { createComponent } from "../services/api";

function ComponentForm() {
  const [name, setName] = useState("");
  const [type, setType] = useState("new");
  const [price, setPrice] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (!name || !price) {
    setError("All fields are required");
    return;
  }

  try {
    await createComponent({
      name,
      type,
      price: Number(price),
    });

    alert("Component added");

    setName("");
    setType("new");
    setPrice("");
    setError(""); 

  } catch (err) {
    setError(err.response?.data?.detail || "Error");
  }
};

  return (
    <form onSubmit={handleSubmit}>
      <h3>Add Component</h3>

      <input
        placeholder="Component Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <select value={type} onChange={(e) => setType(e.target.value)}>
        <option value="new">New</option>
        <option value="repair">Repair</option>
      </select>

      <input
        type="number"
        placeholder="Price"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
      />

      <button type="submit">Add</button>

      {/* ADD THIS HERE */}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </form>
  );
}

export default ComponentForm;