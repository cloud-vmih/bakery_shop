import { useEffect, useRef, useState, useMemo } from "react";
import { X } from "lucide-react";
import { useChatStore } from "../../stores/customerChat.store";
import { useUser } from "../../context/AuthContext";
import { MessageBubble } from "./MessageBubble";

const ChatBox = () => {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const { user } = useUser();


  const {
    activeConversationId,
    messages,
    initChat,
    sendMessage,
  } = useChatStore();

  const chatEndRef = useRef<HTMLDivElement | null>(null);
  const currentUserId = useMemo(() => {
    return user?.id.toString() ?? localStorage.getItem("guestID");
  }, [user]);
  
  useEffect(() => {
    if (!open) return;
    initChat(currentUserId);
  }, [open, currentUserId, initChat]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "auto" });
  }, [messages, activeConversationId]);

  const currentMessages =  activeConversationId ? messages[activeConversationId] || [] : [];

  const handleSend = async () => {
    if (!input.trim()) return;
    await sendMessage(input);
    setInput("");
  };
return (
    <>
      {/*  NÚT MỞ CHAT */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="
            fixed bottom-5 right-5
            bg-transparent
            hover:scale-110
            transition-transform duration-300
            z-[1000]
            group
          "
        >
          <img
            src="/images/boxchatIcon.png"
            alt="Chat với chúng tôi"
            className="w-60 h-60 object-contain drop-shadow-lg group-hover:drop-shadow-2xl transition-all"
          />
          {/* Tooltip */}
          <div className="absolute -top-1 right-0 bg-emerald-400 text-white text-xs py-1 px-3 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap shadow-lg">
            Chat với chúng tôi
          </div>
        </button>
      )}

      {/*  POPUP CHAT  */}
      {open && (
        <div
          className="fixed bottom-24 right-5 w-[360px] h-[480px] bg-white rounded-2xl shadow-2xl border-2 border-amber-200 overflow-hidden flex flex-col z-[1000] animate-in slide-in-from-bottom-5"
          style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
        >
          {/* HEADER  */}
          <div className="px-6 py-2 bg-gradient-to-r from-amber-100 to-yellow-100 border-b border-amber-200 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-8 h-4 text-green-800 flex items-center justify-center">
                <img
                  src="/images/boxchatHeader.png"
                  alt="Chat với chúng tôi"
                  className="w-10 h-10 object-contain drop-shadow-lg group-hover:drop-shadow-2xl transition-all"
                ></img>
              </div>
              <div>
                <h3 className="text-s font-bold text-green-800">
                  Hỗ trợ khách hàng
                </h3>
                <p className="text-xs text-amber-800 font-medium">
                  Chúng tôi luôn sẵn sàng giúp bạn 
                </p>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="w-8 h-8 rounded-full hover:bg-green-200 flex items-center justify-center transition-colors border border-amber-200 shadow-sm"
            >
              <X size={20} className="text-gray-700" />
            </button>
          </div>

          {/* BODY - Chat messages */}
          <div className="flex-1 px-2 py-4 overflow-y-auto bg-gradient-to-b from-green-50/50 to-amber-50/30">
            {   currentMessages.map((msg) => (
                 <MessageBubble key={msg.id} msg={msg} />
              ))}
            <div ref={chatEndRef} />
          </div>

          {/* INPUT AREA */}
          <div className="p-4 bg-gradient-to-r from-amber-100 to-yellow-100 border-t-2 border-amber-200">
            <div className="flex gap-3">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
                placeholder="Nhập tin nhắn..."
                className="flex-1 px-5 py-1 border-2 border-amber-200 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-100 outline-none transition-all text-gray-800 placeholder-gray-500 bg-white/90"
              />
              <button
                onClick={handleSend}
                disabled={!input.trim()}
                className="px-2 py-1 bg-green-600 text-white font-bold rounded-xl shadow-md hover:bg-green-700 hover:scale-105 transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <span>Gửi</span>
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>

            {/* Decorative elements */}
            <div className="flex justify-center gap-1.5 mt-2">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className={`w-1.5 h-1.5 rounded-full ${
                    i % 3 === 0 ? 'bg-amber-400' : 
                    i % 3 === 1 ? 'bg-green-400' : 
                    'bg-yellow-300'
                  }`}
                ></div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatBox;
