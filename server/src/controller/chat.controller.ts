import { Request, Response } from "express";
import * as chatService from "../services/chat.service";
import { send } from "process";

export const getChatByUser = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user || null;
    const guestId = req.headers["x-guest-id"] as string | undefined;

    const senderId = user?.id?.toString() || guestId;

    if (!senderId) {
      return res.status(400).json({
        success: false,
        message: "Missing sender identity",
      });
    }

    const conversation = await chatService.getOrCreateConversation(senderId);
    return res.status(200).json({
      success: true,
      data: conversation,
      senderId: senderId
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to get conversation",
    });
  }
};


export const loadMessages = async (req: Request, res: Response) => {
  try {
    const conversationId = Number(req.params.conversationId);
    const cursor = req.query.cursor as string | undefined;

    if (!conversationId) {
      return res.status(400).json({
        success: false,
        message: "Invalid conversationId",
      });
    }

    const messages = await chatService.getMessagesByConversation(
      conversationId,
      cursor
    );

    return res.status(200).json({
      success: true,
      data: messages,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || "Load messages failed",
    });
  }
};

