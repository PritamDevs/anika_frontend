import { io } from "socket.io-client";
import { BACKEND_URL } from "./config";

const getUserIdFromToken = (token) => {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.id || payload._id;
  } catch {
    return null;
  }
};

// ✅ Create socket but never auto connect
export const socket = io(BACKEND_URL, {
  autoConnect: false,
  reconnection: true,
  reconnectionAttempts: 5,        // ✅ don't retry forever on old devices
  reconnectionDelay: 2000,        // ✅ wait 2s between retries
  timeout: 10000,                 // ✅ give up after 10s on slow networks
});

// ✅ Only connect after login
export const reconnectSocket = () => {
  const newToken = localStorage.getItem("token");
  if (!newToken) return;          // ✅ don't connect if no token
  
  const userId = getUserIdFromToken(newToken);
  socket.auth = { token: newToken, userId };
  
  if (socket.connected) {
    socket.disconnect();
  }
  socket.connect();
};

// ✅ Clean disconnect on logout
export const disconnectSocket = () => {
  if (socket.connected) {
    socket.disconnect();
  }
};