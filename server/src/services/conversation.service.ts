import { getById, create } from "../db/conversation.db";
import { Conversation } from "../entity/Conversation";

export const getConversationById = async (conversationId: number) => {
    try {
        const conversation = await getById(conversationId);
        return conversation;
    }
    catch (error) {
        console.error("Service error:", error);
        throw new Error("Error fetching conversation");
    }
}

export const createConversation = async () => {
        const conversation = new Conversation();
        return await create(conversation);
}