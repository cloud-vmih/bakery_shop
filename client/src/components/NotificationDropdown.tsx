import { useNotificationStore } from "../stores/notification.store";
import { formatDistanceToNow, parseISO } from "date-fns";
import { vi } from "date-fns/locale";

export const NotificationDropdown = ({ onClose }: { onClose: () => void }) => {
  const { notifications, markAsRead } = useNotificationStore();

  return (
    <div
      className="absolute right-0 mt-2 w-96 bg-white border rounded-xl shadow-xl z-50"
    >
      <div className="p-3 font-semibold border-b flex justify-between">
        <span>Thông báo</span>

        <button
          className="text-sm text-gray-500 hover:underline"
          onClick={onClose}
        >
          Đóng
        </button>
      </div>

      <div className="max-h-96 overflow-y-auto">
        {notifications.length === 0 && (
          <div className="p-4 text-sm text-gray-500 text-center">
            Chưa có thông báo
          </div>
        )}

        {notifications.map((n) => (
          <button
            key={n.id}
            className={`w-full text-left p-3 border-b hover:bg-gray-50 transition ${
              !n.isRead ? "bg-blue-50" : ""
            }`}
            onClick={() => markAsRead(n.id)}
          >
            <div className="font-medium">{n.title}</div>

            <div className="text-sm text-gray-600">
              {n.content}
            </div>

            <div className="text-xs text-gray-400 mt-1">
              {formatDistanceToNow(parseISO(n.createAt), {
                addSuffix: true,
                locale: vi,
              })}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
