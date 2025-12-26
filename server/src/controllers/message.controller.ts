import { Request, Response } from "express";
import { getMessagesByConversation } from "../services/chat.service";

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
