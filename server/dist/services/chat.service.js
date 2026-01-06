"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.getConversationsSummary = exports.getMessagesByConversation = exports.getOrCreateConversation = exports.updateChat = void 0;
const chatDB = __importStar(require("../db/chat.db"));
const user_db_1 = require("../db/user.db");
const Message_1 = require("../entity/Message");
const updateChat = async (conversationId, content, senderId, sender) => {
    const conversation = await chatDB.getConversationById(conversationId);
    if (!conversation) {
        throw new Error("Conversation not found");
    }
    const message = new Message_1.Message();
    message.conversation = conversation;
    message.content = content;
    message.senderId = String(senderId);
    if (sender && typeof sender.id === "number") {
        message.senderUser = sender;
    }
    const saved = await chatDB.createMessage(message);
    return {
        id: saved.id,
        conversationId: saved.conversation?.id,
        senderId: saved.senderId,
        sender: saved.senderUser,
        content: saved.content,
        createdAt: saved.sentAt.toISOString(),
    };
};
exports.updateChat = updateChat;
const getOrCreateConversation = async (senderId) => {
    const message = await chatDB.getMessageBySender(String(senderId));
    console.log("sender:", senderId, "message", message);
    if (message?.conversation?.id) {
        return message.conversation.id;
    }
    const conversation = await chatDB.createConversation();
    const welcomeMessage = new Message_1.Message();
    welcomeMessage.conversation = conversation;
    welcomeMessage.content = "Xin chào, tôi cần giúp đỡ";
    welcomeMessage.senderId = String(senderId);
    if (typeof senderId === "number") {
        const sender = await (0, user_db_1.getRawUserByID)(senderId);
        if (sender) {
            welcomeMessage.senderUser = sender;
        }
    }
    await chatDB.createMessage(welcomeMessage);
    return conversation.id;
};
exports.getOrCreateConversation = getOrCreateConversation;
const getMessagesByConversation = async (conversationId, cursor, limit = 20) => {
    const result = await chatDB.getMessages(conversationId, cursor, limit);
    return {
        items: result.items.map((m) => ({
            id: m.id,
            conversationId: m.conversation?.id,
            senderId: m.senderId,
            content: m.content,
            createdAt: m.sentAt.toISOString(),
        })),
        nextCursor: result.nextCursor,
    };
};
exports.getMessagesByConversation = getMessagesByConversation;
const getConversationsSummary = async () => {
    const conversations = await chatDB.getAllConversations();
    const result = await Promise.all(conversations
        .filter((c) => c.id)
        .map(async (c) => {
        const message = await chatDB.getLatestMessageByConversation(c.id);
        const unreadCount = await chatDB.countUnreadMessages(c.id);
        const customer = await chatDB.getConversationCustomer(c.id);
        return {
            id: c.id,
            user: customer?.fullName ?? null,
            lastMessage: message?.content,
            unreadCount,
            lockedBy: null,
        };
    }));
    return result.filter(Boolean);
};
exports.getConversationsSummary = getConversationsSummary;
