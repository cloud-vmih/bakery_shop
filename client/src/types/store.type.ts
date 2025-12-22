import { ChatMessage } from "./chat.type";
import { type Socket} from "socket.io-client";

export interface ChatStore {
  activeConversationId: number | null;
  messages: Record<number, ChatMessage[]>;

  setActiveConversation: (id: number) => void;
  sendMessage: (content: string) => void;
  attachListener: () => void;
}

export interface SocketState {
    socket: Socket | null;
    connectSocket: () => void;
    disconnectSocket: () => void;
    reconnectSocket: () => void;
}