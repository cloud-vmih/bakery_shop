export interface ChatMessage {
  id: number;
  conversationId: number;
  senderId: string;
  senderType: "GUEST" | "USER";
  content: string;
  createdAt: string;
}

export interface MessagePage {
  items: ChatMessage[];
  nextCursor: string | null;
}

