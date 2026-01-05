"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadMessages = void 0;
const chat_service_1 = require("../services/chat.service");
const loadMessages = async (req, res) => {
    try {
        const conversationId = Number(req.params.conversationId);
        const messages = await (0, chat_service_1.getMessagesByConversation)(conversationId);
        res.status(200).json({
            success: true,
            data: messages,
        });
    }
    catch {
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};
exports.loadMessages = loadMessages;
