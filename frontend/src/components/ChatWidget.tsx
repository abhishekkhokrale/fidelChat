import React, { useEffect, useState } from "react";
import {
  fetchChatHistory,
  connectWebSocket,
  disconnectWebSocket,
  sendWebSocketMessage,
} from "../services/chatService";

interface Message {
  id?: number;
  sender: string; // now it's browser name
  message: string;
}

// Helper to detect browser
const getBrowserName = (): string => {
  const ua = navigator.userAgent;
  if (ua.includes("Chrome") && !ua.includes("Edg")) return "Chrome";
  if (ua.includes("Edg")) return "Edge";
  if (ua.includes("Firefox")) return "Firefox";
  if (ua.includes("Safari") && !ua.includes("Chrome")) return "Safari";
  return "Unknown Browser";
};

const ChatWidget: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const browserName = getBrowserName();

  useEffect(() => {
    // Load history
    fetchChatHistory().then((data) => {
      setMessages(
        data.map((msg: any, i: number) => ({
          id: msg.id || i,
          sender: msg.sender || "Unknown",
          message: msg.message,
        }))
      );
    });

    // Connect WebSocket
    connectWebSocket((newMessage: any) => {
      setMessages((prev) => [
        ...prev,
        {
          id: newMessage.id || Date.now(),
          sender: newMessage.sender || "Unknown",
          message: newMessage.message,
        },
      ]);
    });

    return () => disconnectWebSocket();
  }, []);

  const handleSend = () => {
    if (!input.trim()) return;
    sendWebSocketMessage(browserName, input); // 👈 send with browser name
    setInput("");
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSend();
  };

  return (
    <div
      style={{
        width: "400px",
        maxWidth: "100%",
        height: "500px",
        border: "1px solid #ddd",
        borderRadius: "12px",
        display: "flex",
        flexDirection: "column",
        margin: "0 auto",
        boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
      }}
    >
      {/* Header */}
      <div
        style={{
          background: "#4a90e2",
          color: "white",
          padding: "12px",
          borderTopLeftRadius: "12px",
          borderTopRightRadius: "12px",
          fontWeight: "bold",
          textAlign: "center",
        }}
      >
        💬 Chat Support
      </div>

      {/* Messages */}
      <div
        style={{
          flex: 1,
          padding: "12px",
          overflowY: "auto",
          background: "#f9f9f9",
        }}
      >
        {messages.map((msg) => (
          <div
            key={msg.id}
            style={{
              marginBottom: "10px",
              display: "flex",
              justifyContent:
                msg.sender === browserName ? "flex-end" : "flex-start",
            }}
          >
            <div
              style={{
                maxWidth: "70%",
                padding: "10px 14px",
                borderRadius: "18px",
                background:
                  msg.sender === browserName ? "#4a90e2" : "#e5e5ea",
                color: msg.sender === browserName ? "white" : "black",
                fontSize: "14px",
              }}
            >
              <b>{msg.sender}: </b> {msg.message}
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <div
        style={{
          display: "flex",
          borderTop: "1px solid #ddd",
          padding: "10px",
          background: "#fff",
        }}
      >
        <input
          type="text"
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyPress}
          style={{
            flex: 1,
            padding: "10px",
            border: "1px solid #ddd",
            borderRadius: "20px",
            outline: "none",
            marginRight: "8px",
          }}
        />
        <button
          onClick={handleSend}
          style={{
            background: "#4a90e2",
            color: "white",
            border: "none",
            borderRadius: "50%",
            width: "40px",
            height: "40px",
            cursor: "pointer",
            fontSize: "16px",
          }}
        >
          ➤
        </button>
      </div>
    </div>
  );
};

export default ChatWidget;
