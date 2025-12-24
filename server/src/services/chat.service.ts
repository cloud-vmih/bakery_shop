import { G } from "@upstash/redis/zmscore-DhpQcqpW";
import * as chatDB from "../db/chat.db";
import { getRawUserByID } from "../db/db.user";
import { ESender } from "../entity/enum/enum";
import { Message } from "../entity/Message";
import { User } from "../entity/User";

export const updateChat = async (
  conversationId: number,
  content: string,
  senderId: string | number ,
  sender?: User
) => {
  const conversation = await chatDB.getConversationById(conversationId);
  if (!conversation) {
    throw new Error("Conversation not found");
  }

  const message = new Message();
  message.conversation = conversation;   
  message.content = content;
  message.senderId = String(senderId);

  if (sender && typeof sender.id === "number") {
    message.senderUser = sender;
  }
  const saved = await chatDB.createMessage(message);

  return {
    id: saved.id!,
    conversationId: saved.conversation?.id,
    senderId: saved.senderId,
    sender: saved.senderUser,
    content: saved.content!,
    createdAt: saved.sentAt!.toISOString(),
  };
};


export const getOrCreateConversation = async (senderId: string | number) => {
  const message = await chatDB.getMessageBySender(String(senderId));
  console.log("sender:",senderId,"message",message);
  if (message?.conversation?.id) {
    return message.conversation.id;
  }

  const conversation = await chatDB.createConversation();
  const welcomeMessage = new Message();
  welcomeMessage.conversation = conversation;
  welcomeMessage.content = "Xin chào, tôi cần giúp đỡ";
  welcomeMessage.senderId = String(senderId);

  if (typeof senderId === "number") {
    const sender = await getRawUserByID(senderId);
    if (sender) {
      welcomeMessage.senderUser = sender;
    }
  }


  await chatDB.createMessage(welcomeMessage);
  return conversation.id;
};


export const getMessagesByConversation = async (
  conversationId: number,
  cursor?: string,
  limit = 20
) => {
  return await chatDB.getMessages(conversationId, cursor, limit);

};

export const getConversationsSummary = async () => {
  const conversations = await chatDB.getAllConversations();

  const result = await Promise.all(
    conversations
      .filter((c) => c.id)
      .map(async (c) => {
        const message = await chatDB.getLatestMessageByConversation(c.id!);
        const unreadCount = await chatDB.countUnreadMessages(c.id!);

        return {
          id: c.id,
          userId: message?.senderUser?.id ?? message?.senderId ?? null,
          lastMessage: message?.content,
          unreadCount,
          lockedBy: null,
        };
      })
  );
  return result.filter(Boolean);
};
