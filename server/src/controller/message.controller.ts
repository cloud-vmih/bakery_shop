import { Request, Response } from "express";
import { createMessage, getMessagesByConversation } from "../services/message.service";
import { io } from "../socket"; 

export const sendMessage = async (req: Request, res: Response) => {
  try {
    const { content, conversationId } = req.body;
    const senderId = (req as any).user.id;

    const message = await createMessage(senderId, content, conversationId);

    if (message.conversation && message.conversation.id){
      io.to(`conversation_${message.conversation.id}`).emit("receive_message", message);
    }

    res.status(201).json({
      success: true,
      data: message,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const loadMessages = async (req: Request, res: Response) => {
  try {
    const conversationId = Number(req.params.conversationId);

    const messages = await getMessagesByConversation(conversationId);

    res.status(200).json({
      success: true,
      data: messages,
    });
  } catch {
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
