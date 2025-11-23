import React from "react";

const outerBox = {
  margin: "16px 0",           // vertical margin for separation
  display: "flex",
  alignItems: "center",
  justifyContent: "center",   // center horizontally
  gap: 10,                    // reduced gap for compactness
  width: "fit-content",       // shrink to content width only
  marginLeft: "auto",
  marginRight: "auto"
};

const labelStyles = {
  fontWeight: 600,
  fontSize: "1rem",          // slightly smaller font
  color: "#294c6f",
  letterSpacing: ".01em",
  userSelect: "none"         // prevents accidental text selection on label
};

const selectStyles = {
  fontSize: "1rem",          // slightly smaller font for select
  padding: "6px 16px 6px 10px", // reduced padding for smaller size
  borderRadius: 8,
  border: "1.5px solid #b2c5e5",
  background: "#f5fafe",
  color: "#213950",
  fontWeight: 500,
  outline: "none",
  boxShadow: "0 2px 7px rgba(60,120,180,0.07)",
  cursor: "pointer",
  minWidth: 140               // fixed minimum width for consistency
};

const ModelSelector = ({ model, setModel }) => (
  <div style={outerBox}>
    <label htmlFor="model-select" style={labelStyles}>
      Select Model:
    </label>
    <select
      id="model-select"
      value={model}
      onChange={e => setModel(e.target.value)}
      style={selectStyles}
    >
      <option value="phi3">Phi3</option>
      <option value="gemini">Gemini</option>
    </select>
  </div>
);

export default ModelSelector;
