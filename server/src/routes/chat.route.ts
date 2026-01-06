import express from "express";
import * as chatController from "../controllers/chat.controller";
import { verifyToken } from "../middleware/verifyToken";

const messageRouter = express.Router();

messageRouter.get("/:conversationId/messages", verifyToken, chatController.loadMessages);
messageRouter.get("/active", verifyToken, chatController.getChatByUser)
messageRouter.get("/conversations", verifyToken, chatController.loadConversations)

export default messageRouter;
