import { Server, Socket } from "socket.io";
import * as chatService from "../services/chat.service";

export const chatSocket = (io: Server, socket: Socket) => {
  socket.on("chat:join", ({ conversationId }) => {
    socket.join(`conversation:${conversationId}`);
    console.log(conversationId);
  });

  socket.on("chat:send", async ({ conversationId, content }) => {
    const senderId = socket.data.user.id;
    const senderType = socket.data.user.type;
    console.log(content, senderId, senderType);

    const message = await chatService.updateChat(conversationId, content, senderId, senderType);
    
    io.to(`conversation:${conversationId}`).emit("chat:receive", message);
  });
};
