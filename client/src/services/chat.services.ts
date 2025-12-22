import toast from "react-hot-toast";
import API from "../api/axois.config";
import { ChatMessage, MessagePage } from "../types/chat.type";
import { User } from "../types/user.type";

export const loadMessagesAPI = async ( conversationId: number, cursor?: string): Promise<MessagePage> => {
  const res = await API.get(`chat/${conversationId}/messages`, { params: { cursor }, });
  toast.success(res.data.items);
  return res.data.data;
};

export const getActiveConversation = async () => {
  const res = await API.get("/chat/active");
  return res.data.data;
};

export const getCurrentSenderId = (user: User): string | null => {
  return user.id.toString() ??  localStorage.getItem("guestID") ?? "none";
}
