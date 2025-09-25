import React, { useState } from 'react';
import axios from 'axios';


const UploadForm = ({ onResponse, setLoading, theme }) => {
  const darkTextColor = '#23272f';
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const [resume, setResume] = useState(null);


  const handleSubmit = async (e) => {
    e.preventDefault();


    const formData = new FormData();
    formData.append('name', name);
    formData.append('email', email);
    formData.append('role', role);
    formData.append('resume', resume);


    try {
      setLoading(true); // ✅ Start the loading bar
      const res = await axios.post('http://localhost:5000/upload', formData);
      onResponse(res.data);
    } catch (err) {
      const error = err.response?.data?.error || 'Upload failed';
      onResponse({ error });
    } finally {
      setLoading(false); // ✅ Stop the loading bar
    }
  };


  return (
    <form
      onSubmit={handleSubmit}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '17px',
        padding: '0 8px'
      }}
    >
      <fieldset
        style={{
          border: 'none',
          padding: 0,
          margin: 0,
          background: 'none'
        }}
      >
        <legend style={{ fontWeight: 600, marginBottom: 4, fontSize: '1rem', color: theme === 'dark' ? darkTextColor : '#222' }}>
          Candidate Details
        </legend>


        <label style={{ fontSize: 15, marginBottom: 2, color: theme === 'dark' ? darkTextColor : '#444' }}>
          Name:
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            required
            style={{
              width: '100%',
              marginTop: 3,
              marginBottom: 7,
              padding: '10px',
              fontSize: '15px',
              border: '1px solid #beccd6',
              borderRadius: '7px',
            }}
          />
        </label>


        <label style={{ fontSize: 15, marginBottom: 2, color: theme === 'dark' ? darkTextColor : '#444' }}>
          Email:
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            style={{
              width: '100%',
              marginTop: 3,
              marginBottom: 7,
              padding: '10px',
              fontSize: '15px',
              border: '1px solid #beccd6',
              borderRadius: '7px',
            }}
          />
        </label>


        <label style={{ fontSize: 15, marginBottom: 2, color: theme === 'dark' ? darkTextColor : '#444' }}>
          Role:
          <input
            type="text"
            value={role}
            onChange={e => setRole(e.target.value)}
            required
            style={{
              width: '100%',
              marginTop: 3,
              marginBottom: 7,
              padding: '10px',
              fontSize: '15px',
              border: '1px solid #beccd6',
              borderRadius: '7px',
            }}
          />
        </label>


        <label style={{ fontSize: 15, color: theme === 'dark' ? darkTextColor : '#444', marginBottom: 2 }}>
          Resume (PDF):
            <input
              type="file"
              accept=".pdf"
              onChange={e => setResume(e.target.files[0])}
              required
              style={{
                marginTop: 2,
                marginBottom: 10,
                fontSize: 15,
                color: theme === 'dark' ? '#fff' : '#222',
                background: theme === 'dark' ? '#23272f' : '#fff',
                border: 'none',
                padding: '6px 0',
                // Hide default file input text in dark mode
                filter: theme === 'dark' ? 'invert(1) grayscale(1)' : 'none',
                width: 'auto',
                maxWidth: '100%',
              }}
            />
        </label>


        <button
          type="submit"
          style={{
            marginTop: '14px',
            padding: '11px 0',
            width: '130px',
            alignSelf: 'flex-end',
            background: 'linear-gradient(90deg, #56CCF2 0%, #2F80ED 100%)',
            color: '#fff',
            fontWeight: 600,
            fontSize: '16px',
            border: 'none',
            borderRadius: '7px',
            boxShadow: '0 2px 8px rgba(44, 62, 80, 0.05)',
            cursor: 'pointer',
            transition: 'background 0.2s',
          }}
        >
          Submit
        </button>
      </fieldset>
    </form>
  );
};


export default UploadForm;