import { AppDataSource } from "../config/database";
import { Message } from "../entity/Message";
import { User } from "../entity/User";
import { Not } from "typeorm";

const repo = AppDataSource.getRepository(Message);

export const create = async (message: Message) => {
    return await repo.save(message);
}

export const getByConversationId = async (conversationId: number) => {
    return await repo.find({
        where: { conversation: { id: conversationId } },
        order: { sentAt: "DESC" },
    });
}

export const getUnReadMessages = async (conversation: any, user: User) => {
    return await repo.find({
        where: { conversation: { id: conversation.id }, isRead: false, sender: Not(user) }
    });
}

export const update = async (id: number, message:Message) => {
    return await repo.update(id, message);
}