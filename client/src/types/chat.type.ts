export interface ChatMessage {
  id: number;
  conversationId: number;
  senderId: string;
  senderType: "GUEST" | "USER" | "ADMIN" | "STAFF";
  content: string;
  createdAt: string;
}

export interface MessagePage {
  items: ChatMessage[];
  nextCursor: string | null;
}

export interface ConversationSummary {
  id: number;
  userId: number | string;
  lastMessage: string;
  lastMessageAt: string;
  isRead: boolean;
  isLocked: boolean;
  lockedBy: number | null;
}