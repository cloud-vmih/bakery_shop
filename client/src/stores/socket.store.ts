import { create } from "zustand";
import { io, type Socket } from "socket.io-client";
import { SocketState, getSocketAuth } from "../services/socket.services";

const baseURL = "http://localhost:5000";


export const useSocketStore = create<SocketState>((set, get) => ({
    socket: null,
    
    connectSocket: () => {        
        const existingSocket = get().socket;

        if(existingSocket) return;

        const socketAuth = getSocketAuth();
        console.log("Socket Auth:", socketAuth);

        const socket: Socket = io(baseURL, {
            auth: socketAuth,
            transports: ['websocket'],
        });

        set({ socket });

        socket.on("connect", () => {
            console.log("Socket connected: ", socket.id);
        });
    },

    disconnectSocket: () => {
        const socket = get().socket;
        if (socket) {
            socket.disconnect();
            set({ socket: null });
            console.log("Socket disconnected");
        }
    },
    reconnectSocket: () => {
        const socket = get().socket;

        if (socket) {
            socket.disconnect();
        }

        get().connectSocket();
    }

}))