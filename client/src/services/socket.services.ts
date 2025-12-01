import { io, Socket } from "socket.io-client";

export interface SocketState {
    socket: Socket | null;
    connectSocket: () => void;
    disconnectSocket: () => void;
    reconnectSocket: () => void;
}

export const getSocketAuth = () => {
    const token = localStorage.getItem("token");

    let guestID = localStorage.getItem("guestID");

    if (!token && !guestID) {
        guestID = crypto.randomUUID();
        localStorage.setItem("guestID", guestID);
    }
    return {
        token: token || null,
        guestID: token ? null : guestID
    };
}