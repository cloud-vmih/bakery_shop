import { create } from "zustand";
import { ConversationSummary } from "../types/chat.type";
import { loadConversations } from "../services/chat.service";
import { useSocketStore } from "./socket.store";

interface ConversationListState {
  conversations: ConversationSummary[];
  loading: boolean;

  load: () => Promise<void>;
  attachSocket: () => void;
}

export const useAdminConversationListStore = create<ConversationListState>((set) => ({
  conversations: [],
  loading: false,

  load: async () => {
    set({ loading: true });
    const data = await loadConversations();
    set({ conversations: data, loading: false });
  },

  attachSocket: () => {
    const socket = useSocketStore.getState().socket;
    if (!socket) return;

    socket.emit("admin:joinDashboard");

    socket.off("conversation:update");
    socket.on("conversation:update", (payload) => {
      set((state) => ({
        conversations: state.conversations
          .map((c) =>
            c.id === payload.conversationId
              ? {
                  ...c,
                  lastMessage: payload.lastMessage,
                  lastMessageAt: payload.lastMessageAt,
                }
              : c
          )
          .sort(
            (a, b) =>
              new Date(b.lastMessageAt).getTime() -
              new Date(a.lastMessageAt).getTime()
          ),
      }));
    });

    socket.off("conversation:lockChanged");
    socket.on("conversation:lockChanged", ({ conversationId, lockedBy }) => {
      set((state) => ({
        conversations: state.conversations.map((c) =>
          c.id === conversationId
            ? { ...c, isLocked: !!lockedBy }
            : c
        ),
      }));
    });
  },
}));
