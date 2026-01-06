import { Server, Socket } from "socket.io";
import * as chatService from "../services/chat.service";

const activeAdmins = new Map<number, string>();  

export const chatSocket = (io: Server, socket: Socket) => {
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

      const message = await chatService.updateChat(
        conversationId,
        content,
        sender.id,
        sender
      );

      io.to(`conversation:${conversationId}`).emit(
        "chat:receive",
        message
      );
      
    } catch (err) {
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
      if (user.type !== "Admin" && user.type !== "Staff") return;

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
