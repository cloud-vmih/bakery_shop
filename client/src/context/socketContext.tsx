import { ReactNode } from "react";
import { useSocketStore } from "../stores/socket.store";
import { useEffect } from "react";
import { useUser } from "./authContext";

export const SocketProvider = ({ children }: { children: ReactNode }) => {
    const { connectSocket, disconnectSocket } = useSocketStore();
    useEffect(() => {
        connectSocket();

        return () => disconnectSocket();
    }, []);



    return <>{children}</>;
}