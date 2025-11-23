import React, { useState } from "react";
import axios from "axios";

const UploadForm = ({ onResponse, setLoading, model, token }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [resume, setResume] = useState(null);

  const handleSubmit = async e => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("role", role);
    formData.append("resume", resume);
    formData.append("model", model);

    try {
      setLoading(true);
      const res = await axios.post("http://localhost:5000/upload", formData, {
        headers: {
          Authorization: "Bearer " + token
        }
      });
      onResponse(res.data, resume);
    } catch (err) {
      onResponse(err.response?.data?.error || "Upload failed", resume);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        maxWidth: 440,
        width: "100%",
        margin: "38px auto 0 auto",
        background: "linear-gradient(121deg, #e9f2fc 0%, #f9f9fa 100%)",
        borderRadius: 20,
        boxShadow: "0 2.5px 18px 0 #a0bee944",
        padding: "30px 32px 28px 32px"
      }}
    >
      <h2 style={{
        textAlign: "center",
        fontSize: 25,
        color: "#255476",
        fontWeight: 700,
        marginBottom: 20,
        letterSpacing: ".03em"
      }}>
        Candidate Details
      </h2>
      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 17
        }}
      >
        <fieldset
          style={{
            border: "none",
            padding: 0,
            margin: 0,
            display: "flex",
            flexDirection: "column",
            gap: 12
          }}
        >
          <label style={{ color: "#324869", fontWeight: 500 }}>
            Name
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "7px 11px",
                borderRadius: 7,
                border: "1.4px solid #b2c5e5",
                marginTop: 3,
                fontSize: "1rem"
              }}
            />
          </label>
          <label style={{ color: "#324869", fontWeight: 500 }}>
            Email
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "7px 11px",
                borderRadius: 7,
                border: "1.4px solid #b2c5e5",
                marginTop: 3,
                fontSize: "1rem"
              }}
            />
          </label>
          <label style={{ color: "#324869", fontWeight: 500 }}>
            Role
            <input
              type="text"
              value={role}
              onChange={e => setRole(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "7px 11px",
                borderRadius: 7,
                border: "1.4px solid #b2c5e5",
                marginTop: 3,
                fontSize: "1rem"
              }}
            />
          </label>
          <label style={{ color: "#324869", fontWeight: 500 }}>
            Resume (PDF)
            <input
              type="file"
              id="resume-upload-field"
              accept=".pdf"
              onChange={e => setResume(e.target.files[0])}
              required
              style={{
                marginTop: 3
              }}
            />
          </label>
        </fieldset>
        <button
          type="submit"
          style={{
            marginTop: 12,
            padding: "9px 0",
            borderRadius: 9,
            background: "linear-gradient(94deg, #637cff 40%, #489ad9 90%)",
            color: "white",
            fontWeight: 600,
            fontSize: "1.05rem",
            border: "none",
            letterSpacing: ".01em",
            boxShadow: "0 2px 9px #bcdcff55",
            cursor: "pointer"
          }}
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default UploadForm;
