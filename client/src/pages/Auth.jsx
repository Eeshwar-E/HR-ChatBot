import React, { useState } from "react";
import axios from "axios";

const Auth = ({ setUser, setToken }) => {
  const [activeTab, setActiveTab] = useState("login");
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await axios.post("http://localhost:5000/auth/login", {
        email: loginEmail,
        password: loginPassword
      });
      const { token, user } = res.data;
      setUser(user);
      setToken(token);
      localStorage.setItem("jwt", token);
    } catch (err) {
      setError(err.response?.data?.error || "Login failed");
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await axios.post("http://localhost:5000/auth/register", {
        email: signupEmail,
        password: signupPassword,
      });
      const { token, user } = res.data;
      setUser(user);
      setToken(token);
      localStorage.setItem("jwt", token);
    } catch (err) {
      setError(err.response?.data?.error || "Signup failed");
    }
  };

  return (
    <div style={{ width: 320, margin: "60px auto", padding: 28, background: "#f7f8fb", borderRadius: 12 }}>
      <div style={{ display: "flex", marginBottom: 24, borderBottom: "1px solid #bbb" }}>
        <button
          onClick={() => setActiveTab("login")}
          style={{
            flex: 1,
            padding: "12px 6px",
            background: activeTab === "login" ? "#e6efff" : "transparent",
            border: "none",
            fontWeight: activeTab === "login" ? 600 : 400
          }}
        >
          Login
        </button>
        <button
          onClick={() => setActiveTab("signup")}
          style={{
            flex: 1,
            padding: "12px 6px",
            background: activeTab === "signup" ? "#e6efff" : "transparent",
            border: "none",
            fontWeight: activeTab === "signup" ? 600 : 400
          }}
        >
          Signup
        </button>
      </div>
      {activeTab === "login" && (
        <form onSubmit={handleLogin}>
          <input value={loginEmail} onChange={e => setLoginEmail(e.target.value)} placeholder="Email" required style={{ width: "100%", margin: "10px 0", padding: 8 }} />
          <input value={loginPassword} onChange={e => setLoginPassword(e.target.value)} placeholder="Password" type="password" required style={{ width: "100%", margin: "10px 0", padding: 8 }} />
          {error && <div style={{ color: "red", marginBottom: 10 }}>{error}</div>}
          <button type="submit" style={{ width: "100%", padding: 10 }}>Login</button>
        </form>
      )}
      {activeTab === "signup" && (
        <form onSubmit={handleSignup}>
          <input value={signupEmail} onChange={e => setSignupEmail(e.target.value)} placeholder="Email" required style={{ width: "100%", margin: "10px 0", padding: 8 }} />
          <input value={signupPassword} onChange={e => setSignupPassword(e.target.value)} placeholder="Password" type="password" required style={{ width: "100%", margin: "10px 0", padding: 8 }} />
          {error && <div style={{ color: "red", marginBottom: 10 }}>{error}</div>}
          <button type="submit" style={{ width: "100%", padding: 10 }}>Signup</button>
        </form>
      )}
    </div>
  );
};

export default Auth;
