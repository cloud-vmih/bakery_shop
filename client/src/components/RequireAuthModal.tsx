import { useNavigate } from "react-router-dom";

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
      <div className="relative bg-white rounded-2xl p-7 w-[380px] shadow-2xl animate-scaleIn">
        {/* Icon */}
        <div className="w-14 h-14 rounded-full bg-cyan-100 flex items-center justify-center mx-auto mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-7 h-7 text-cyan-700"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17"
            />
          </svg>
        </div>

        {/* Content */}
        <h3 className="text-xl font-bold text-center text-gray-800 mb-2">
          Vui lòng đăng nhập
        </h3>

        <p className="text-center text-gray-600 mb-6 text-sm leading-relaxed">
          Bạn cần đăng nhập để tiếp tục mua hàng và quản lý giỏ hàng của mình.
        </p>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={() => {
              onClose();
              navigate("/login");
            }}
            className="flex-1 bg-cyan-700 text-white py-2.5 rounded-xl font-semibold hover:bg-cyan-800 transition"
          >
            Đăng nhập
          </button>

          <button
            onClick={() => {
              onClose();
              navigate("/register");
            }}
            className="flex-1 border border-cyan-700 text-cyan-700 py-2.5 rounded-xl font-semibold hover:bg-cyan-50 transition"
          >
            Đăng ký
          </button>
        </div>

        {/* Skip */}
        <button
          onClick={onClose}
          className="mt-5 text-sm text-gray-500 hover:text-gray-700 hover:underline block mx-auto"
        >
          Để sau
        </button>
      </div>
    </div>
  );
}
