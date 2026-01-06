import { useNotificationStore } from "../stores/notification.store";
import { useNavigate } from "react-router-dom";

export const NotificationDropdown = ({ onClose }: { onClose: () => void }) => {
  const { notifications, markAsRead } = useNotificationStore();
  const navigate = useNavigate();

  const handleClick = (n: any) => {
    markAsRead(n.id);

    if (n.href) {
      navigate(n.href);
    }

    onClose();
  };

  return (
    <div className="absolute right-0 mt-2 w-96 bg-white border rounded-xl shadow-xl z-[1000]">
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
            onClick={() => handleClick(n)}
          >
            <div className="font-medium">{n.title}</div>

            <div className="text-sm text-gray-600">
              {n.content}
            </div>

            <div className="text-xs text-gray-400 mt-1">
              {n.sentAt
                ? new Date(n.sentAt).toLocaleString("vi-VN")
                : ""}
            </div>

          </button>
        ))}
      </div>
    </div>
  );
};
