import { ReactNode } from "react";
import { socketStore } from "../stores/socket.store";
import { useEffect } from "react";

export const SocketProvider = ({ children }: { children: ReactNode }) => {
    const { connectSocket, disconnectSocket } = socketStore();

    useEffect(() => {
        connectSocket();

        return () => disconnectSocket();
    }, []);

    return <>{children}</>;
}