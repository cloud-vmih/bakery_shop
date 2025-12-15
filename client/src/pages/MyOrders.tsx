// client/src/pages/MyOrders.tsx
import { useEffect, useState } from "react";
import { orderService, OrderItem } from "../services/order.service";
import { Link } from "react-router-dom";

type TabKey =
  | "all"
  | "pending"
  | "confirmed"
  | "preparing"
  | "delivering"
  | "completed"
  | "canceled";

const tabs = [
  { key: "all" as TabKey, label: "Tất cả" },
  { key: "pending" as TabKey, label: "Chờ xác nhận" },
  { key: "confirmed" as TabKey, label: "Đã xác nhận" },
  { key: "preparing" as TabKey, label: "Chờ lấy hàng" },
  { key: "delivering" as TabKey, label: "Chờ giao hàng" },
  { key: "completed" as TabKey, label: "Đã giao" },
  { key: "canceled" as TabKey, label: "Đã hủy" },
];

const ITEMS_PER_PAGE = 6; // Mỗi trang 6 đơn hàng

export default function MyOrders() {
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [activeTab, setActiveTab] = useState<TabKey>("all");
  const [loading, setLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);

  useEffect(() => {
    orderService
      .getMyOrders()
      .then((res) => {
        setOrders(res.orders ?? []);
      })
      .catch((err) => {
        console.error("Lỗi tải đơn hàng:", err);
        setOrders([]);
      })
      .finally(() => setLoading(false));
  }, []);

  // Lọc đơn hàng theo tab
  const filteredOrders = orders.filter((order) => {
    if (activeTab === "all") return true;
    if (activeTab === "pending") return order.status === "PENDING";
    if (activeTab === "confirmed") return order.status === "CONFIRMED";
    if (activeTab === "preparing") return order.status === "PREPARING";
    if (activeTab === "delivering") return order.status === "DELIVERING";
    if (activeTab === "completed") return order.status === "COMPLETED";
    if (activeTab === "canceled") return order.status === "CANCELED";
    return false;
  });

  // Tính toán phân trang
  const totalItems = filteredOrders.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedOrders = filteredOrders.slice(startIndex, endIndex);

  // Khi chuyển tab, reset về trang 1
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab]);

  const getStatusText = (status: string): string => {
    const map: Record<string, string> = {
      PENDING: "Chờ xác nhận",
      CONFIRMED: "Đã xác nhận",
      PREPARING: "Đang làm bánh",
      DELIVERING: "Đang giao",
      COMPLETED: "Đã giao thành công",
      CANCELED: "Đã hủy",
    };
    return map[status] || status;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-2xl text-pink-600 font-medium animate-pulse">
          Đang tải đơn hàng...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white py-8 px-4 sm:py-12">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-center text-pink-700 mb-8 sm:mb-12">
          Đơn hàng của tôi
        </h1>

        {/* Tabs */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-6 py-3 rounded-full font-bold transition-all
                ${activeTab === tab.key
                  ? "bg-pink-600 text-white"
                  : "bg-white text-gray-700 border border-gray-300"
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Không có đơn hàng */}
        {totalItems === 0 ? (
          <div className="bg-white rounded-3xl shadow-2xl p-10 sm:p-16 text-center max-w-2xl mx-auto">
            <div className="text-6xl sm:text-8xl mb-6">🍰</div>
            <p className="text-xl sm:text-2xl text-gray-600 font-medium mb-8">
              Bạn không có đơn hàng nào
            </p>
            <Link
              to="/"
              className="inline-block px-8 py-4 sm:px-10 sm:py-5 bg-gradient-to-r from-pink-600 to-pink-700 text-white text-lg sm:text-xl font-bold rounded-full hover:from-pink-700 hover:to-pink-800 transition transform hover:scale-105 shadow-lg"
            >
              Đi đặt bánh nào!
            </Link>
          </div>
        ) : (
          <>
            {/* Danh sách đơn hàng (đã phân trang) */}
            <div className="space-y-8">
              {paginatedOrders.map((order) => (
                <div
                  key={order.id}
                  className="bg-white rounded-3xl shadow-2xl overflow-hidden"
                >
                  {/* Header đơn hàng */}
                  <div className="p-6 border-b border-gray-200">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <div>
                        <h3 className="text-2xl font-bold text-gray-800">
                          Đơn hàng {order.id}
                        </h3>
                        <p className="text-gray-600 mt-1">
                          Ngày đặt: {new Date(order.createAt).toLocaleString("vi-VN", {
                            hour: "2-digit",
                            minute: "2-digit",
                            weekday: "long",
                            day: "numeric",
                            month: "numeric",
                            year: "numeric",
                          })}
                        </p>
                      </div>
                      <span className="px-6 py-2 rounded-full bg-pink-100 text-pink-700 font-bold">
                        {getStatusText(order.status)}
                      </span>
                    </div>
                  </div>

                  {/* Danh sách bánh */}
                  <div className="p-6 space-y-6">
                    {order.orderDetails && order.orderDetails.length > 0 ? (
                      order.orderDetails.map((detail, idx) => {
                        const info = detail.itemInfo || {};
                        return (
                          <div key={idx} className="flex gap-6 items-center">
                            {info.image ? (
                              <img
                                src={info.image}
                                alt={info.name}
                                className="w-24 h-24 object-cover rounded-2xl shadow"
                              />
                            ) : (
                              <div className="w-24 h-24 bg-gray-200 rounded-2xl flex items-center justify-center text-gray-500 text-4xl">
                                🍰
                              </div>
                            )}
                            <div className="flex-1">
                              <h4 className="text-xl font-bold text-gray-800">
                                {info.name || "Bánh ngọt"}
                              </h4>
                              {detail.note && (
                                <p className="text-pink-600 mt-1">
                                  Ghi chú: {detail.note}
                                </p>
                              )}
                              <p className="text-gray-600 mt-1">
                                Số lượng: {detail.quantity || 1}
                              </p>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <p className="text-gray-500 text-center py-4">
                        Chưa có thông tin bánh
                      </p>
                    )}
                  </div>

                  {/* Tổng kết + nút xem chi tiết */}
                  <div className="bg-gray-50 p-6 border-t border-gray-200">
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
                      <div className="text-center sm:text-left">
                        <p className="text-xl font-bold text-gray-800">
                          Tổng số lượng: {order.orderDetails?.reduce((sum, d) => sum + (d.quantity || 1), 0) || 0}
                        </p>
                        <p className="text-xl font-bold text-pink-600 mt-2">
                          Tổng tiền: {order.orderDetails?.reduce((sum, d) => sum + ((d.itemInfo?.price || 0) * (d.quantity || 1)), 0).toLocaleString("vi-VN")}đ
                        </p>
                      </div>
                      <Link
                        to={`/orderDetails/${order.id}`}
                        className="w-full sm:w-auto px-12 py-4 bg-pink-600 text-white text-xl font-bold rounded-full hover:bg-pink-700 transition shadow-lg text-center"
                      >
                        Xem chi tiết đơn
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Phân trang - luôn hiển thị, kể cả khi chỉ có 1 trang */}
            <div className="mt-12 flex justify-center items-center gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  currentPage === 1
                    ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                    : "bg-pink-600 text-white hover:bg-pink-700"
                }`}
              >
                Trước
              </button>

              {/* Hiển thị các số trang */}
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                let pageNum: number;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }

                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`w-10 h-10 rounded-lg font-medium transition ${
                      currentPage === pageNum
                        ? "bg-pink-600 text-white"
                        : "bg-white border border-gray-300 text-gray-700 hover:bg-pink-50"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}

              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  currentPage === totalPages
                    ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                    : "bg-pink-600 text-white hover:bg-pink-700"
                }`}
              >
                Sau
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}