import { create } from "zustand";
import { ChatMessage } from "../types/chat.type";
import { getActiveConversation, loadMessages } from "../services/chat.service";
import { useSocketStore } from "./socket.store";
import toast from "react-hot-toast";

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
    toast.success(`conversation: ${conversationId}`);
    const socket = useSocketStore.getState().socket;
    socket?.emit("chat:join", { conversationId });
    if (!get().messages[conversationId]) {

      const page = await loadMessages(conversationId);

      if (page.items.length > 0) {
        const firstMsg = page.items[0];
        toast.success(
          `First message:
      id=${firstMsg.id}
      senderId=${firstMsg.senderId}
       createdAt=${firstMsg.createdAt} | sentAt=${(firstMsg as any).sentAt}
      content=${firstMsg.content}`
        );
      }

      set((state) => ({
        messages: {
          ...state.messages,
          [conversationId]: page.items.map((msg: any) => ({
            ...msg,
            createdAt:
              msg.createdAt ??
              (msg.sentAt ? new Date(msg.sentAt).toISOString() : null),
            isMine: msg.senderId.toString() === currentUserId,
          })),
        }
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
    if (!activeConversationId) return;

    const socket = useSocketStore.getState().socket;
    if (!socket) return;

    toast.success(`content: ${content}`)

    socket.emit("chat:send", {
      conversationId: activeConversationId,
      content,
    });
  },

  
  attachListener: (currentUserId: string) => {
    const socket = useSocketStore.getState().socket;
    toast.error(`${currentUserId}`)
    if (!socket) return;
    socket.off("chat:receive");
    socket.on("chat:receive", (message: ChatMessage) => {
      set((state) => ({
        messages: {
          ...state.messages,
          [message.conversationId]: [
            ...(state.messages[message.conversationId] || []),
            {
              ...message,
              isMine: message.senderId.toString() === currentUserId,
            },
          ],
        },
      }));
    });
  },
}));
