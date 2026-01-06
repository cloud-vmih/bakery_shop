import { create } from "zustand";
import { useSocketStore } from "./socket.store";
import toast from "react-hot-toast";

interface Notification {
  id: number;
  title: string;
  content: string;
  sentAt: string;
  isRead: boolean;
  href?: string;
}

interface NotificationStore {
  notifications: Notification[];
  unreadCount: number;

  init: () => void;
  markAsRead: (id: number) => void;
}

export const useNotificationStore = create<NotificationStore>((set, get) => ({
  notifications: [],
  unreadCount: 0,

  init() {
    const socket = useSocketStore.getState().socket;

    if (!socket) return;
    socket.emit("notification:list", null, (data: Notification[]) => {
      set({
        notifications: data,
        unreadCount: data.filter((n) => !n.isRead).length,
      });
    });

    socket.off("notification:new");
    socket.on("notification:new", (n) => {
      set((s) => ({
        notifications: [n, ...s.notifications],
        unreadCount: s.unreadCount + 1,
      }));
    });
  },

  markAsRead(id: number) {
    const socket = useSocketStore.getState().socket;

    if (!socket) return;
    socket.emit("notification:markRead", { id });

    set((s) => {
      const wasUnread = s.notifications.find(n => n.id === id && !n.isRead);

      return {
        notifications: s.notifications.map((n) =>
          n.id === id ? { ...n, isRead: true } : n
        ),
        unreadCount: wasUnread
          ? Math.max(0, s.unreadCount - 1)
          : s.unreadCount,
      };
    });
  },
}));

