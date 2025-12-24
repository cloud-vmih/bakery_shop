// stores/adminConversationChat.store.ts
import { create } from "zustand";
import { ChatMessage } from "../types/chat.type";
import { loadMessages } from "../services/chat.services";
import { useSocketStore } from "./socket.store";

interface ConversationChatState {
  conversationId: number | null;
  messages: ChatMessage[];
  locked: boolean;

  enter: (id: number) => Promise<void>;
  leave: () => void;
  send: (content: string) => void;
  attachSocket: () => void;
}

export const useAdminConversationChatStore = create<ConversationChatState>((set, get) => ({
  conversationId: null,
  messages: [],
  locked: false,

  enter: async (conversationId) => {
    const socket = useSocketStore.getState().socket;
    if (!socket) return;

    socket.emit("admin:joinConversation", { conversationId });

    const messages = (await loadMessages(conversationId)).items;

    set({
      conversationId,
      messages,
    });
  },

  leave: () => {
    const socket = useSocketStore.getState().socket;
    const id = get().conversationId;

    if (socket && id) {
      socket.emit("admin:leaveConversation", { conversationId: id });
    }

    set({
      conversationId: null,
      messages: [],
      locked: false,
    });
  },

  send: (content) => {
    const socket = useSocketStore.getState().socket;
    const { conversationId, locked } = get();
    if (!socket || !conversationId || locked) return;

    socket.emit("chat:send", { conversationId, content });
  },

  attachSocket: () => {
    const socket = useSocketStore.getState().socket;
    if (!socket) return;

    socket.off("chat:receive");
    socket.on("chat:receive", (msg: ChatMessage) => {
      if (msg.conversationId !== get().conversationId) return;

      set((state) => ({
        messages: [...state.messages, msg],
      }));
    });

    socket.off("conversation:locked");
    socket.on("conversation:locked", ({ conversationId }) => {
      if (conversationId === get().conversationId) {
        set({ locked: true });
      }
    });

    socket.off("conversation:lockChanged");
    socket.on("conversation:lockChanged", ({ conversationId, lockedBy }) => {
      if (conversationId === get().conversationId) {
        set({ locked: !!lockedBy });
      }
    });
  },
}));
