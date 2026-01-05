import { Link, useSearchParams } from "react-router-dom";

export default function PaymentFailedPage() {
  const [params] = useSearchParams();

  const orderId = params.get("orderId");
  const reason = params.get("reason");

  const getMessage = () => {
    switch (reason) {
      case "FAILED":
        return "Thanh toán thất bại hoặc bị huỷ. Vui lòng thử lại.";

      case "UNKNOWN":
        return "Có lỗi xảy ra khi xử lý kết quả thanh toán.";

      default:
        return "Thanh toán thất bại hoặc đã bị gián đoạn.";
    }
  };

  return (
    <>
      <div className="min-h-[calc(100vh-80px)] bg-gradient-to-br from-rose-50 via-red-50 to-orange-50 flex items-center justify-center px-4">
        <div className="w-full max-w-lg bg-white rounded-3xl shadow-xl p-8 text-center">
          {/* ICON */}
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-red-100">
            <svg
              className="h-8 w-8 text-red-600"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>

          {/* TITLE */}
          <h2 className="text-2xl font-bold text-red-700 mb-2">
            Thanh toán không thành công
          </h2>

          {/* MESSAGE – lấy từ reason */}
          <p className="text-sm text-gray-600 mb-6 leading-relaxed">
            {getMessage()}
          </p>

          {/* ORDER INFO CARD */}
          {orderId && (
            <div className="mb-8 rounded-2xl border border-red-100 bg-red-50/50 px-6 py-4 text-sm">
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-500">Mã đơn hàng</span>
                <span className="font-semibold text-gray-900">#{orderId}</span>
              </div>

              <div className="flex justify-between items-center py-2">
                <span className="text-gray-500">Trạng thái</span>
                <span className="inline-flex items-center gap-2 rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700">
                  <span className="h-2 w-2 rounded-full bg-red-500"></span>
                  CANCELED
                </span>
              </div>

              <div className="flex justify-between items-center py-2">
                <span className="text-gray-500">Thanh toán</span>
                <span className="font-medium text-gray-900">VNPay</span>
              </div>
            </div>
          )}

          {/* ACTIONS */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              to="/checkout"
              className="flex-1 rounded-xl bg-red-600 px-6 py-3 text-sm font-semibold text-white hover:bg-red-700 transition"
            >
              Thanh toán lại
            </Link>

            <Link
              to="/"
              className="flex-1 rounded-xl border border-gray-300 px-6 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition"
            >
              Về trang chủ
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
