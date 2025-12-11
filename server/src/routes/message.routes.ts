import express from "express";
import { sendMessage, loadMessages } from "../controller/message.controller";
import { verifyToken } from "../middleware/verifyToken";

const messageRouter = express.Router();

messageRouter.post("/send-message", verifyToken,sendMessage);
messageRouter.get("/:conversationId/messages", loadMessages);

export default messageRouter;