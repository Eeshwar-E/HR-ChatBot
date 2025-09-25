import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';


// Typing indicator with animated dots
const TypingIndicator = () => (
  <div style={{ display: 'flex', gap: '4px', padding: '0 5px' }}>
    <span style={dotStyle(0)}></span>
    <span style={dotStyle(0.2)}></span>
    <span style={dotStyle(0.4)}></span>
  </div>
);


const dotStyle = (delay = 0) => ({
  width: '6px',
  height: '6px',
  borderRadius: '50%',
  backgroundColor: '#34a853',
  animation: 'dotFlashing 1s infinite ease-in-out',
  animationDelay: `${delay}s`
});


// Inject keyframe animation once globally
const injectKeyframes = () => {
  if (typeof window !== 'undefined' && document && !document.getElementById('dotFlashingKeyframe')) {
    const style = document.createElement('style');
    style.id = 'dotFlashingKeyframe';
    style.innerHTML = `
      @keyframes dotFlashing {
        0% { opacity: 0.2; transform: scale(1); }
        50% { opacity: 1; transform: scale(1.4); }
        100% { opacity: 0.2; transform: scale(1); }
      }
    `;
    document.head.appendChild(style);
  }
};
injectKeyframes();


const ChatWindow = ({ response }) => {
  // Initialize messages with evaluation if present
  const [messages, setMessages] = useState(() => {
    if (response?.evaluation) {
      return [{ sender: 'bot', text: response.evaluation }];
    }
    return [];
  });
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);


  // Reset messages whenever a new "response" with evaluation arrives
  useEffect(() => {
    if (response?.evaluation) {
      setMessages([{ sender: 'bot', text: response.evaluation }]);
    } else if (response && !response.error) {
      setMessages([{ sender: 'bot', text: 'How can I assist you further?' }]);
    } else if (response?.error) {
      setMessages([{ sender: 'bot', text: `Error: ${response.error}` }]);
    }
  }, [response]);


  // Scroll to bottom on messages or loading change
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);


  if (!response || response.error) return null;


  const handleSend = async (e) => {
    e.preventDefault();


    const trimmed = input.trim();
    if (!trimmed) {
      return;
    }


    // Append user message to the chat
    const newMessages = [...messages, { sender: 'user', text: trimmed }];
    setMessages(newMessages);
    setInput('');
    setLoading(true);


    try {
      // Send user message + full conversation context to backend
      const res = await axios.post('http://localhost:5000/chat', {
        message: trimmed,
        context: {
          evaluation: response.evaluation,
          history: newMessages,
        },
      });


      const botReply = res.data.reply || 'Sorry, I couldn’t understand that.';
      setMessages((prev) => [...prev, { sender: 'bot', text: botReply }]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { sender: 'bot', text: 'Error while contacting the chatbot.' },
      ]);
    } finally {
      setLoading(false);
    }
  };


  return (
    <div
      style={{
        marginTop: '10px',
        padding: '18px 20px 10px',
        background: '#f5f8fa',
        borderRadius: '12px',
        boxShadow: '0 2px 10px rgba(46, 204, 113, 0.10)',
      }}
    >
      <div
        style={{
          fontWeight: 600,
          color: '#205285',
          marginBottom: 6,
          fontSize: 18,
          letterSpacing: '-0.5px',
        }}
      >
        <span role="img" aria-label="Chat">
          💬
        </span>{' '}
        Chat
      </div>


      <div
        style={{
          maxHeight: '250px',
          overflowY: 'auto',
          marginBottom: '9px',
          padding: '8px',
          background: '#fff',
          border: '1px solid #dedede',
          borderRadius: '8px',
        }}
      >
        {messages.map((msg, idx) => (
          <div
            key={idx}
            style={{
              display: 'flex',
              justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start',
              marginBottom: '12px',
            }}
          >
            <span
              style={{
                padding: '9px 13px',
                borderRadius: '13px',
                background: msg.sender === 'user' ? '#e1f3ff' : '#e7fbee',
                color: '#205285',
                maxWidth: '74%',
                fontSize: '14.3px',
                fontWeight: msg.sender === 'user' ? 500 : 400,
                wordWrap: 'break-word',
                whiteSpace: 'pre-wrap', // preserves line breaks if any
              }}
            >
              {msg.text}
            </span>
          </div>
        ))}


        {/* Typing indicator */}
        {loading && (
          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-start',
              marginBottom: '12px',
            }}
          >
            <span
              style={{
                padding: '9px 13px',
                borderRadius: '13px',
                background: '#e7fbee',
                maxWidth: '74%',
                fontSize: '14px',
                display: 'inline-flex',
                alignItems: 'center',
              }}
            >
              <TypingIndicator />
            </span>
          </div>
        )}


        <div ref={bottomRef} />
      </div>


      <form
        onSubmit={handleSend}
        style={{
          display: 'flex',
          gap: '9px',
          alignItems: 'center',
        }}
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask anything..."
          disabled={loading}
          style={{
            flex: 1,
            padding: '10px 12px',
            fontSize: 15,
            borderRadius: 6,
            border: '1px solid #cad2de',
            outline: 'none',
          }}
          aria-label="Type your message here"
        />
        <button
          type="submit"
          disabled={loading}
          style={{
            padding: '9px 23px',
            border: 'none',
            borderRadius: '6px',
            background: loading
              ? '#b2bec3'
              : 'linear-gradient(90deg, #77e7f7 0%, #4977f7 100%)',
            color: '#fff',
            fontWeight: 600,
            fontSize: '15px',
            cursor: loading ? 'not-allowed' : 'pointer',
            boxShadow: '0 1px 5px rgba(33,82,133,0.09)',
          }}
          aria-label="Send message"
        >
          {loading ? 'Sending...' : 'Send'}
        </button>
      </form>
    </div>
  );
};


export default ChatWindow;