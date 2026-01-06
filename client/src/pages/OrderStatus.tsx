// client/src/pages/OrderStatus.tsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { orderService } from "../services/order.service";
import { addToCart } from "../services/cart.service"; // Hàm addToCart nhận (itemId: number, quantity?: number)
import { Review} from "../services/review.service"; // Hàm addToCart nhận (itemId: number, quantity?: number)
import { useCart } from "../context/CartContext";
import toast from "react-hot-toast";
import {getBranches} from "../services/branch.service";
import { calculateShippingFee } from "../utils/shippingCalculator";
import { getTotalMembershipDiscountByOrder } from "../utils/pricing";
export default function OrderStatus() {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedReason, setSelectedReason] = useState("");
  const [actionMessage, setActionMessage] = useState<{ text: string; type: "success" | "info" } | null>(null);
  const [branches, setBranches] = useState<any[]>([]);
  const [discount, setDiscount] = useState<number>(0);

  useEffect(() => {
    if (!orderId) return;

    const fetchData = async () => {
      try {
        const res = await orderService.getOrderStatus(Number(orderId));
        const discount = await getTotalMembershipDiscountByOrder(data);
        setData(res);
        setDiscount(discount)
      } catch (error) {
        alert("Không thể tải trạng thái đơn hàng");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [orderId]);

  useEffect(() => {
        getBranches()
            .then(setBranches)
            .catch(() => {
                toast.error("Không thể tải danh sách chi nhánh");
            });
    }, []);
    const branch = branches.find(b => b.id === data?.branchId);

  // Tính toán giá
  const subtotal =
    data?.items?.reduce((sum: number, i: any) => {
      const price = i.item?.price || 0;
      const quantity = i.quantity || 1;
      return sum + price * quantity;
    }, 0) || 0;


  const vat = Math.round(subtotal * 0.1);
  const shipping = calculateShippingFee(branch?.address.lat, branch?.address.lng, data?.address.lat, data?.address.lng)
  const grandTotal = subtotal + vat + shipping - discount;

  const cancelReasons = [
    "Tôi muốn thay đổi sản phẩm",
    "Tôi muốn thay đổi địa chỉ giao hàng",
    "Tôi đặt nhầm đơn hàng",
    "Giá sản phẩm thay đổi",
    "Tôi không còn nhu cầu",
    "Lý do khác",
  ];

  const handleCancelOrder = async () => {
    if (!selectedReason) {
      alert("Vui lòng chọn lý do hủy đơn hàng");
      return;
    }

    try {
      const res = await orderService.cancelOrder(Number(orderId), selectedReason);

      if (res.action === "canceled_directly") {
        setActionMessage({ text: "Đơn hàng đã được hủy thành công!", type: "success" });
      } else if (res.action === "cancel_requested") {
        setActionMessage({
          text: "Yêu cầu hủy đơn hàng đã được gửi thành công! Vui lòng điền Form được gửi vào Mail nếu khách hàng đã thanh toán.",
          type: "info",
        });
      }

      const updatedData = await orderService.getOrderStatus(Number(orderId));
      setData(updatedData);

      setShowCancelModal(false);
      setSelectedReason("");
      setTimeout(() => setActionMessage(null), 5000);
    } catch (error) {
      alert("Thao tác thất bại. Vui lòng thử lại.");
    }
  };

  const canCancel = ["PENDING", "CONFIRMED"].includes(data?.status);
  const isPaid = data?.payStatus === "PAID";
  const cancelStatus = data?.cancelStatus || "NONE";
  const isCanceled = cancelStatus === "APPROVED" || data?.status === "CANCELED";

  const getCancelButtonText = () => {
    if (cancelStatus === "REQUESTED") return "Đơn hàng đang được xử lý yêu cầu hủy";
    if (cancelStatus === "APPROVED") return "Đơn hàng đã được hủy";
    if (cancelStatus === "REJECTED") return "Yêu cầu hủy bị từ chối";
    return "Hủy đơn hàng";
  };

  const getCancelButtonClass = () => {
    if (cancelStatus === "REQUESTED") return "bg-orange-500 cursor-not-allowed opacity-90";
    if (cancelStatus === "APPROVED") return "bg-green-600";
    if (cancelStatus === "REJECTED") return "bg-red-600";
    return "bg-red-600 hover:bg-red-700";
  };

  const handleReview = () => {
    if (!orderId) return;
    window.open(`/rating/${orderId}`, "_blank");
  };

// === CHỨC NĂNG MUA LẠI - CẬP NHẬT GIỎ HÀNG VÀ Ở LẠI TRANG ===
const { reloadCart } = useCart(); // ← Lấy hàm reload giỏ hàng

const handleBuyAgain = async () => {
  if (!data || !data.items || data.items.length === 0) {
    toast.error("Không có sản phẩm nào để mua lại.");
    return;
  }

  try {
    // Chuẩn bị danh sách sản phẩm cần thêm
    const itemsToAdd = data.items.map((i: any) => ({
      itemId: i.item.id, // chắc chắn backend dùng field "id"
      quantity: i.quantity || 1,
    }));

    // Gọi API thêm nhiều sản phẩm vào giỏ (nếu backend hỗ trợ)
    // Nếu chưa có addMultiple, thì loop add từng cái
    for (const { itemId, quantity } of itemsToAdd) {
      await addToCart (itemId, quantity); // dùng hàm từ cart.service
    }

    // === QUAN TRỌNG: Reload giỏ hàng để cập nhật UI ngay lập tức ===
    await reloadCart();

    // Tùy chọn: Có thể chuyển hướng sang giỏ hàng
    // navigate("/cart");

  } catch (error: any) {
    console.error("Lỗi khi mua lại đơn hàng:", error);
    if (error.message === "NEED_LOGIN") {
      toast.error("Vui lòng đăng nhập để mua lại!");
    } else {
      toast.error("Không thể thêm sản phẩm vào giỏ hàng. Vui lòng thử lại.");
    }
  }
};
  if (loading) {
    return (
      <>
        <div className="flex items-center justify-center min-h-screen bg-green-50">
          <div className="text-2xl text-green-700 font-medium animate-pulse">
            Đang chuẩn bị bánh cho bạn...
          </div>
        </div>
      </>
    );
  }

  if (!data) {
    return (
      <>
        <div className="text-center py-20 bg-green-50">
          <p className="text-4xl text-red-600 font-bold">Không tìm thấy đơn hàng</p>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-green-50 py-12 px-4">
        <div className="max-w-5xl mx-auto">
          {/* Thông báo thành công */}
          {actionMessage && (
            <div
              className={`mb-8 p-6 rounded-3xl text-center text-white font-bold text-xl shadow-lg ${
                actionMessage.type === "success" ? "bg-green-600" : "bg-blue-600"
              }`}
            >
              {actionMessage.text}
            </div>
          )}

          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-green-700 mb-3">
              Đơn hàng {data.orderId}
            </h1>
          </div>

          {cancelStatus !== "NONE" && (
            <div className="mb-12 p-8 bg-gradient-to-r from-amber-50 to-yellow-50 border-2 border-amber-200 rounded-3xl text-center shadow-lg">
              <p className="text-2xl font-bold text-amber-900">
                {cancelStatus === "REQUESTED" && "Đơn hàng đang được xử lý yêu cầu hủy"}
                {cancelStatus === "APPROVED" && "Đơn hàng đã được hủy thành công"}
                {cancelStatus === "REJECTED" && "Yêu cầu hủy đã bị từ chối"}
              </p>
              <p className="text-base text-amber-800 mt-4">
                {cancelStatus === "REQUESTED" &&
                  "Vui lòng điền thông tin vào FORM được gửi qua mail để nhận hoàn tiền."}
                {cancelStatus === "APPROVED" &&
                  "Số tiền sẽ được hoàn về trong vòng 3-7 ngày làm việc."}
                {cancelStatus === "REJECTED" && "Đơn hàng đã bị từ chối huỷ."}
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* CỘT TRÁI */}
            <div className="space-y-8">
              <div className="bg-white rounded-3xl shadow-lg border border-amber-200 p-8">
                <p className="text-xl font-bold text-green-800 mb-4">Ngày đặt</p>
                <p className="text-2xl font-bold text-green-700">
                  {new Date(data.createdAt).toLocaleDateString("vi-VN", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}{" "}
                  lúc {new Date(data.createdAt).toLocaleTimeString("vi-VN", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>

              <div className="bg-white rounded-3xl shadow-lg border border-amber-200 p-8">
                <h2 className="text-2xl font-bold text-green-800 mb-10">Tiến trình làm bánh</h2>

                {isCanceled ? (
                  <div className="flex items-center py-6">
                    <div className="w-12 h-12 rounded-full bg-red-600 flex items-center justify-center mr-6 shadow-md">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </div>
                    <p className="text-2xl font-bold text-red-800">Đơn hàng đã bị hủy</p>
                  </div>
                ) : (
                  <div className="relative">
                    <div className="space-y-12">
                      {[
                        { label: "Chờ xác nhận", completed: true },
                        { label: "Đã xác nhận", completed: data.status !== "PENDING" },
                        { label: "Đang chuẩn bị", completed: ["PREPARING", "DELIVERING", "COMPLETED"].includes(data.status) },
                        { label: "Đang giao", completed: ["DELIVERING", "COMPLETED"].includes(data.status) },
                        { label: "Giao thành công", completed: data.status === "COMPLETED" },
                      ].map((step, idx) => (
                        <div key={idx} className="flex items-center">
                          <div className="relative flex flex-col items-center">
                            <div
                              className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md z-10
                                ${step.completed ? "bg-green-600" : "bg-gray-300"}
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
                            {idx < 4 && (
                              <div
                                className={`absolute top-12 left-1/2 transform -translate-x-1/2 w-0.5 h-20
                                  ${step.completed ? "bg-green-600" : "bg-gray-300"}
                                `}
                              />
                            )}
                          </div>
                          <p className={`ml-6 text-xl font-medium ${step.completed ? "text-green-800 font-bold" : "text-gray-500"}`}>
                            {step.label}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {data.cancelReason && (
                  <div className="mt-6 p-4 bg-amber-50 rounded-2xl border border-amber-200">
                    <p className="text-base font-bold text-amber-900">Lý do hủy đơn hàng:</p>
                    <p className="text-base text-amber-800 mt-2 italic">{data.cancelReason}</p>
                  </div>
                )}
              </div>
            </div>

            {/* CỘT PHẢI */}
            <div className="space-y-8">
              {/* Thông tin sản phẩm */}
              <div className="bg-white rounded-3xl shadow-lg border border-amber-200 p-8">
                <h2 className="text-2xl font-bold text-green-800 mb-6">Thông tin sản phẩm</h2>
                <div className="space-y-8">
                  {data.items.map((i: any, idx: number) => {
                    const info = i.item || {};
                    const quantity = i.quantity || 1;

                    return (
                      <div key={idx} className="flex gap-8 items-start">
                        {info.imageURL ? (
                          <img src={info.imageURL} alt={info.name} className="w-28 h-28 object-cover rounded-2xl shadow-md border border-amber-100 flex-shrink-0" />
                        ) : (
                          <div className="w-28 h-28 bg-gray-100 rounded-2xl flex items-center justify-center text-5xl border border-amber-100 flex-shrink-0">
                            🍰
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-xl font-bold text-green-800 break-words">{info.name || "Bánh ngọt"}</p>
                          {info.flavor && <p className="text-base text-gray-700 mt-2">Hương vị: {info.flavor}</p>}
                          <p className="text-base text-gray-700 mt-2">
                            Số lượng: <span className="font-bold">{quantity}</span>
                          </p>
                          <p className="text-xl font-bold text-green-800 mt-3">
                            {(info.price * quantity).toLocaleString("vi-VN")}đ
                          </p>
                        </div>
                      </div>
                    );
                  })}

                  {data.note && (
                    <div className="mt-6 p-4 bg-amber-50 rounded-2xl border border-amber-200">
                      <p className="text-base font-bold text-amber-900">Ghi chú đơn hàng:</p>
                      <p className="text-base text-amber-800 mt-2 italic">{data.note}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Thanh toán */}
              {data.payment && (
                <div className="bg-white rounded-3xl shadow-lg border border-amber-200 p-8">
                  <h2 className="text-2xl font-bold text-green-800 mb-6">Thông tin thanh toán</h2>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <p className="text-lg text-gray-700">Phương thức</p>
                      <p className="text-lg font-bold text-green-800">
                        {data.payment.method === "COD" ? "Thanh toán khi nhận hàng" : data.payment.method === "VNPAY" ? "VNPAY" : data.payment.method || "Chưa xác định"}
                      </p>
                    </div>
                    <div className="flex justify-between">
                      <p className="text-lg text-gray-700">Trạng thái</p>
                      <p className={`text-lg font-bold ${data.payment.status === "PAID" || (data.payment.method === "COD" && data.status === "COMPLETED") ? "text-green-700" : "text-orange-700"}`}>
                        {data.payment.status === "PAID" || (data.payment.method === "COD" && data.status === "COMPLETED") ? "Đã thanh toán" : "Chưa thanh toán"}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Tổng tiền + Nút hành động */}
              <div className="bg-white rounded-3xl shadow-lg border border-amber-200 p-8">
                <div className="space-y-4">
                  <div className="flex justify-between text-base text-gray-700">
                    <span>Tạm tính</span>
                    <span>{subtotal.toLocaleString("vi-VN")} VND</span>
                  </div>
                  <div className="flex justify-between text-base text-gray-700">
                    <span>VAT (10%)</span>
                    <span>{vat.toLocaleString("vi-VN")} VND</span>
                  </div>
                  <div className="flex justify-between text-base text-gray-700">
                    <span>Phí ship</span>
                    <span>{shipping.toLocaleString("vi-VN")} VND</span>
                  </div>
                  <div className="flex justify-between text-base text-red-600 font-medium">
                    <span>Giảm giá</span>
                    <span>-{discount.toLocaleString("vi-VN")} VND</span>
                  </div>
                  <div className="border-t-2 border-amber-300 pt-4">
                    <div className="flex justify-between">
                      <p className="text-xl font-bold text-green-800">TỔNG CỘNG</p>
                      <p className="text-xl font-bold text-green-800">{grandTotal.toLocaleString("vi-VN")} VND</p>
                    </div>
                  </div>
                </div>

                <div className="mt-8 space-y-4">
                  {canCancel && cancelStatus === "NONE" && (
                    <button
                      onClick={() => setShowCancelModal(true)}
                      className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-red-600 text-white font-medium rounded-full hover:bg-red-700 transition-all shadow-md"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      Hủy đơn hàng
                    </button>
                  )}

                  {cancelStatus !== "NONE" && (
                    <div className={`w-full px-6 py-3 rounded-full text-base font-medium text-center text-white ${getCancelButtonClass()}`}>
                      {getCancelButtonText()}
                    </div>
                  )}

                  {data.status === "COMPLETED" && (
                    <div className="grid grid-cols-2 gap-4">
                      <button
                        onClick={handleReview}
                        className="px-6 py-3 bg-yellow-500 text-white font-medium rounded-full hover:bg-yellow-600 transition shadow-md"
                      >
                        Đánh giá
                      </button>
                      <button
                        onClick={handleBuyAgain}
                        disabled={addingToCart}
                        className="px-6 py-3 bg-green-600 text-white font-medium rounded-full hover:bg-green-700 transition shadow-md disabled:opacity-70 disabled:cursor-not-allowed"
                      >
                        {addingToCart ? "Đang thêm..." : "Mua lại"}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal hủy đơn hàng */}
        {showCancelModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-lg w-full border border-amber-200">
              <h3 className="text-2xl font-bold text-green-800 mb-6 text-center">
                {isPaid ? "Yêu cầu hủy đơn hàng" : "Xác nhận hủy đơn hàng"}
              </h3>
              <p className="text-base text-gray-700 mb-6 text-center">
                {isPaid
                  ? "Bạn đã thanh toán. Yêu cầu hủy sẽ được gửi đến cửa hàng để duyệt và hoàn tiền (nếu được chấp thuận)."
                  : "Bạn chưa thanh toán, đơn hàng sẽ được hủy ngay lập tức."}
              </p>

              <p className="text-base font-bold text-green-800 mb-4">Vui lòng chọn lý do:</p>
              <div className="space-y-3 mb-8">
                {cancelReasons.map((reason) => (
                  <label
                    key={reason}
                    className="flex items-center p-4 border-2 border-amber-100 rounded-2xl cursor-pointer hover:bg-amber-50 transition"
                  >
                    <input
                      type="radio"
                      name="cancelReason"
                      value={reason}
                      checked={selectedReason === reason}
                      onChange={(e) => setSelectedReason(e.target.value)}
                      className="w-5 h-5 text-green-600"
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
                  className="flex-1 px-6 py-3 bg-gray-300 text-gray-800 font-bold rounded-full hover:bg-gray-400 transition"
                >
                  Hủy bỏ
                </button>
                <button
                  onClick={handleCancelOrder}
                  disabled={!selectedReason}
                  className={`flex-1 px-6 py-3 font-bold rounded-full transition ${
                    selectedReason
                      ? "bg-red-600 text-white hover:bg-red-700"
                      : "bg-gray-400 text-gray-300 cursor-not-allowed"
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