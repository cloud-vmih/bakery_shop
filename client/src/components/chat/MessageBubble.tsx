import { ChatMessage } from "../../types/chat.type";
import { useUser } from "../../context/authContext";
import { useMemo } from "react";

export const MessageBubble = ({ msg }: { msg: ChatMessage }) => {
  const { user } = useUser();

  const isMine = useMemo(() => {
    return user?.id?.toString() === msg.senderId;
  }, [user?.id, msg.senderId]);

  return (
    <div
      className={`mb-3 flex ${
        isMine ? "justify-end" : "justify-start"
      }`}
    >
      <div
        className={`px-4 py-2 rounded-xl break-words
          max-w-[75%]
          ${
            isMine
              ? "bg-green-500 text-white rounded-br-none"
              : "bg-gray-200 text-gray-800 rounded-bl-none"
          }
        `}
      >
        {msg.content}

        <div className="text-xs opacity-70 mt-1 text-right">
          {new Date(msg.createdAt).toLocaleTimeString()}
        </div>
      </div>
    </div>
  );
};
