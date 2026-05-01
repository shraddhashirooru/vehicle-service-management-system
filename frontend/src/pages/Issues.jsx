// src/pages/Issues.jsx

import { useEffect, useState, useRef } from "react";
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
  const [loading, setLoading] = useState(false);
  const [action, setAction] = useState(null);

  const timerRef = useRef(null);

  const clearTimer = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

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

  useEffect(() => {
    return () => clearTimer();
  }, []);

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
    setError("");     
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
      setError("Description cannot be empty");
      return;
    }

    if (!selectedComponent) {
      setError("Select component");
      return;
    }

    if (quantity <= 0) {
      setError("Quantity must be greater than 0");
      return;
    }
    
    try {
      setLoading(true);
      setAction("update");
      setError("");
      setMessage("");
      // Update issue
      await updateIssue(selectedIssue.id, {
        vehicle_id: selectedIssue.vehicle_id,
        description: editDescription.trim(),
      });

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
      clearTimer();

      timerRef.current = setTimeout(() => {
        setMessage("");
      }, 10000);

      setError("");
      setSelectedIssue(null);        
      setSelectedComponent("");      
      setQuantity(1);
      await fetchIssues();
      setResolutionType("new");

    } catch (err) {
      setError(err.message || "Error updating issue");
    } finally {
      setLoading(false);
      setAction(null);
    }
  };

  const handleDelete = async () => {
    try {
      setLoading(true);
      setAction("delete");
      setError("");
      setMessage("");
      await deleteIssue(selectedIssue.id);
      setMessage("Issue deleted successfully");
      clearTimer();
      timerRef.current = setTimeout(() => {
        setMessage("");
      }, 2000);
      setSelectedIssue(null);
      await fetchIssues();
      setResolutionType("new");
    } catch (err) {
        setError(err.message || "Error deleting issue");
    } finally {
      setLoading(false);
      setAction(null);
    }
  };

  return (
    <div className="container">
      <h2>Vehicle Issues Management</h2>

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
            onClick={() => !loading && handleSelectIssue(i)}
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
            autoFocus 
            disabled={loading} 
            value={editDescription}
            onChange={(e) => {
              clearTimer();
              setEditDescription(e.target.value);
              setMessage("");   // clear old message
              setError("");     // clear old error
            }}
          />

          <select
            disabled={loading} 
            value={resolutionType}
            onChange={(e) => {clearTimer(); setResolutionType(e.target.value); setMessage(""); setError("");}}
          >
            <option value="new">New</option>
            <option value="repair">Repair</option>
          </select>

          <select
            disabled={loading} 
            value={selectedComponent}
            onChange={(e) => {clearTimer(); setSelectedComponent(e.target.value); setMessage(""); setError("");}}
          >
            <option value="">Select Component</option>

            {components.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} - ₹{c.price}
              </option>
            ))}
          </select>

          <input
            disabled={loading} 
            type="number"
            min="1"
            value={quantity}
            onChange={(e) => {clearTimer(); setQuantity(e.target.value === "" ? "" : Number(e.target.value)); setMessage(""); setError("");}}
          />

          <div style={{ marginTop: "10px" }}>
            <button   onClick={handleFullUpdate} disabled={loading}>
            {loading && action === "update" ? "Updating..." : "Update"}
            </button>

            <button onClick={handleDelete} disabled={loading} style={{ backgroundColor: "red", marginLeft: "10px",}}>
            {loading && action === "delete" ? "Deleting..." : "Delete"}
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