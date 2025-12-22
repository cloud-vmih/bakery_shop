import { Link, useSearchParams } from "react-router-dom";

export default function PaymentFailedPage() {
  const [params] = useSearchParams();

  const orderId = params.get("orderId");
  const reason = params.get("reason");

  const getMessage = () => {
    switch (reason) {
      case "FAILED":
        return "Thanh toán không thành công.";
      case "CANCELED":
        return "Bạn đã huỷ thanh toán.";
      case "INVALID_HASH":
        return "Dữ liệu thanh toán không hợp lệ.";
      default:
        return "Thanh toán thất bại hoặc đã bị gián đoạn.";
    }
  };

  return (
    <div className="min-h-[70vh] bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 text-center">
        {/* ICON */}
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-100">
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

        {/* MESSAGE */}
        <p className="text-sm text-gray-600 mb-4">{getMessage()}</p>

        <p className="text-sm text-gray-500 mb-6">
          Giao dịch VNPay không hoàn tất hoặc đã bị huỷ. Bạn có thể thử lại hoặc
          chọn phương thức thanh toán khác.
        </p>

        {/* ORDER ID */}
        {orderId && (
          <div className="mb-6 text-sm">
            <span className="text-gray-500">Mã đơn hàng:</span>{" "}
            <span className="font-semibold text-gray-900">#{orderId}</span>
          </div>
        )}

        {/* ACTIONS */}
        <div className="mt-8 flex flex-col sm:flex-row gap-3">
          <Link
            to="/checkout"
            className="flex-1 rounded-xl bg-red-600 px-5 py-3 text-sm font-semibold text-white text-center hover:bg-red-700 transition"
          >
            Thanh toán lại
          </Link>

          <Link
            to="/"
            className="flex-1 rounded-xl bg-gray-100 px-5 py-3 text-sm font-semibold text-gray-700 text-center hover:bg-gray-200 transition"
          >
            Về trang chủ
          </Link>
        </div>
      </div>
    </div>
  );
}
