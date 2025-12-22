import express from "express";
import { loadMessages, getChatByUser } from "../controller/chat.controller";
import { verifyToken } from "../middleware/verifyToken";

const messageRouter = express.Router();

messageRouter.get("/:conversationId/messages", verifyToken, loadMessages);
messageRouter.get("/active", verifyToken, getChatByUser)

export default messageRouter;
