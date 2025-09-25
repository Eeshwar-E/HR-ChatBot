import React, { useState, useEffect, useRef } from 'react';
import UploadForm from './components/UploadForm';
import ChatWindow from './components/ChatWindow';


// PercentProgressBar that fills smoothly and jumps to 100% at completion
const PercentProgressBar = ({ loading }) => {
  const [progress, setProgress] = useState(0);
  const intervalId = useRef(null);
  const INCREMENT_TIME_MS = 300;        
  const TOTAL_TIME = 53000;             // 53 seconds
  const STEP = 100 / (TOTAL_TIME / INCREMENT_TIME_MS);


  useEffect(() => {
    if (loading) {
      setProgress(0);
      intervalId.current = setInterval(() => {
        setProgress((prev) => {
          const next = prev + STEP;
          return next >= 99 ? 99 : next; // hold at 99% until done
        });
      }, INCREMENT_TIME_MS);
    } else {
      setProgress(100); // jump to 100% on completion
      if (intervalId.current) clearInterval(intervalId.current);
      // Reset after brief moment, so it can animate again next time
      setTimeout(() => setProgress(0), 800);
    }
    return () => {
      if (intervalId.current) clearInterval(intervalId.current);
    };
  }, [loading]);


  return (
    <div style={{
      width: '100%',
      height: '8px',
      marginBottom: 18,
      borderRadius: 6,
      background: '#e0e0e0',
      overflow: 'hidden',
      boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.1)'
    }}>
      <div style={{
        width: `${progress}%`,
        height: '100%',
        background: 'linear-gradient(90deg, #56CCF2 0%, #2F80ED 100%)',
        transition: 'width 0.3s ease-out',
        borderRadius: '6px 0 0 6px'
      }} />
    </div>
  );
};


const getInitialTheme = () => {
  if (typeof window !== 'undefined' && window.localStorage) {
    const stored = window.localStorage.getItem('theme');
    if (stored) return stored;
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) return 'dark';
  }
  return 'light';
};

const App = () => {
  const [response, setResponse] = useState(null);
  const [chatEnabled, setChatEnabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [theme, setTheme] = useState(getInitialTheme);

  useEffect(() => {
    document.body.style.background = theme === 'dark'
      ? 'linear-gradient(135deg, #23272f 0%, #2d3748 100%)'
      : 'linear-gradient(135deg, #6adeaaff 0%, #7df4beff 100%)';
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem('theme', theme);
    }
  }, [theme]);

  const handleEvaluationResponse = (data) => {
    setResponse(data);
    setChatEnabled(true);
  };

  const toggleTheme = () => setTheme((t) => (t === 'light' ? 'dark' : 'light'));

  // Use the exact color of the file input background in dark mode for the box
  const darkBoxColor = '#e5e6e9'; // file input bg
  const darkTextColor = '#23272f'; // readable on light bg
  const cardStyle = {
    maxWidth: '500px',
    margin: '0 auto',
    background: theme === 'dark' ? darkBoxColor : '#fff',
    color: theme === 'dark' ? darkTextColor : '#222',
    borderRadius: '16px',
    boxShadow: theme === 'dark'
      ? '0 6px 24px rgba(0,0,0,0.32)'
      : '0 6px 24px rgba(0,0,0,0.08)',
    padding: '36px 32px 28px',
    transition: 'background 0.3s, color 0.3s',
  };

  return (
    <div
      style={{
        minHeight: '605px',
        background: 'none',
        padding: '40px',
        fontFamily: 'Inter, Arial, sans-serif',
        transition: 'background 0.3s',
      }}
    >
      <div style={cardStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <h1 style={{ textAlign: 'center', marginBottom: 0, fontWeight: 700, letterSpacing: '-1px', fontSize: '2.3rem', color: theme === 'dark' ? darkTextColor : '#222' }}>
            <span role="img" aria-label="star" style={{ marginRight: 8 }}></span>
            Resume Evaluator
          </h1>
          <button
            onClick={toggleTheme}
            style={{
              marginLeft: 12,
              padding: '8px 12px',
              borderRadius: 8,
              background: theme === 'dark' ? '#374151' : '#e0e0e0',
              color: theme === 'dark' ? '#f1f1f1' : '#ffffff',
              fontWeight: 600,
              border: 'none',
              boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
              cursor: 'pointer',
              transition: 'background 0.2s, color 0.2s',
            }}
            aria-label="Toggle light/dark mode"
          >
            {theme === 'dark' ? '🌙' : '☀️'}
          </button>
        </div>

        {/* Show the loading bar only while loading is true */}
        {loading && <PercentProgressBar loading={loading} />}

        <section>
          <h2 style={{ fontSize: '1rem', marginBottom: '18px', fontWeight: 600, color: theme === 'dark' ? darkTextColor : '#34495e' }}>Upload Resume</h2>
          <UploadForm onResponse={handleEvaluationResponse} setLoading={setLoading} theme={theme} />
        </section>

        {chatEnabled && (
          <section style={{ marginTop: '40px' }}>
            <ChatWindow response={response} theme={theme} />
          </section>
        )}
      </div>
    </div>
  );
};


export default App;