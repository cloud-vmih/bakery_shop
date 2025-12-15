// client/src/pages/OrderStatus.tsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { orderService } from "../services/order.service";

export default function OrderStatus() {
  const { orderId } = useParams<{ orderId: string }>();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedReason, setSelectedReason] = useState("");
  const [cancelSuccess, setCancelSuccess] = useState(false);

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

  // Xử lý hủy đơn
  const handleCancelOrder = async () => {
    if (!selectedReason) {
      alert("Vui lòng chọn lý do hủy đơn hàng");
      return;
    }

    try {
      await orderService.cancelOrder(Number(orderId));
      setCancelSuccess(true);
      setShowCancelModal(false);
      setSelectedReason("");
      // Reload dữ liệu để cập nhật trạng thái mới
      const updatedData = await orderService.getOrderStatus(Number(orderId));
      setData(updatedData);
    } catch (error) {
      alert("Hủy đơn hàng thất bại. Vui lòng thử lại.");
    }
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

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">
          Đơn hàng {data.orderId}
        </h1>

        {/* 2 cột */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* CỘT TRÁI: Ngày đặt + Tiến trình + Ngày giao */}
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

            {/* Tiến trình */}
            <div className="bg-white rounded-3xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Tiến trình làm bánh
              </h2>
              <div className="space-y-8">
                {data.timeline.map((step: any, idx: number) => (
                  <div key={idx} className="flex items-center">
                    <div className="relative flex flex-col items-center mr-6">
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-md z-10
                          ${step.completed ? "bg-pink-500" : "bg-gray-300"}
                        `}
                      >
                        {step.completed ? "✓" : idx + 1}
                      </div>

                      {idx < data.timeline.length - 1 && (
                        <div
                          className={`absolute top-12 w-0.5 h-16 -z-10
                            ${step.completed ? "bg-pink-500" : "bg-gray-300"}
                          `}
                        />
                      )}
                    </div>

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

          {/* CỘT PHẢI: Sản phẩm + Tổng cộng + Nút hành động */}
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
                          Cake
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
                          {(info.price).toLocaleString("vi-VN")}đ
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
                       data.payment.method}
                    </p>
                  </div>
                  <div className="flex justify-between">
                    <p className="text-xl text-gray-700">Trạng thái</p>
                    <p className={`text-xl font-bold ${data.payment.status === "PAID" ? "text-green-600" : "text-orange-600"}`}>
                      {data.payment.status === "PAID" ? "Đã thanh toán" : "Chưa thanh toán"}
                    </p>
                  </div>
              </div>
              </div>
            )}

            {/* Tổng cộng */}
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

              {/* Nút hủy đơn */}
              {["PENDING", "CONFIRMED"].includes(data.status) && (
                <div className="mt-8">
                  <button
                    onClick={() => setShowCancelModal(true)}
                    className="w-full px-8 py-4 bg-red-600 text-white text-xl font-bold rounded-full hover:bg-red-700 transition shadow-lg"
                  >
                    Huỷ đơn hàng
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal chọn lý do hủy */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-lg w-full">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">
              Lý do hủy đơn hàng
            </h3>
            <p className="text-gray-600 mb-6">
              Vui lòng chọn lý do để chúng tôi phục vụ bạn tốt hơn:
            </p>

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
                className={`flex-1 px-6 py-3 font-bold rounded-full transition
                  ${selectedReason
                    ? "bg-red-600 text-white hover:bg-red-700"
                    : "bg-gray-400 text-gray-200 cursor-not-allowed"
                  }`}
              >
                Xác nhận hủy
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Thông báo hủy thành công */}
      {cancelSuccess && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 bg-green-500 text-white px-8 py-4 rounded-full shadow-lg z-50 animate-pulse">
          Hủy thành công!
        </div>
      )}
    </div>
  );
}