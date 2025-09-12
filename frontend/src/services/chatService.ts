import axios from "axios";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

const API_URL = "http://localhost:8080/api/chat";
// For local
const WS_URL = "http://localhost:8080/ws"; // use SockJS-compatible endpoint
// For WAN (example on EC2)
// const WS_URL = "http://yourdomain.com/ws";
// If you’re serving over HTTPS, then use:
// const WS_URL = "wss://yourdomain.com/ws";

// ----------- REST APIs -----------
export const fetchChatHistory = async () => {
  try {
    const response = await axios.get(`${API_URL}/history`);
    return response.data; // backend returns List<ChatMessage>
  } catch (error) {
    console.error("Error fetching chat history:", error);
    return [];
  }
};

export const sendChatMessage = async (sender: string, message: string) => {
  try {
    const response = await axios.post(`${API_URL}/send`, { sender, message });
    return response.data;
  } catch (error) {
    console.error("Error sending message:", error);
    throw error;
  }
};

// ----------- WebSocket (STOMP over SockJS) -----------
let stompClient: Client | null = null;

export const connectWebSocket = (onMessageReceived: (msg: any) => void) => {
  stompClient = new Client({
    webSocketFactory: () => new SockJS(WS_URL), // ✅ SockJS instead of ws://
    reconnectDelay: 5000,
    onConnect: () => {
      console.log("✅ Connected to WebSocket");
      stompClient?.subscribe("/topic/messages", (msg) => {
        const chatMessage = JSON.parse(msg.body);
        onMessageReceived(chatMessage);
      });
    },
    onStompError: (frame) => {
      console.error("Broker error:", frame.headers["message"]);
    },
  });

  stompClient.activate();
};

export const disconnectWebSocket = () => {
  if (stompClient !== null) {
    stompClient.deactivate();
    console.log("❌ Disconnected from WebSocket");
  }
};

export const sendWebSocketMessage = (sender: string, message: string) => {
  if (stompClient && stompClient.connected) {
    stompClient.publish({
      destination: "/app/send", // must match @MessageMapping("/send")
      body: JSON.stringify({ sender, message }),
    });
  }
};
