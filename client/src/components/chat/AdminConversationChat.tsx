// pages/AdminConversationChat.tsx
import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAdminConversationChatStore } from "../../stores/adminConversationChat.store";
import { MessageBubble } from "./MessageBubble";
import { Header } from "../Header";

export default function AdminConversationChat() {
  const { id } = useParams();
  const navigate = useNavigate();
  const store = useAdminConversationChatStore();
  const [input, setInput] = useState("");
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!id) return;

    store.enter(Number(id));
    store.attachSocket();

    return () => {
      store.leave();
    };
  }, [id]);

useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "auto" });
  }, [store.messages]);

return (
  <>
    < Header />
    {/* MAIN CONTAINER */}
    <div
      className="relative h-screen-50 bg-gradient-to-b from-green-50/50 to-amber-50/30 overflow-hidden"
      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
    >
      {/* HEADER */}
      <div className="px-4 md:px-6 py-3 bg-gradient-to-r from-amber-100 to-yellow-100 border-b-2 border-amber-200 shadow-sm">
        <div className="flex items-center gap-2 md:gap-3">
          <button
            onClick={() => navigate(-1)}
            className="w-9 h-9 md:w-10 md:h-10 rounded-full hover:bg-green-200 flex items-center justify-center transition-colors border border-amber-200 shadow-sm group active:scale-95"
          >
            <div className="text-gray-700 font-bold text-lg md:text-base group-hover:scale-110 transition-transform">
              ⬅
            </div>
            {/* Tooltip */}
            <div className="hidden md:block absolute left-12 bg-emerald-400 text-white text-xs py-1 px-3 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap shadow-lg">
              Quay lại
            </div>
          </button>

          {/* Logo and Title */}
          <div className="flex items-center gap-2 md:gap-3">
            <div className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center flex-shrink-0">
              <img
                src="/images/boxchatHeader.png"
                alt="Chat"
                className="w-full h-full object-contain drop-shadow-lg"
              />
            </div>
            <div className="min-w-0">
              <h3 className="text-sm md:text-base font-bold text-green-800 truncate">
                Hỗ trợ khách hàng
              </h3>
              <p className="text-xs text-amber-800 font-medium truncate">
                Chúng tôi luôn sẵn sàng giúp bạn
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* MESSAGES AREA */}
      <div className="flex-1 px-3 md:px-4 py-4 overflow-y-auto h-[calc(100vh-140px)] sm:h-[calc(100vh-150px)]">
        <div className="max-w-3xl mx-auto"> 
          {store.messages.map((m) => (
            <MessageBubble key={m.id} msg={m} />
          ))}
        </div>
        <div ref={chatEndRef} />
      </div>

      {/* INPUT AREA*/}
      <div className="px-3 md:px-4 py-3 md:py-4 bg-gradient-to-r from-amber-100 to-yellow-100 border-t-2 border-amber-200 shadow-inner">
        <div className="max-w-3xl mx-auto">
          <div className="flex gap-2 md:gap-3">
            <input
              disabled={store.locked}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && store.send(e.currentTarget.value)}
              placeholder={store.locked ? "Cuộc trò chuyện đã kết thúc" : "Nhập tin nhắn..."}
              className={`flex-1 px-3 md:px-5 py-2 md:py-3 border-2 rounded-lg md:rounded-xl outline-none transition-all text-gray-800 placeholder-gray-500 bg-white/90 text-sm md:text-base ${
                store.locked
                  ? "border-gray-300 cursor-not-allowed opacity-70"
                  : "border-amber-200 focus:border-green-500 focus:ring-2 md:focus:ring-4 focus:ring-green-100"
              }`}
            />
            <button
              onClick={() => store.send(input)}
              disabled={store.locked || !input.trim()}
              className="px-3 md:px-4 py-2 md:py-3 bg-green-600 text-white font-bold rounded-lg md:rounded-xl shadow-md hover:bg-green-700 hover:scale-105 active:scale-95 transition-all disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-1 md:gap-2 text-sm md:text-base whitespace-nowrap"
            >
              <span className="hidden xs:inline">Gửi</span>
              <svg 
                className="w-4 h-4 md:w-4 md:h-4" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>

          {/* Footer trang trí*/}
          <div className="flex justify-center gap-1.5 mt-2 md:mt-3">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className={`w-1.5 h-1.5 md:w-1.5 md:h-1.5 rounded-full ${
                  i % 3 === 0 ? 'bg-amber-400' : 
                  i % 3 === 1 ? 'bg-green-400' : 
                  'bg-yellow-300'
                }`}
              ></div>
            ))}
          </div>
        </div>
      </div>

    </div>
  </>
);
}
