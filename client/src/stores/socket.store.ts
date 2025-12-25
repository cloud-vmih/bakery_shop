import { create } from "zustand";
import { io, type Socket } from "socket.io-client";
import { getSocketAuth } from "../services/socket.services";
import { SocketState } from "../types/store.type";
import { useNotificationStore } from "../stores/notification.store";
const baseURL = "http://localhost:5000";


export const useSocketStore = create<SocketState>((set, get) => ({
    socket: null,
    
    connectSocket: () => {        
        if (get().socket) return;

        const socket: Socket = io(baseURL, {
            auth: getSocketAuth(),
            transports: ['websocket'],
        });

        socket.on("connect", () => {
            console.log("Socket connected: ", socket.id);
            useNotificationStore.getState().init();
        });
        set({ socket });
    },

    disconnectSocket: () => {
        const socket = get().socket;
        if (socket) {
            socket.disconnect();
            socket.removeAllListeners();
            set({ socket: null });
            console.log("Socket disconnected");
        }
    },
    reconnectSocket: () => {
        get().disconnectSocket();
        get().connectSocket();
    }


}))
