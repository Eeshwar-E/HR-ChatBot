import React, { useState, useRef, useEffect } from "react";
import axios from "axios";

const ChatWindow = ({ model, messages, token, setMessages }) => {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  const handleSend = async (e) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed) return;
    setInput("");
    setLoading(true);

    try {
      await axios.post(
        "http://localhost:5000/chat",
        { message: trimmed, model },
        { headers: { Authorization: "Bearer " + token } }
      );

      const histRes = await axios.get(`http://localhost:5000/chat/history?model=${model}`, {
        headers: { Authorization: "Bearer " + token }
      });
      setMessages(histRes.data.messages || []);
    } catch (err) {
      const errMsg = err.response?.data?.error || "Error contacting the chatbot.";
      setMessages([...(messages || []), { sender: "bot", text: errMsg }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
        margin: "20px auto",
        width:"100%",
        maxWidth: 1050,
        background: "#ffffffcc",
        borderRadius: 18,
        boxShadow: "0 8px 32px rgba(60,120,180,0.14)",
        padding: "0 0 10px 0",
        display: "flex",
        flexDirection: "column",
        minHeight: 480
      }}>
      <div style={{
        textAlign: "center",
        fontWeight: 700,
        fontSize: 22,
        padding: "18px 0 10px",
        borderBottom: "1px solid #dde5ef",
        background: "#e9f3fd",
        borderTopLeftRadius: 18,
        borderTopRightRadius: 18
      }}>Chat</div>
      <div style={{
          flex: 1,
          overflowY: "auto",
          background: "#f7faff",
          padding: "22px 20px 10px",
          minHeight: 260,
          maxHeight: 390
        }}>
        {messages
          .filter(msg => msg.text && msg.text.trim().length > 0)
          .map((msg, idx) => (
            <div key={idx} style={{
              display: "flex",
              justifyContent: msg.sender === "user" ? "flex-end" : "flex-start",
              marginBottom: 14
            }}>
              <span style={{
                padding: "12px 18px",
                borderRadius: 18,
                boxShadow: "0 2px 14px rgba(70,120,200,0.03)",
                background: msg.sender === "user" ? "#caf1ff" : "#e7fbaa",
                color: msg.sender === "user" ? "#0f335c" : "#295f05",
                maxWidth: "73%",
                fontSize: 15.2,
                lineHeight: "1.62",
                wordWrap: "break-word",
                whiteSpace: "pre-wrap",
                textAlign: "left"
              }}>{msg.text}</span>
            </div>
          ))}
        {loading && <div style={{ marginBottom: 12, color: "#648ca7", fontSize: 15 }}>Bot is thinking...</div>}
        <div ref={bottomRef} />
      </div>
      <form onSubmit={handleSend} 
        style={{
          display: "flex",
          gap: 11,
          background: "#f1f6f9",
          borderRadius: 16,
          boxShadow: "0 1px 2px rgba(60,60,120,0.07)",
          margin: "0 16px",
          padding: "10px 8px"
        }}>
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Type your question..."
          disabled={loading}
          style={{
            flex: 1,
            border: "none",
            padding: "13px 17px",
            borderRadius: 12,
            fontSize: 15.3,
            outline: 0,
            background: "#f9fcff"
          }}
        />
        <button type="submit" disabled={loading || !input.trim()} style={{
          padding: "12px 28px",
          borderRadius: 10,
          border: "none",
          background: loading ? "#bbccea" : "#378fff",
          color: "#fff",
          fontWeight: 600,
          fontSize: 16,
          cursor: loading ? "default" : "pointer",
          transition: "background 0.18s"
        }}>
          {loading ? "Sending..." : "Send"}
        </button>
      </form>
    </div>
  );
};

export default ChatWindow;
