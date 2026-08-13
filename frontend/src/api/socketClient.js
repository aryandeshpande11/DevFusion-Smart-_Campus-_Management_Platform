import { io } from "socket.io-client";
import { useAuthStore } from "../store/authStore";

// one shared socket connection for the whole app — connects lazily so a
// signed-out user never opens a socket at all
let socketInstance = null;

export function getSocketConnection() {
  if (socketInstance) return socketInstance;

  const accessToken = useAuthStore.getState().accessToken;
  if (!accessToken) return null;

  socketInstance = io(import.meta.env.VITE_API_URL?.replace("/api", "") || "/", {
    auth: { token: accessToken },
    withCredentials: true,
  });

  return socketInstance;
}

export function closeSocketConnection() {
  socketInstance?.disconnect();
  socketInstance = null;
}
