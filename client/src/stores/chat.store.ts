import { create } from "zustand";
import { ChatState, sendMessage, loadMessages } from "../services/chat.services";

export const useChatStore = create<ChatState>((get, set) => ({
    from: "me",

    conversationId: null,
    messages: {
        item: "",
        isOldest: false,
        nextCursor: null,
    },

    sendMessage: sendMessage,

    loadMessages: loadMessages,
}));

