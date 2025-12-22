import { useEffect, useRef, useState, useMemo } from "react";
import { X, MessageCircle } from "lucide-react";
import { useChatStore } from "../../stores/chat.store";
import { useUser } from "../../context/authContext";

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
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, activeConversationId]);

  const currentMessages =  activeConversationId ? messages[activeConversationId] || [] : [];

  const handleSend = async () => {
    if (!input.trim()) return;
    await sendMessage(input);
    setInput("");
  };

  return (
    <>
      {/* ================= NÚT MỞ CHAT - HÌNH BÁNH CUPCAKE ================= */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 w-18 h-20 rounded-full hover:scale-110 transition-all duration-300 z-[1000] flex flex-col items-center justify-end pb-1 group"
        >
          {/* Cupcake base */}
          <div className="relative w-16 h-16 rounded-full bg-gradient-to-b from-amber-400 to-amber-500 shadow-xl border-2 border-amber-300 group-hover:border-amber-400 group-hover:shadow-2xl transition-all">
            {/* Cupcake wrapper */}
            <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-14 h-8 rounded-t-full bg-gradient-to-b from-amber-200 to-amber-300 border-2 border-amber-100"></div>
            
            {/* Pink frosting/whip */}
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-gradient-to-b from-pink-300 to-pink-400 border-2 border-pink-200 shadow-inner">
              {/* Swirl effect */}
              <div className="absolute top-1 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full border-2 border-pink-100/50"></div>
            </div>
            
            {/* Cherry/Sprinkle icon */}
            <img
              src="https://cdn-icons-png.flaticon.com/512/5992/5992459.png"
              alt="Chat với chúng tôi"
              className="absolute top-1 left-1/2 -translate-x-1/2 w-6 h-6 object-contain z-10 animate-bounce"
            />
          </div>
          
          {/* Glow effect */}
          <div className="absolute inset-0 rounded-full bg-yellow-200/20 blur-md group-hover:bg-yellow-300/30 transition-all -z-10"></div>
        </button>
      )}

      {/* ================= POPUP CHAT NHỎ HƠN ================= */}
      {open && (
        <div
          className="fixed bottom-28 right-6 w-80 h-[440px] bg-white rounded-2xl shadow-2xl border-2 border-amber-100 overflow-hidden flex flex-col z-[1000] transform transition-all duration-300 scale-100"
          style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
        >
          {/* HEADER - Cupcake themed */}
          <div className="px-5 py-3 bg-gradient-to-r from-pink-300 via-pink-400 to-amber-400 text-white flex justify-between items-center relative">
            {/* Cupcake sprinkle pattern */}
            <div className="absolute top-1 right-4 w-6 h-6 opacity-30">
              <div className="w-1 h-1 bg-white rounded-full absolute top-1 left-2"></div>
              <div className="w-1 h-1 bg-white rounded-full absolute top-3 right-1"></div>
              <div className="w-1 h-1 bg-yellow-200 rounded-full absolute bottom-1 left-1"></div>
            </div>
            
            <div className="relative z-10">
              <h3 className="text-base font-bold drop-shadow-sm">Hỗ trợ khách hàng</h3>
              <p className="text-xs opacity-95">Chúng tôi luôn sẵn sàng giúp bạn 🍰</p>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="w-7 h-7 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors backdrop-blur-sm"
            >
              <X size={16} />
            </button>
          </div>

          {/* BODY - Danh sách tin nhắn */}
          <div className="flex-1 p-4 overflow-y-auto bg-gradient-to-b from-pink-50/40 to-amber-50/30">
            {currentMessages.map((msg) => {
              const isMine = msg.senderId === currentUserId;
              return (
                <div
                  key={msg.id}
                  className={`mb-3 max-w-[85%] ${
                    isMine ? "ml-auto" : "mr-auto"
                  }`}
                >
                  <div
                    className={`px-3 py-2.5 rounded-2xl shadow-sm backdrop-blur-sm border ${
                      isMine
                        ? "bg-gradient-to-r from-amber-500 to-amber-600 text-white border-amber-400"
                        : "bg-gradient-to-r from-pink-100 to-white text-gray-800 border-pink-200"
                    } transition-all duration-200`}
                  >
                    <p className="text-sm leading-relaxed">{msg.content}</p>
                  </div>
                  <div className={`text-xs mt-1 px-2 text-gray-500 ${isMine ? 'text-right' : 'text-left'}`}>
                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              );
            })}
            <div ref={chatEndRef} />
          </div>

          {/* INPUT AREA - Cupcake wrapper themed */}
          <div className="p-3 bg-gradient-to-r from-amber-50 to-pink-50 border-t-2 border-amber-200">
            <div className="flex gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
                placeholder="Nhập tin nhắn..."
                className="flex-1 px-4 py-2.5 rounded-full border-2 border-amber-300 focus:border-pink-400 focus:outline-none text-sm bg-white/80 placeholder-gray-500 transition-all duration-300 hover:border-amber-400"
              />
              <button
                onClick={handleSend}
                disabled={!input.trim()}
                className="px-5 py-2.5 bg-gradient-to-r from-pink-400 to-amber-500 text-white font-semibold rounded-full shadow-md hover:from-pink-500 hover:to-amber-600 hover:shadow-lg disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-300 flex items-center gap-1.5 min-w-[70px] justify-center"
              >
                <span className="text-sm">Gửi</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
            
            {/* Decorative sprinkles */}
            <div className="flex justify-center gap-1 mt-2">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className={`w-1 h-1 rounded-full ${
                    i % 3 === 0 ? 'bg-pink-400' : 
                    i % 3 === 1 ? 'bg-amber-400' : 
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
