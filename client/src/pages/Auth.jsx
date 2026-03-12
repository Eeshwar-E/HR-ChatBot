import React, { useState } from "react";
import axios from "axios";
import API_BASE_URL from "../config/apiConfig";

const Auth = ({ setUser, setToken }) => {
  const [activeTab, setActiveTab] = useState("login");
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [forgotEmail, setForgotEmail] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [resetPassword, setResetPassword] = useState("");
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setInfo("");
    try {
      const res = await axios.post(`${API_BASE_URL}/auth/login`, {
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
    setInfo("");
    try {
      const res = await axios.post(`${API_BASE_URL}/auth/register`, {
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

  const handleForgot = async (e) => {
    e.preventDefault();
    setError("");
    setInfo("");
    try {
      const res = await axios.post(`${API_BASE_URL}/auth/forgot`, { email: forgotEmail });
      setInfo(res.data.message + (res.data.token ? ` (token: ${res.data.token})` : ''));
    } catch (err) {
      setError(err.response?.data?.error || "Request failed");
    }
  };

  const handleReset = async (e) => {
    e.preventDefault();
    setError("");
    setInfo("");
    try {
      const res = await axios.post(`${API_BASE_URL}/auth/reset`, { token: resetToken, newPassword: resetPassword });
      setInfo(res.data.message);
    } catch (err) {
      setError(err.response?.data?.error || "Reset failed");
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
        <button
          onClick={() => setActiveTab("forgot")}
          style={{
            flex: 1,
            padding: "12px 6px",
            background: activeTab === "forgot" ? "#e6efff" : "transparent",
            border: "none",
            fontWeight: activeTab === "forgot" ? 600 : 400
          }}
        >
          Forgot
        </button>
        <button
          onClick={() => setActiveTab("reset")}
          style={{
            flex: 1,
            padding: "12px 6px",
            background: activeTab === "reset" ? "#e6efff" : "transparent",
            border: "none",
            fontWeight: activeTab === "reset" ? 600 : 400
          }}
        >
          Reset
        </button>
      </div>
      {activeTab === "login" && (
        <form onSubmit={handleLogin}>
          <input value={loginEmail} onChange={e => setLoginEmail(e.target.value)} placeholder="Email" required style={{ width: "100%", margin: "10px 0", padding: 8 }} />
          <input value={loginPassword} onChange={e => setLoginPassword(e.target.value)} placeholder="Password" type="password" required style={{ width: "100%", margin: "10px 0", padding: 8 }} />
          {error && <div style={{ color: "red", marginBottom: 10 }}>{error}</div>}
          {info && <div style={{ color: "green", marginBottom: 10 }}>{info}</div>}
          <button type="submit" style={{ width: "100%", padding: 10 }}>Login</button>
        </form>
      )}
      {activeTab === "signup" && (
        <form onSubmit={handleSignup}>
          <input value={signupEmail} onChange={e => setSignupEmail(e.target.value)} placeholder="Email" required style={{ width: "100%", margin: "10px 0", padding: 8 }} />
          <input value={signupPassword} onChange={e => setSignupPassword(e.target.value)} placeholder="Password" type="password" required style={{ width: "100%", margin: "10px 0", padding: 8 }} />
          {error && <div style={{ color: "red", marginBottom: 10 }}>{error}</div>}
          {info && <div style={{ color: "green", marginBottom: 10 }}>{info}</div>}
          <button type="submit" style={{ width: "100%", padding: 10 }}>Signup</button>
        </form>
      )}
      {activeTab === "forgot" && (
        <form onSubmit={handleForgot}>
          <input value={forgotEmail} onChange={e => setForgotEmail(e.target.value)} placeholder="Email" required style={{ width: "100%", margin: "10px 0", padding: 8 }} />
          {error && <div style={{ color: "red", marginBottom: 10 }}>{error}</div>}
          {info && <div style={{ color: "green", marginBottom: 10 }}>{info}</div>}
          <button type="submit" style={{ width: "100%", padding: 10 }}>Request Reset</button>
        </form>
      )}
      {activeTab === "reset" && (
        <form onSubmit={handleReset}>
          <input value={resetToken} onChange={e => setResetToken(e.target.value)} placeholder="Reset Token" required style={{ width: "100%", margin: "10px 0", padding: 8 }} />
          <input value={resetPassword} onChange={e => setResetPassword(e.target.value)} placeholder="New Password" type="password" required style={{ width: "100%", margin: "10px 0", padding: 8 }} />
          {error && <div style={{ color: "red", marginBottom: 10 }}>{error}</div>}
          {info && <div style={{ color: "green", marginBottom: 10 }}>{info}</div>}
          <button type="submit" style={{ width: "100%", padding: 10 }}>Reset Password</button>
        </form>
      )}
    </div>
  );
};

export default Auth;
