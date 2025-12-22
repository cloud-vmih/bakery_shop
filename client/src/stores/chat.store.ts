import { create } from "zustand";
import { ChatMessage } from "../types/chat.type";
import { getActiveConversation, getCurrentSenderId, loadMessagesAPI } from "../services/chat.services";
import { useSocketStore } from "./socket.store";
import toast from "react-hot-toast";
import { getSocketAuth } from "../services/socket.services";
import { User } from "../types/user.type";

interface ChatState {
  activeConversationId: number | null;
  messages: Record<number, ChatMessage[]>;
  loading: boolean;

  initChat: (currentUserId: string) => Promise<void>;
  sendMessage: (content: string) => Promise<void>;
  attachListener: (currentUserId: string) => void;
}

export const useChatStore = create<ChatState>((set, get) => ({
  activeConversationId: null,
  messages: {},
  loading: false,

  initChat: async (currentUserId: string) => {
    set({ loading: true });


    const conversationId = await getActiveConversation();
    toast.success("conversation", conversationId);

    set({activeConversationId: conversationId});

    const socket = useSocketStore.getState().socket;
    socket?.emit("chat:join", { conversationId });
    if (!get().messages[conversationId]) {

      const page = await loadMessagesAPI(conversationId);
      set((state) => ({
        messages: {
          ...state.messages,
          [conversationId]: page.items.map((msg) => ({
            ...msg,
            isMine: msg.senderId.toString() === currentUserId,
          })),
        },
      }));
    }

  set({
    activeConversationId: conversationId,
    loading: false,
  });

   get().attachListener(currentUserId);
  },

  sendMessage: async (content: string) => {
    const { activeConversationId } = get();
    toast.success(activeConversationId?.toString()?? "none");
    if (!activeConversationId) return;

    const socket = useSocketStore.getState().socket;
    toast.error(socket?.id ?? "no socket found");
    if (!socket) return;

    socket.emit("chat:send", {
      conversationId: activeConversationId,
      content,
    });
  },

  
  attachListener: (currentUserId: string) => {
    const socket = useSocketStore.getState().socket;
    if (!socket) return;
    socket.off("chat:receive");
    toast.error(`currentUser: ${currentUserId}`)
    socket.on("chat:receive", (message: ChatMessage) => {
      set((state) => ({
        messages: {
          ...state.messages,
          [message.conversationId]: [
            ...(state.messages[message.conversationId] || []),
            {
              ...message,
              isMine: message.senderId === currentUserId,
            },
          ],
        },
      }));
    });
  },
}));
