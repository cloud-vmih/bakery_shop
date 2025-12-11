import { create } from "zustand";
import API from "../api/axois.config";
import { AxiosError } from "axios";

export interface ChatState {
    from: "me" | "support";
    conversationId: number | null;
    messages: {
        item: string;
        isOldest: boolean;
        nextCursor: string | null;
    };
    sendMessage: (conversationId: number, message: string) => Promise<any>;
    loadMessages: (conversationId: number, cursor?: string) => Promise<any>;
}

export const sendMessage = async (conversationId: number, message: string) => {
    try {
        const res = await API.post(`/chat/send-message`, {conversationId, message});
        return res.data;
    }
    catch (error) {
        const err = error as AxiosError<any>;
        throw new Error(err.response?.data?.error || "Gửi tin nhắn thất bại");
    }
};

export const loadMessages = async (conversationId: number, cursor?: string) => {
    try {
        const res = await API.get(`/chat/messages`, {params: { conversationId, cursor }});
        return res.data;
    }
    catch (error) {
        const err = error as AxiosError<any>;
        throw new Error(err.response?.data?.error || "Tải tin nhắn thất bại");
    }
};