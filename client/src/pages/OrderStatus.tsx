// client/src/pages/OrderStatus.tsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { orderService } from "../services/order.service";
import { Header } from "../components/Header";

export default function OrderStatus() {
  const { orderId } = useParams<{ orderId: string }>();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedReason, setSelectedReason] = useState("");
  const [actionMessage, setActionMessage] = useState<{ text: string; type: "success" | "info" } | null>(null);

  useEffect(() => {
    if (!orderId) return;

    const fetchData = async () => {
      try {
        const res = await orderService.getOrderStatus(Number(orderId));
        setData(res);
      } catch (error) {
        alert("Không thể tải trạng thái đơn hàng");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [orderId]);

  // Tính tổng tiền
  const calculateTotal = () => {
    if (!data?.items || data.items.length === 0) return 0;
    return data.items.reduce((sum: number, item: any) => {
      const price = item.itemInfo?.price || 0;
      const quantity = item.quantity || 1;
      return sum + price * quantity;
    }, 0);
  };

  const totalAmount = calculateTotal();

  // Danh sách lý do hủy
  const cancelReasons = [
    "Tôi muốn thay đổi sản phẩm",
    "Tôi muốn thay đổi địa chỉ giao hàng",
    "Tôi đặt nhầm đơn hàng",
    "Giá sản phẩm thay đổi",
    "Tôi không còn nhu cầu",
    "Lý do khác",
  ];

  // Xử lý hủy/yêu cầu hủy
  const handleCancelOrder = async () => {
    if (!selectedReason) {
      alert("Vui lòng chọn lý do hủy đơn hàng");
      return;
    }

    try {
      const res = await orderService.cancelOrder(Number(orderId));

      if (res.action === "canceled_directly") {
        setActionMessage({ text: "Đơn hàng đã được hủy thành công!", type: "success" });
      } else if (res.action === "cancel_requested") {
        setActionMessage({
          text: "Yêu cầu hủy đơn hàng đã được gửi thành công! Chúng tôi sẽ xử lý và phản hồi sớm nhất.",
          type: "info",
        });
      }

      // Reload dữ liệu để cập nhật trạng thái mới
      const updatedData = await orderService.getOrderStatus(Number(orderId));
      setData(updatedData);

      setShowCancelModal(false);
      setSelectedReason("");

      // Tự động ẩn thông báo sau 5 giây
      setTimeout(() => setActionMessage(null), 5000);
    } catch (error) {
      alert("Thao tác thất bại. Vui lòng thử lại.");
    }
  };

  // Kiểm tra điều kiện
  const canCancel = ["PENDING", "CONFIRMED"].includes(data?.status);
  const isPaid = data?.payStatus === "PAID";
  const cancelStatus = data?.cancelStatus || "NONE";

  // Văn bản và class cho nút hủy
  const getCancelButtonText = () => {
    if (cancelStatus === "REQUESTED") return "Đơn hàng đang được xử lý yêu cầu hủy";
    if (cancelStatus === "APPROVED") return "Đơn hàng đã được hủy";
    if (cancelStatus === "REJECTED") return "Yêu cầu hủy bị từ chối";
    return isPaid ? "Hủy đơn hàng" : "Hủy đơn hàng";
  };
const getCancelButtonClass = () => {
  if (cancelStatus === "REQUESTED") return "bg-orange-500 cursor-not-allowed opacity-90";
  if (cancelStatus === "APPROVED") return "bg-green-600";
  if (cancelStatus === "REJECTED") return "bg-red-600";
  return isPaid ? "bg-red-600 hover:bg-red-700" : "bg-red-600 hover:bg-red-700";
};
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-2xl text-pink-600 font-medium animate-pulse">
          Đang chuẩn bị bánh cho bạn...
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-20">
        <p className="text-4xl text-red-600 font-bold">Không tìm thấy đơn hàng</p>
      </div>
    );
  }

  const handleBuyAgain = () => {
    alert("Chức năng mua lại đang được phát triển!");
  };

  const handleReview = () => {
    alert("Chuyển đến trang đánh giá đơn hàng...");
  };

  return (
      <>
          <Header />
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">
          Đơn hàng {data.orderId}
        </h1>

        {/* Thông báo hành động thành công (popup) */}
        {actionMessage && (
          <div
            className={`fixed top-4 left-1/2 -translate-x-1/2 px-8 py-4 rounded-full shadow-lg z-50 text-white font-bold text-xl animate-pulse ${
              actionMessage.type === "success" ? "bg-green-500" : "bg-blue-600"
            }`}
          >
            {actionMessage.text}
          </div>
        )}

        {/* Thông báo trạng thái hủy (nếu có) - nổi bật trên đầu */}
        {/* Thông báo trạng thái hủy - NỔI BẬT KHI CÓ YÊU CẦU HỦY */}
        {cancelStatus !== "NONE" && (
          <div className="mb-8 p-8 bg-gradient-to-r from-orange-100 to-yellow-100 border-4 border-orange-400 rounded-3xl text-center shadow-xl">
            <p className="text-2xl font-extrabold text-orange-800 leading-relaxed">
              {cancelStatus === "REQUESTED" && "Đơn hàng đang được xử lý yêu cầu hủy"}
              {cancelStatus === "APPROVED" && "Đơn hàng đã được hủy thành công và đang được hoàn tiền"}
              {cancelStatus === "REJECTED" && "Yêu cầu hủy đơn hàng đã bị từ chối. Đơn hàng sẽ tiếp tục được xử lý bình thường"}
            </p>
            <p className="text-lg text-gray-700 mt-4">
              {cancelStatus === "REQUESTED" && "Chúng tôi sẽ phản hồi và xử lý hoàn tiền (nếu được chấp thuận) sớm nhất có thể."}
              {cancelStatus === "APPROVED" && "Số tiền sẽ được hoàn về tài khoản của bạn trong vòng 3-7 ngày làm việc."}
              {cancelStatus === "REJECTED" && "Bạn có thể theo dõi tiến trình đơn hàng bên dưới."}
            </p>
          </div>
        )}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* CỘT TRÁI */}
          <div className="space-y-8">
            {/* Ngày đặt */}
            <div className="bg-white rounded-3xl shadow-lg p-8">
              <p className="text-xl font-bold text-gray-800 mb-4">Ngày đặt</p>
              <p className="text-2xl font-bold text-pink-600">
                {new Date(data.createdAt).toLocaleDateString("vi-VN", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                }) +
                  " " +
                  new Date(data.createdAt).toLocaleTimeString("vi-VN", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
              </p>
            </div>

{/* TIẾN TRÌNH LÀM BÁNH - ĐÃ SỬA HOÀN CHỈNH, ĐẸP VÀ ĐÚNG YÊU CẦU */}
<div className="bg-white rounded-3xl shadow-lg p-8">
  <h2 className="text-2xl font-bold text-gray-800 mb-8">Tiến trình làm bánh</h2>

  {/* Trường hợp đơn hàng đã bị hủy (APPROVED hoặc CANCELED) */}
  {(cancelStatus === "APPROVED" || data.status === "CANCELED") ? (
    <div className="flex items-center py-6">
      <div className="w-12 h-12 rounded-full bg-pink-500 flex items-center justify-center mr-6 flex-shrink-0">
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <p className="text-2xl font-bold text-pink-600">
        Đơn hàng đã bị hủy
      </p>
    </div>
  ) : (
    /* Timeline bình thường - vertical với đường nối */
    <div className="space-y-8">
      {data.timeline.map((step: any, idx: number) => (
        <div key={idx} className="flex items-center">
          {/* Vòng tròn + đường nối dọc */}
          <div className="relative flex flex-col items-center mr-6">
            {/* Vòng tròn */}
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-md z-10
                ${step.completed ? "bg-pink-500" : "bg-gray-300"}
              `}
            >
              {step.completed ? (
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                idx + 1
              )}
            </div>

            {/* Đường nối dọc xuống bước tiếp theo */}
            {idx < data.timeline.length - 1 && (
              <div
                className={`absolute top-12 left-1/2 transform -translate-x-1/2 w-0.5 h-20
                  ${step.completed ? "bg-pink-500" : "bg-gray-300"}
                `}
              />
            )}
          </div>

          {/* Nhãn bước */}
          <p
            className={`text-xl
              ${step.completed ? "text-pink-700 font-bold" : "text-gray-500"}
            `}
          >
            {step.label}
          </p>
        </div>
      ))}
    </div>
  )}
</div>
            {/* Ngày giao dự kiến */}
            <div className="bg-white rounded-3xl shadow-lg p-8">
              <p className="text-xl font-bold text-gray-800 mb-4">
                Ngày giao dự kiến
              </p>
              <p className="text-2xl font-bold text-pink-600">
                {data.deliveryAt
                  ? new Date(data.deliveryAt).toLocaleDateString("vi-VN", {
                      weekday: "long",
                      day: "numeric",
                      month: "long",
                    }) +
                    " " +
                    new Date(data.deliveryAt).toLocaleTimeString("vi-VN", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : "Chưa xác định"}
              </p>
            </div>
          </div>

          {/* CỘT PHẢI */}
          <div className="space-y-8">
            {/* Sản phẩm */}
            <div className="bg-white rounded-3xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Thông tin sản phẩm
              </h2>

              <div className="space-y-6">
                {data.items.map((item: any, idx: number) => {
                  const info = item.itemInfo || {};
                  const quantity = item.quantity || 1;

                  return (
                    <div key={idx} className="flex gap-6 items-start">
                      {info.image ? (
                        <img
                          src={info.image}
                          alt={info.name}
                          className="w-24 h-24 object-cover rounded-2xl shadow flex-shrink-0"
                        />
                      ) : (
                        <div className="w-24 h-24 bg-gray-200 rounded-2xl flex items-center justify-center text-gray-500 text-4xl flex-shrink-0">
                          🍰
                        </div>
                      )}

                      <div className="flex-1">
                        <p className="text-xl font-bold text-gray-800">
                          {info.name || "Bánh ngọt"}
                        </p>

                        {info.flavor && (
                          <p className="text-gray-600 mt-1">
                            Hương vị: {info.flavor}
                          </p>
                        )}

                        <p className="text-gray-700 mt-1">
                          Số lượng: {quantity}
                        </p>

                        <p className="text-xl font-bold text-gray-800 mt-2">
                          {(info.price * quantity).toLocaleString("vi-VN")}đ
                        </p>

                        {item.note && (
                          <p className="mt-3 text-pink-700 italic text-lg">
                            Ghi chú: {item.note}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Thông tin thanh toán */}
            {data.payment && (
              <div className="bg-white rounded-3xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">
                  Thông tin thanh toán
                </h2>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <p className="text-xl text-gray-700">Phương thức thanh toán</p>
                    <p className="text-xl font-bold text-gray-800">
                      {data.payment.method === "COD" ? "Thanh toán khi nhận hàng" :
                        data.payment.method === "BANKING" ? "VNPAY" :
                          data.payment.method || "Chưa xác định"}
                    </p>
                  </div>
                  <div className="flex justify-between">
                    <p className="text-xl text-gray-700">Trạng thái thanh toán</p>
                    <p className={`text-xl font-bold ${data.payment.status === "PAID" ? "text-green-600" : "text-orange-600"}`}>
                      {data.payment.status=== "PAID" ? "Đã thanh toán" : "Chưa thanh toán"}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Tổng cộng + Nút hành động */}
            <div className="bg-white rounded-3xl shadow-lg p-8">
              <div className="space-y-4 border-b border-gray-200 pb-4">
                <div className="flex justify-between">
                  <p className="text-xl text-gray-700">Tạm tính</p>
                  <p className="text-xl font-bold text-gray-800">
                    {totalAmount.toLocaleString("vi-VN")}đ
                  </p>
                </div>
                <div className="flex justify-between">
                  <p className="text-xl text-gray-700">Phí vận chuyển</p>
                  <p className="text-xl font-bold text-gray-800">Miễn phí</p>
                </div>
              </div>

              <div className="flex justify-between mt-6">
                <p className="text-2xl font-bold text-gray-800">TỔNG CỘNG</p>
                <p className="text-2xl font-bold text-pink-600">
                  {totalAmount.toLocaleString("vi-VN")}đ
                </p>
              </div>

              {/* NÚT HÀNH ĐỘNG */}
              <div className="mt-8 space-y-4">
                {/* Nút hủy khi còn được phép và chưa gửi yêu cầu */}
                {canCancel && cancelStatus === "NONE" && (
                  <button
                    onClick={() => setShowCancelModal(true)}
                    className={`w-full px-8 py-4 text-white text-xl font-bold rounded-full transition shadow-lg ${getCancelButtonClass()}`}
                  >
                    {getCancelButtonText()}
                  </button>
                )}

                {/* Trạng thái khi đã có xử lý hủy */}
                {cancelStatus !== "NONE" && (
                  <div className={`w-full px-8 py-4 text-white text-xl font-bold rounded-full text-center ${getCancelButtonClass()}`}>
                    {getCancelButtonText()}
                  </div>
                )}

                {/* Đánh giá + Mua lại khi hoàn thành */}
                {data.status === "COMPLETED" && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <button
                      onClick={handleReview}
                      className="px-8 py-4 bg-yellow-500 text-white text-xl font-bold rounded-full hover:bg-yellow-600 transition shadow-lg"
                    >
                      Đánh giá
                    </button>
                    <button
                      onClick={handleBuyAgain}
                      className="px-8 py-4 bg-pink-600 text-white text-xl font-bold rounded-full hover:bg-pink-700 transition shadow-lg"
                    >
                      Mua lại
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal chọn lý do hủy */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-lg w-full">
            <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
              {isPaid ? "Yêu cầu hủy đơn hàng" : "Xác nhận hủy đơn hàng"}
            </h3>
            <p className="text-gray-600 mb-6 text-center">
              {isPaid
                ? "Bạn đã thanh toán. Yêu cầu hủy sẽ được gửi đến cửa hàng để duyệt và hoàn tiền (nếu được chấp thuận)."
                : "Bạn chưa thanh toán, đơn hàng sẽ được hủy ngay lập tức."}
            </p>

            <p className="text-gray-700 mb-4">Vui lòng chọn lý do:</p>
            <div className="space-y-3 mb-8">
              {cancelReasons.map((reason) => (
                <label
                  key={reason}
                  className="flex items-center p-4 border rounded-2xl cursor-pointer hover:bg-pink-50 transition"
                >
                  <input
                    type="radio"
                    name="cancelReason"
                    value={reason}
                    checked={selectedReason === reason}
                    onChange={(e) => setSelectedReason(e.target.value)}
                    className="w-5 h-5 text-pink-600 focus:ring-pink-500"
                  />
                  <span className="ml-4 text-gray-800">{reason}</span>
                </label>
              ))}
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => {
                  setShowCancelModal(false);
                  setSelectedReason("");
                }}
                className="flex-1 px-6 py-3 bg-gray-200 text-gray-800 font-bold rounded-full hover:bg-gray-300 transition"
              >
                Hủy bỏ
              </button>
              <button
                onClick={handleCancelOrder}
                disabled={!selectedReason}
                className={`flex-1 px-6 py-3 font-bold rounded-full transition ${
                  selectedReason
                    ? "bg-red-600 text-white hover:bg-red-700"
                    : "bg-gray-400 text-gray-200 cursor-not-allowed"
                }`}
              >
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
      </>
  );
}