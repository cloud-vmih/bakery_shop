import * as ChatDB from "../db/chat.db";
import { ESender } from "../entity/enum/enum";
import { Message } from "../entity/Message";

export const updateChat = async (
  conversationId: number,
  content: string,
  senderId: string ,
  senderType: "USER" | "GUEST"
) => {
  const conversation = await ChatDB.getConversationById(conversationId);
  if (!conversation) {
    throw new Error("Conversation not found");
  }

  const message = new Message();
  message.conversation = conversation;   
  message.content = content;
  message.senderId = senderId;
  message.senderType =
    senderType === "USER" ? ESender.USER : ESender.GUEST;

  const saved = await ChatDB.createMessage(message);

  return {
    id: saved.id!,
    conversationId: saved.conversation?.id,
    senderId: saved.senderId,
    senderType: saved.senderType,
    content: saved.content!,
    createdAt: saved.sentAt!.toISOString(),
  };
};


export const getOrCreateConversation = async (senderId: string) => {
  const message = await ChatDB.getMessageBySender(senderId);
  console.log("sender:",senderId,"message",message);
  if (message?.conversation?.id) {
    return message.conversation.id;
  }

  const conversation = await ChatDB.createConversation();
  const welcomeMessage = new Message();
  welcomeMessage.conversation = conversation;
  welcomeMessage.content = "Xin chào, tôi cần giúp đỡ";
  welcomeMessage.senderId = senderId;
  welcomeMessage.senderType = ESender.USER;
  await ChatDB.createMessage(welcomeMessage);
  return conversation.id;
};


export const getMessagesByConversation = async (
  conversationId: number,
  cursor?: string,
  limit = 20
) => {
  return await ChatDB.getMessages(conversationId, limit, cursor);
};
