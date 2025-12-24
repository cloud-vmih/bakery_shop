// pages/AdminConversationList.tsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAdminConversationListStore } from "../../stores/adminConversationList.store";

export default function AdminConversationList() {
  const { conversations, load, attachSocket } =
    useAdminConversationListStore();
  const navigate = useNavigate();

  useEffect(() => {
    load();
    attachSocket();
  }, []);

return (
  <div 
    className="min-h-screen bg-gradient-to-b from-green-50/30 to-amber-50/20 p-4 md:p-6"
    style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
  >
    {/* Header */}
    <div className="mb-6 md:mb-8">
      <h1 className="text-2xl md:text-3xl font-bold text-green-800 mb-2">
        Quản lý hội thoại
      </h1>
      <p className="text-amber-700 font-medium">
        Tổng số: <span className="font-bold text-green-600">{conversations.length}</span> cuộc trò chuyện
      </p>
    </div>

    {/* Conversations List */}
    <div className="space-y-3 md:space-y-4 max-w-4xl mx-auto">
      {conversations.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-20 h-20 mx-auto mb-4 opacity-30">
            <img
              src="/images/boxchatHeader.png"
              alt="No conversations"
              className="w-full h-full object-contain"
            />
          </div>
          <p className="text-gray-500 font-medium">Chưa có cuộc trò chuyện nào</p>
        </div>
      ) : (
        conversations.map((c) => (
          <div
            key={c.id}
            onClick={() => navigate(`/admin/conversations/${c.id}`)}
            className="group relative"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-green-500/0 via-green-500/0 to-green-500/0 group-hover:from-green-500/5 group-hover:via-emerald-500/5 group-hover:to-green-500/5 rounded-2xl transition-all duration-300" />
            
            <div className="relative p-4 md:p-5 bg-white/80 backdrop-blur-sm rounded-2xl border-2 border-amber-100 hover:border-green-300 hover:shadow-lg hover:shadow-green-100/50 transition-all duration-300 cursor-pointer">
              {/* Main Row */}
              <div className="flex items-start justify-between gap-3 mb-2">
                {/* User Info */}
                <div className="flex items-center gap-3 min-w-0">
                  <div className="flex-shrink-0 w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-amber-100 to-yellow-100 rounded-xl border border-amber-200 flex items-center justify-center shadow-sm">
                    <span className="text-lg md:text-xl font-bold text-green-700">
                      {c.userId?.toString().toUpperCase() || 'U'}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <b className="text-green-800 truncate text-base md:text-lg">
                        Người dùng: {c.userId}
                      </b>
                      {c.isLocked && (
                        <div className="flex-shrink-0">
                          <span className="inline-flex items-center gap-1 bg-red-50 text-red-600 text-xs font-bold px-2 py-1 rounded-full border border-red-200">
                            <span className="text-xs">🔒</span>
                            <span className="hidden sm:inline">Đã khóa</span>
                          </span>
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      ID: <span className="font-mono text-green-700">{c.id}</span>
                    </p>
                  </div>
                </div>

                {/* Status Indicator */}
                <div className="flex-shrink-0">
                  <div className={`w-3 h-3 rounded-full ${c.isLocked ? 'bg-red-400' : 'bg-green-400'} shadow-sm`} />
                </div>
              </div>

              {/* Last Message Preview */}
              <div className="mt-3 pl-13 md:pl-14"> {/* Align with user avatar */}
                <p className="text-sm text-gray-600 line-clamp-2 group-hover:text-gray-800 transition-colors">
                  {c.lastMessage || <span className="text-gray-400 italic">Chưa có tin nhắn</span>}
                </p>
              </div>

              {/* Hover Arrow */}
              <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </div>
        ))
      )}
    </div>

    {/* Decorative Footer */}
    <div className="mt-8 md:mt-12 pt-6 border-t border-amber-100">
      <div className="flex justify-center gap-1.5">
        {[...Array(7)].map((_, i) => (
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
      <p className="text-center text-xs text-gray-500 mt-4">
        Chọn một cuộc trò chuyện để xem chi tiết
      </p>
    </div>
  </div>
);
}