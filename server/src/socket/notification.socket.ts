import { Server, Socket } from "socket.io";
import { markRead, list } from "../services/notification.service";

export const notificationSocket = ( socket: Socket) => {
    const user = socket.data.user;
    console.log("notificationSocket init", socket.id, socket.data.user);
    if (!user || user.type === "GUEST") return;

    socket.join(`notify:${user.id}`);

    socket.on("notification:list", async (_, cb) => {
        console.log("gọi hàm list", user.id);
        const data = await list(user.id);
        cb?.(data);
    });

    socket.on("notification:markRead", ({ id }) => {
        markRead(id, user.id);
    });
};
