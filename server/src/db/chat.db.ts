import { AppDataSource } from "../config/database";
import { Message } from "../entity/Message";
import { Conversation } from "../entity/Conversation";
import { Not } from "typeorm";

const messageRepo = AppDataSource.getRepository(Message);
const conversationRepo = AppDataSource.getRepository(Conversation);

export const createMessage = async (message: Message) => {
    return await messageRepo.save(message);
}

export const getMessages = async (conversationId: number, limit = 20, cursor?:string) => {
    const qb = messageRepo
    .createQueryBuilder("m")
    .where("m.conversationId = :conversationId", { conversationId })
    .orderBy("m.sentAt", "DESC")
    .take(limit + 1);

    if (cursor) {
        qb.andWhere("m.sentAt < :cursor", { cursor });
    }

    const messages = await qb.getMany();

    const hasMore = messages.length > limit;
    if (hasMore) messages.pop();

    return {
        items: messages.reverse(),
        nextCursor: hasMore ? messages[0].sentAt : null,
    };
}

export const getUnReadMessages = async (conversation: any, senderId: string) => {
    return await messageRepo.find({
        where: { conversation: { id: conversation.id }, isRead: false, senderId: Not(senderId) }
    });
}

export const createConversation = async () => {
    const conversation = conversationRepo.create();
    return await conversationRepo.save(conversation);
}

export const getConversationById = async (id: number) => {
    return await conversationRepo.findOne({
    where: { id },
    });
}


export const getMessageBySender = async (senderId: string) => {
    return await messageRepo.findOne({
        where: { senderId: senderId },
        relations: ["conversation"],
    });
}