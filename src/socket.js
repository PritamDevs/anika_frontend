import { io } from "socket.io-client";
import { BACKEND_URL } from "./config";

const token = localStorage.getItem("token");

const getUserIdFromToken = (token) => {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.id || payload._id;
  } catch {
    return null;
  }
};

export const socket = io(BACKEND_URL, {
  autoConnect: false,
  auth: {
    token,
    userId: getUserIdFromToken(token)
  }
});

if (token) {
  socket.connect();
}

export const reconnectSocket = () => {
  const newToken = localStorage.getItem("token");
  const userId = getUserIdFromToken(newToken);
  socket.auth = { token: newToken, userId };
  socket.disconnect().connect();
};