import { create } from "zustand";
import { useSocketStore } from "./socket.store";

interface Notification {
  id: number;
  title: string;
  content: string;
  isRead: boolean;
}

interface NotificationStore {
  notifications: Notification[];
  unreadCount: number;

  attachSocketListeners: () => void;
  markAsRead: (id: number) => void;
}

export const useNotificationStore = create<NotificationStore>((set, get) => ({
  notifications: [],
  unreadCount: 0,

  attachSocketListeners: () => {
    const socket = useSocketStore.getState().socket;
    if (!socket) return;

    socket.off("notification:new");

    socket.on("notification:new", (notification) => {
      set((state) => ({
        notifications: [notification, ...state.notifications],
        unreadCount: state.unreadCount + 1,
      }));
    });
  },

  markAsRead: (id) => {
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === id ? { ...n, isRead: true } : n
      ),
      unreadCount: Math.max(0, state.unreadCount - 1),
    }));
  },
}));
