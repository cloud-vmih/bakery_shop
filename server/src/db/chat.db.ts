import { AppDataSource } from "../config/database";
import { Message } from "../entity/Message";
import { Conversation } from "../entity/Conversation";
import { Not, LessThan } from "typeorm";
import { FindOptionsWhere } from "typeorm";

const messageRepo = AppDataSource.getRepository(Message);
const conversationRepo = AppDataSource.getRepository(Conversation);

export const createMessage = async (message: Message) => {
    return await messageRepo.save(message);
}

export const getMessages = async (
  conversationId: number,
  cursor?: string,
  limit = 20
) => {
  const whereCondition: FindOptionsWhere<Message> = {
  conversation: {
    id: conversationId,
  },
};

if (cursor) {
  whereCondition.sentAt = LessThan(new Date(cursor));
}
  const messages = await messageRepo.find({
    where: whereCondition,
    order: { sentAt: "DESC" },
    take: limit + 1,
  });

  const hasMore = messages.length > limit;

  if (hasMore) messages.pop();

  return {
    items: messages.reverse(),
    nextCursor: hasMore
      ? messages[0].sentAt?.toISOString()
      : null,
  };
};


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

export const getAllConversations = async () => {
    return await conversationRepo.find();
}

export const getLatestMessageByConversation = async (conversationId: number) => {
    return await messageRepo.findOne({
        where: { conversation: {
            id: conversationId,
        }  },
        order: { sentAt: "DESC" },
        relations: ["senderUser"],
    });
}

export const countUnreadMessages = async (conversationId: number) => {
    return await messageRepo.count({
        where: {
            conversation: {
                id: conversationId
            },
            senderUser: {
                type: Not("admin") && Not("staff"),
            },
            isRead: false, 
        }
    })
}

export const getConversationCustomer = async (conversationId: number) => {
    const message =  await messageRepo.findOne({
        where: { senderUser: { type: Not("admin") && Not("staff") }, conversation: { id: conversationId } },
        relations: ["senderUser"],
    });
    return message?.senderUser || null;
}