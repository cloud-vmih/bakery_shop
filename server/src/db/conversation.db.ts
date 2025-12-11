import { AppDataSource } from "../config/database";
import { Conversation } from "../entity/Conversation";

const repo = AppDataSource.getRepository(Conversation);

export const create = async (conversation: Conversation) => {
    return await repo.save(conversation);
}

export const getById = async (id: number) => {
    return await repo.findOne({
    where: { id },
    });
}