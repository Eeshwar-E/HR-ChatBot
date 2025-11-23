import React, { useState, useEffect } from "react";
import ChatWindow from "../components/ChatWindow";
import ModelSelector from "../components/ModelSelector";
import axios from "axios";

const ChatPage = ({ token }) => {
  const [messages, setMessages] = useState([]);
  const [model, setModel] = useState("phi3");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Fetch chat history when model or token changes
  useEffect(() => {
    if (!token) return;
    const fetchHistory = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/chat/history?model=${model}`, {
          headers: { Authorization: "Bearer " + token }
        });
        setMessages(res.data.messages || []);
      } catch (err) {
        console.error("Error fetching chat history", err);
        setMessages([]);
      }
    };
    fetchHistory();
  }, [model, token]);

  return (
    <main style={{
      maxWidth: 900, // Reduce from 1300; 900 is typical for chat and form layouts
      width: "100%",
      margin: "0 auto",
      padding: "32px 14px 0 14px",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      boxSizing: "border-box" // Ensures padding doesn't exceed bounds
    }}>
      <h2 style={{
        fontSize: 34,
        margin: "14px 0 10px 0",
        fontWeight: 700,
        letterSpacing: ".03em",
        color: "#255476"
      }}>
        Chat with Model
      </h2>
      <ModelSelector model={model} setModel={setModel}/>
      <ChatWindow
        model={model}
        token={token}
        messages={messages}
        setMessages={setMessages}
      />
    </main>
  );

};

export default ChatPage;
