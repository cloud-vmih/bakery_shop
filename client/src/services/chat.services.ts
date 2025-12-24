import API from "../api/axois.config";
import {  ConversationSummary, MessagePage } from "../types/chat.type";
import { User } from "../types/user.type";

export const loadMessages = async ( conversationId: number, cursor?: string): Promise<MessagePage> => {
  const res = await API.get(`chat/${conversationId}/messages`, { params: { cursor }, });
  return res.data.data;
};

export const getActiveConversation = async () => {
  const res = await API.get("/chat/active");
  return res.data.data;
};

export const getCurrentSenderId = (user: User): string | null => {
  return user.id.toString() ??  localStorage.getItem("guestID") ?? "none";
}

export const loadConversations = async (): Promise<ConversationSummary[]> => {
  const res = await API.get(`chat/conversations`);
  return res.data.data;
}