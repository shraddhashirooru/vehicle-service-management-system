// src/pages/Issues.jsx

import { useEffect, useState } from "react";
import {
  getIssues,
  updateIssue,
  deleteIssue,
  getComponents,
  updateIssueComponent,
  addComponentToIssue,
  deleteIssueComponent,
} from "../services/api";
import IssueForm from "../components/IssueForm";

function Issues() {
  const [issues, setIssues] = useState([]);
  const [selectedIssue, setSelectedIssue] = useState(null);

  const [editDescription, setEditDescription] = useState("");

  const [components, setComponents] = useState([]);
  const [resolutionType, setResolutionType] = useState("new");
  const [selectedComponent, setSelectedComponent] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [issueComponentId, setIssueComponentId] = useState(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  // Fetch Issues
  const fetchIssues = async () => {
    try {
      const res = await getIssues();
      setIssues(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchIssues();
  }, []);

  // Fetch components based on type
  useEffect(() => {
    fetchComponents();
  }, [resolutionType]);

  const fetchComponents = async () => {
    try {
      const res = await getComponents(resolutionType);
      setComponents(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // Select Issue
  const handleSelectIssue = (i) => {
    setError("");     // ✅ ADD HERE
    setMessage("");
    setSelectedIssue(i);
    setEditDescription(i.description);

    if (i.components && i.components.length > 0) {
      const ic = i.components[0];

      setIssueComponentId(ic.id);
      setSelectedComponent(ic.component_id);
      setQuantity(ic.quantity);
      setResolutionType(ic.component?.type || "new");
    } else {
      setIssueComponentId(null);
      setSelectedComponent("");
      setQuantity(1);
    }
  };

  

  // FULL UPDATE
  const handleFullUpdate = async () => {

    if (!editDescription.trim()) {
      alert("Description cannot be empty");
      return;
    }

    if (!selectedComponent) {
      setError("Select component");
      return;
    }

    if (quantity <= 0) {
      alert("Quantity must be greater than 0");
      return;
    }
    
    try {
      // ✅ Update issue
      await updateIssue(selectedIssue.id, {
        vehicle_id: selectedIssue.vehicle_id,
        description: editDescription,
      });

      // 🔥 ADD YOUR NEW LOGIC HERE
      if (issueComponentId) {
        const existingComponentId =selectedIssue?.components?.length > 0 ? selectedIssue.components[0].component_id : null;

        if (Number(selectedComponent) === existingComponentId) {

          await updateIssueComponent(issueComponentId, {
            quantity: Number(quantity),
          });

        } else {

          await deleteIssueComponent(issueComponentId);

          await addComponentToIssue({
            issue_id: selectedIssue.id,
            component_id: Number(selectedComponent),
            quantity: Number(quantity),
          });
        }

      } else {

        await addComponentToIssue({
          issue_id: selectedIssue.id,
          component_id: Number(selectedComponent),
          quantity: Number(quantity),
        });
      }

      setMessage("Issue updated successfully");
      setError("");
      setSelectedIssue(null);        // ✅ CLOSE EDIT PANEL
      setSelectedComponent("");      // ✅ RESET
      setQuantity(1);
      fetchIssues();

    } catch (err) {
      alert(err.message || "Error");
    }
  };

  const handleDelete = async () => {
    try {
      await deleteIssue(selectedIssue.id);

      setMessage("Issue deleted successfully");
      setError("");
      setSelectedIssue(null);
      fetchIssues();
    } catch (err) {
        alert(err.message || "Error");
    }
  };

  return (
    <div className="container">
      <h2>Issues</h2>

      {/* Add Issue */}
      <IssueForm onSuccess={fetchIssues} />

      <h3>Issue List</h3>

      {issues.length === 0 ? (
        <p>No issues available</p>
      ) : (
        issues.map((i) => (
          <div
            key={i.id}
            className="list-item"
            onClick={() => handleSelectIssue(i)}
            style={{
              cursor: "pointer",
              backgroundColor:
                selectedIssue?.id === i.id ? "#dff0ff" : "",
            }}
          >
            <strong>Vehicle:</strong> {i.vehicle?.vehicle_number || i.vehicle_id} <br />
            <strong>Issue:</strong> {i.description}
          </div>
        ))
      )}

      {/* DETAILS and EDIT */}
      {selectedIssue && (
        <div className="list-item">
          <h3>Issue Details</h3>

          <strong>Vehicle:</strong> {selectedIssue.vehicle?.vehicle_number || selectedIssue.vehicle_id}
          <p><strong>Description:</strong> {selectedIssue.description}</p>

          {/* Components */}
          <h4>Components</h4>

          {selectedIssue.components && selectedIssue.components.length > 0 ? (
            selectedIssue.components.map((ic) => (
              <div key={ic.id}>
                <p><strong>Name:</strong> {ic.component?.name || "N/A"}</p>
                <p><strong>Type:</strong> {ic.component?.type || "N/A"}</p>
                <p><strong>Quantity:</strong> {ic.quantity}</p>
                <hr />
              </div>
            ))
          ) : (
            <p>No components added</p>
          )}

          {/* EDIT */}
          <h3>Edit Issue</h3>

          <input
            value={editDescription}
            onChange={(e) => {
              setEditDescription(e.target.value);
              setMessage("");   // ✅ clear old message
              setError("");     // ✅ clear old error
            }}
          />

          <select
            value={resolutionType}
            onChange={(e) => setResolutionType(e.target.value)}
          >
            <option value="new">New</option>
            <option value="repair">Repair</option>
          </select>

          <select
            value={selectedComponent}
            onChange={(e) => setSelectedComponent(e.target.value)}
          >
            <option value="">Select Component</option>

            {components.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} - ₹{c.price}
              </option>
            ))}
          </select>

          <input
            type="number"
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
          />

          <div style={{ marginTop: "10px" }}>
            <button onClick={handleFullUpdate}>
              Update
            </button>

            <button
              onClick={handleDelete}
              style={{
                backgroundColor: "red",
                marginLeft: "10px",
              }}
            >
              Delete
            </button>
          </div>
          {message && <p style={{ color: "green" }}>{message}</p>}
          {error && <p style={{ color: "red" }}>{error}</p>}
        </div>
      )}
    </div>
  );
}

export default Issues;