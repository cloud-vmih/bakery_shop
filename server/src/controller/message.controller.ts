import { Request, Response } from "express";
import { createMessage, getMessagesByConversation } from "../services/message.service";

export const sendMessage = async (req: Request, res: Response) => {
    try {
        const { content, conversationId } = req.body;
        const senderId = (req as any).user.id;
        const message = await createMessage(senderId, content, conversationId);
        res.status(201).json({
            success: true,
            data: message
        }); 
    }
    catch (error: any){
        res.status(500).json({ 
            success: false,
            message: error.message
        });
    }
}

export const loadMessages = async (req: Request, res: Response) => {
    try {
        const { conversationId } = req.params;
        const messages = await getMessagesByConversation(Number(conversationId));
        res.status(200).json({
            success: true,
            data: messages
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}

