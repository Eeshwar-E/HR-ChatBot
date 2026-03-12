import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate, useNavigate } from "react-router-dom";
import ResumeEvaluator from "./pages/ResumeEvaluator";
import Auth from "./pages/Auth";

// Navbar component
import { Link, useLocation } from "react-router-dom";

const NavBar = ({ token, onLogout }) => {
  const location = useLocation();

  // Helper function to check if the link is active
  const isActive = (path) => location.pathname === path;

  return (
    <nav
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "16px 32px",
        background: "#e6f0ff",
        boxShadow: "0 1px 12px rgba(70,130,200,.06)",
        width: "95.5vw",
        maxWidth: "100%",
        position: "relative",
        top: 0,
        left: 0,
        zIndex: 100,
        minHeight: 62,
        borderRadius: 0
      }}
    >
      <div style={{ display: "flex", gap: 24 }}>
        <Link
          to="/evaluator"
          style={{
            fontWeight: 600,
            color: "#285286",
            textDecoration: "none",
            padding: "7px 16px",
            borderRadius: 7,
            background: isActive("/evaluator") ? "#d7e8ff" : "transparent",
            transition: "background .16s"
          }}
        >
          Resume Evaluator
        </Link>
      </div>
      <div>
        {token ? (
          <button
            onClick={onLogout}
            style={{
              padding: "7px 18px",
              borderRadius: 8,
              fontWeight: 600,
              fontSize: "1rem",
              color: "#185299",
              background: "#e5efff",
              border: "1.2px solid #b2c5e5",
              boxShadow: "0 2px 7px #bcdcff44",
              cursor: "pointer",
              transition: "background .16s"
            }}
          >
            Logout
          </button>
        ) : (
          <Link
            to="/auth"
            style={{
              padding: "7px 16px",
              borderRadius: 8,
              background: "#e5f1fc",
              fontWeight: 600,
              color: "#294c6f",
              textDecoration: "none",
              border: "1.2px solid #b2c5e5"
            }}
          >
            Login/Signup
          </Link>
        )}
      </div>
    </nav>
  );
};

const AppContent = () => {
  const [token, setToken] = useState(localStorage.getItem("jwt") || "");
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const handleLogout = () => {
    setToken("");
    setUser(null);
    localStorage.removeItem("jwt");
    navigate("/auth");
  };

  // Only protected pages/routes after login
  if (!token) {
    return (
      <Routes>
        <Route path="*" element={<Auth setToken={setToken} setUser={setUser} />} />
      </Routes>
    );
  }

  return (
    <>
      <NavBar token={token} onLogout={handleLogout} />
      <Routes>
        <Route path="/evaluator" element={<ResumeEvaluator token={token} />} />
        <Route path="*" element={<Navigate to="/evaluator" />} />
      </Routes>
    </>
  );
};

const App = () => (
  <Router>
    <AppContent />
  </Router>
);

export default App;
