import { Message } from "../entity/Message";
import { create, getByConversationId, getUnReadMessages, update } from "../db/message.db";
import { User } from "../entity/User";
import { getConversationById, createConversation } from "./conversation.service";

export const createMessage = async (sender: User, content: string, conversationId: number) => {
        if (!sender || !content) {
            console.log("Invalid parameters:", { sender, content, conversationId });
            throw new Error("Invalid parameters");
        }
        let conversation = await getConversationById(conversationId);
        if (!conversation) {
            conversation = await createConversation();
        }

        const message = new Message();
        message.sender = sender;
        message.contents = content;
        message.conversation = conversation;
        return await create(message);
}

export const markMessagesAsRead = async (user: User, conversationId: number) => {
    const conversation = await getConversationById(conversationId);
    if (!conversation) 
        throw new Error("Conversation not found");

    const messages = getUnReadMessages(conversation, user);
    for (const message of await messages) {
        if (!message.id) continue;
        message.isRead = true;
        await update(message.id, message);
    }
    return true;
}

export const getMessagesByConversation = async (conversationId: number) => {
    return await getByConversationId(conversationId);
}