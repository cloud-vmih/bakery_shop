"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.chatSocket = void 0;
const chatService = __importStar(require("../services/chat.service"));
const activeAdmins = new Map();
const chatSocket = (io, socket) => {
    socket.on("chat:join", ({ conversationId }) => {
        socket.join(`conversation:${conversationId}`);
        console.log(conversationId);
    });
    socket.on("chat:send", async ({ conversationId, content }) => {
        try {
            const sender = socket.data.user;
            if (!sender) {
                console.error("Missing socket.data.user");
                return;
            }
            const message = await chatService.updateChat(conversationId, content, sender.id, sender);
            io.to(`conversation:${conversationId}`).emit("chat:receive", message);
        }
        catch (err) {
            console.error("chat:send error:", err);
            socket.emit("chat:error", {
                message: "Không gửi được tin nhắn",
            });
        }
    });
    socket.on("admin:joinDashboard", () => {
        socket.join("admins");
    });
    socket.on("admin:joinConversation", async ({ conversationId }) => {
        const admin = socket.data.user;
        const adminId = admin.id;
        const currentLocker = activeAdmins.get(conversationId);
        if (currentLocker && currentLocker !== adminId) {
            socket.emit("conversation:locked", {
                conversationId,
                by: currentLocker,
            });
            return;
        }
        activeAdmins.set(conversationId, adminId);
        socket.join(`conversation:${conversationId}`);
        io.to(`conversation:${conversationId}`).emit("conversation:locked", {
            conversationId,
            by: adminId,
        });
        io.to("admins").emit("conversation:lockChanged", {
            conversationId,
            lockedBy: adminId,
        });
    });
    socket.on("admin:leaveConversation", ({ conversationId }) => {
        const adminId = socket.data.user.id;
        if (activeAdmins.get(conversationId) === adminId) {
            activeAdmins.delete(conversationId);
            io.to("admins").emit("conversation:lockChanged", {
                conversationId,
                lockedBy: null,
            });
        }
        socket.leave(`conversation:${conversationId}`);
    });
    socket.on("disconnect", () => {
        const user = socket.data.user;
        if (user.type !== "Admin" && user.type !== "Staff")
            return;
        for (const [conversationId, adminId] of activeAdmins.entries()) {
            if (adminId === user.id) {
                activeAdmins.delete(conversationId);
                io.to("admins").emit("conversation:lockChanged", {
                    conversationId,
                    lockedBy: null,
                });
                io.to(`conversation:${conversationId}`).emit("conversation:unlocked", {
                    conversationId,
                });
            }
        }
    });
};
exports.chatSocket = chatSocket;
