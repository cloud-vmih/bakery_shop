"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notificationSocket = void 0;
const notification_service_1 = require("../services/notification.service");
const notificationSocket = (socket) => {
    const user = socket.data.user;
    console.log("notificationSocket init", socket.id, socket.data.user);
    if (!user || user.type === "GUEST")
        return;
    socket.join(`notify:${user.id}`);
    socket.on("notification:list", async (_, cb) => {
        console.log("gọi hàm list", user.id);
        const data = await (0, notification_service_1.list)(user.id);
        cb?.(data);
    });
    socket.on("notification:markRead", ({ id }) => {
        (0, notification_service_1.markRead)(id, user.id);
    });
};
exports.notificationSocket = notificationSocket;
