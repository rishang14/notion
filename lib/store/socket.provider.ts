import { create } from "zustand";
import { io, Socket } from "socket.io-client";

type SocketState = {
  socket: Socket | null;
  isConnected: boolean;

  // lifecycle
  connectSocket: (url: string, options?: any) => void;
  disconnectSocket: () => void;

  // event management
  addListener: (event: string, handler: (...args: any[]) => void) => void;
  removeListener: (event: string, handler?: (...args: any[]) => void) => void;

  // emit
  sendMessage: (event: string, payload: any) => void;
};

const UseSocket = create<SocketState>((set, get) => ({
  socket: null,
  isConnected: false,

  connectSocket: (url, options: any) => { 
    console.log("hey i am called")
    if (get().socket) {
      get().socket?.disconnect();
    }
    const newSocket = io(url, {
      transports: ["polling", "websocket"],
      ...options,
    });
    set({ socket: newSocket, isConnected: true });

    newSocket.on("connect", () => {
      set({ isConnected: true });
      console.log("Socket connected!");
    });

    newSocket.on("disconnect", () => {
      set({ isConnected: false });
      console.log("Socket disconnected!");
    });

    newSocket.on("connect_error", (error) => {
      set({ isConnected: false });
      console.error("🔴 Socket connection error:", error);
    });

    // Add reconnection events for debugging
    newSocket.on("reconnect", (attemptNumber) => {
      set({ isConnected: true });
      console.log("🔄 Socket reconnected after", attemptNumber, "attempts");
    });

    newSocket.on("reconnect_error", (error) => {
      console.error("🔴 Socket reconnection error:", error);
    });
  },
  disconnectSocket: () => {
    const socket = get().socket;
    if (socket) {
      socket.disconnect();
      set({ socket: null, isConnected: false });
    }
  },

  addListener: (event, handler) => {
    const socket = get().socket;
    if (socket) {
      socket.off(event); // prevent duplicate listeners
      socket.on(event, handler);
    } else {
      console.warn(`Socket not connected. Cannot add listener for "${event}".`);
    }
  },

  removeListener: (event, handler) => {
    const socket = get().socket;
    if (socket) {
      if (handler) {
        socket.off(event, handler);
      } else {
        socket.off(event);
      }
    }
  },

  sendMessage: (event, payload) => {
    const { socket, isConnected } = get();
    if (socket && isConnected) {
      socket.emit(event, payload);
    } else {
      console.warn(`Socket not connected. Cannot send "${event}".`);
    }
  },
}));

export default UseSocket;
