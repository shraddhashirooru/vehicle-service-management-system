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
    try {
      // Update issue
      await updateIssue(selectedIssue.id, {
        vehicle_id: selectedIssue.vehicle_id,
        description: editDescription,
      });

      // Delete old component
      if (issueComponentId) {
        await deleteIssueComponent(issueComponentId);
      }

      // Add new component
      if (selectedComponent) {
        await addComponentToIssue({
          issue_id: selectedIssue.id,
          component_id: Number(selectedComponent),
          quantity: Number(quantity),
        });
      }

      alert("Issue updated successfully");

      setSelectedIssue(null);
      fetchIssues();
    } catch (err) {
      alert(err.response?.data?.detail || "Error");
    }
  };

  // Delete Issue
  const handleDelete = async () => {
    try {
      await deleteIssue(selectedIssue.id);

      alert("Issue deleted");
      setSelectedIssue(null);
      fetchIssues();
    } catch (err) {
      alert(err.response?.data?.detail || "Error");
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
            <strong>Vehicle ID:</strong> {i.vehicle_id} <br />
            <strong>Issue:</strong> {i.description}
          </div>
        ))
      )}

      {/* DETAILS and EDIT */}
      {selectedIssue && (
        <div className="list-item">
          <h3>Issue Details</h3>

          <p><strong>Vehicle ID:</strong> {selectedIssue.vehicle_id}</p>
          <p><strong>Description:</strong> {selectedIssue.description}</p>

          {/* Components */}
          <h4>Components</h4>

          {selectedIssue.components && selectedIssue.components.length > 0 ? (
            selectedIssue.components.map((ic) => (
              <div key={ic.id}>
                <p><strong>Name:</strong> {ic.component?.name}</p>
                <p><strong>Type:</strong> {ic.component?.type}</p>
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
            onChange={(e) => setEditDescription(e.target.value)}
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
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
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
        </div>
      )}
    </div>
  );
}

export default Issues;