import { useNavigate } from "react-router-dom";
import { ShoppingBag, UserPlus, LogIn } from "lucide-react";

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function RequireAuthModal({ open, onClose }: Props) {
  const navigate = useNavigate();

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-[400px] rounded-3xl bg-white shadow-2xl p-8 animate-scaleIn">
        {/* Icon */}
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
          <ShoppingBag className="h-8 w-8 text-emerald-600" />
        </div>

        {/* Title */}
        <h3 className="text-center text-2xl font-bold text-gray-900">
          Đăng nhập để tiếp tục
        </h3>

        {/* Subtitle */}
        <p className="mt-2 text-center text-sm text-gray-600 leading-relaxed">
          Đăng nhập để lưu giỏ hàng, theo dõi đơn hàng
          <br />
          và nhận ưu đãi hấp dẫn từ <b>MyBakery</b> 🍰
        </p>

        {/* Actions */}
        <div className="mt-7 space-y-3">
          <button
            onClick={() => {
              onClose();
              navigate("/login");
            }}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3 font-semibold text-white hover:bg-emerald-700 transition"
          >
            <LogIn className="h-4 w-4" />
            Đăng nhập
          </button>

          <button
            onClick={() => {
              onClose();
              navigate("/register");
            }}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-emerald-600 py-3 font-semibold text-emerald-700 hover:bg-emerald-50 transition"
          >
            <UserPlus className="h-4 w-4" />
            Tạo tài khoản mới
          </button>
        </div>

        {/* Skip */}
        <button
          onClick={onClose}
          className="mt-6 block w-full text-center text-sm text-gray-500 hover:text-gray-700 hover:underline"
        >
          Tiếp tục xem menu
        </button>
      </div>
    </div>
  );
}
