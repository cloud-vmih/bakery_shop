"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
<<<<<<< HEAD
exports.getConversationCustomer = exports.countUnreadMessages = exports.getLatestMessageByConversation = exports.getAllConversations = exports.getMessageBySender = exports.getConversationById = exports.createConversation = exports.getUnReadMessages = exports.getMessages = exports.createMessage = void 0;
=======
exports.countUnreadMessages = exports.getLatestMessageByConversation = exports.getAllConversations = exports.getMessageBySender = exports.getConversationById = exports.createConversation = exports.getUnReadMessages = exports.getMessages = exports.createMessage = void 0;
>>>>>>> origin/feature/cake-filling
const database_1 = require("../config/database");
const Message_1 = require("../entity/Message");
const Conversation_1 = require("../entity/Conversation");
const typeorm_1 = require("typeorm");
const messageRepo = database_1.AppDataSource.getRepository(Message_1.Message);
const conversationRepo = database_1.AppDataSource.getRepository(Conversation_1.Conversation);
const createMessage = async (message) => {
    return await messageRepo.save(message);
};
exports.createMessage = createMessage;
const getMessages = async (conversationId, cursor, limit = 20) => {
    const whereCondition = {
        conversation: {
            id: conversationId,
        },
    };
    if (cursor) {
        whereCondition.sentAt = (0, typeorm_1.LessThan)(new Date(cursor));
    }
    const messages = await messageRepo.find({
        where: whereCondition,
        order: { sentAt: "DESC" },
        take: limit + 1,
    });
    const hasMore = messages.length > limit;
    if (hasMore)
        messages.pop();
    return {
        items: messages.reverse(),
        nextCursor: hasMore
            ? messages[0].sentAt?.toISOString()
            : null,
    };
};
exports.getMessages = getMessages;
const getUnReadMessages = async (conversation, senderId) => {
    return await messageRepo.find({
        where: { conversation: { id: conversation.id }, isRead: false, senderId: (0, typeorm_1.Not)(senderId) }
    });
};
exports.getUnReadMessages = getUnReadMessages;
const createConversation = async () => {
    const conversation = conversationRepo.create();
    return await conversationRepo.save(conversation);
};
exports.createConversation = createConversation;
const getConversationById = async (id) => {
    return await conversationRepo.findOne({
        where: { id },
    });
};
exports.getConversationById = getConversationById;
const getMessageBySender = async (senderId) => {
    return await messageRepo.findOne({
        where: { senderId: senderId },
        relations: ["conversation"],
    });
};
exports.getMessageBySender = getMessageBySender;
const getAllConversations = async () => {
    return await conversationRepo.find();
};
exports.getAllConversations = getAllConversations;
const getLatestMessageByConversation = async (conversationId) => {
    return await messageRepo.findOne({
        where: { conversation: {
                id: conversationId,
            } },
        order: { sentAt: "DESC" },
<<<<<<< HEAD
        relations: ["senderUser"],
=======
>>>>>>> origin/feature/cake-filling
    });
};
exports.getLatestMessageByConversation = getLatestMessageByConversation;
const countUnreadMessages = async (conversationId) => {
    return await messageRepo.count({
        where: {
            conversation: {
                id: conversationId
            },
            senderUser: {
                type: (0, typeorm_1.Not)("admin") && (0, typeorm_1.Not)("staff"),
            },
            isRead: false,
        }
    });
};
exports.countUnreadMessages = countUnreadMessages;
<<<<<<< HEAD
const getConversationCustomer = async (conversationId) => {
    const message = await messageRepo.findOne({
        where: { senderUser: { type: (0, typeorm_1.Not)("admin") && (0, typeorm_1.Not)("staff") }, conversation: { id: conversationId } },
        relations: ["senderUser"],
    });
    return message?.senderUser || null;
};
exports.getConversationCustomer = getConversationCustomer;
=======
>>>>>>> origin/feature/cake-filling
