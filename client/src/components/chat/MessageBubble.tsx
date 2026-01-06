import { ChatMessage } from "../../types/chat.type";
import { useUser } from "../../context/AuthContext";
import { useMemo } from "react";

export const MessageBubble = ({ msg }: { msg: ChatMessage }) => {
  const { user } = useUser();

  const isMine = useMemo(() => {
    return user?.id?.toString() === msg.senderId;
  }, [user?.id, msg.senderId]);

  const time = useMemo(() => {
    if (!msg.createdAt) return "";
    const d = new Date(msg.createdAt);
    return isNaN(d.getTime()) ? "" : d.toLocaleTimeString("vi-VN");
  }, [msg.createdAt]);

  return (
    <div className={`mb-3 flex ${isMine ? "justify-end" : "justify-start"}`}>
      <div
        className={`px-4 py-2 rounded-xl break-words max-w-[75%]
          ${
            isMine
              ? "bg-green-500 text-white rounded-br-none"
              : "bg-gray-200 text-gray-800 rounded-bl-none"
          }
        `}
      >
        {msg.content}

        {time && (
          <div className="text-xs opacity-70 mt-1 text-right">
            {time}
          </div>
        )}
      </div>
    </div>
  );
};
