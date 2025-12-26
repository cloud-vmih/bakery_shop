// client/src/pages/MyOrders.tsx
import { useEffect, useState } from "react";
import { orderService, OrderItem } from "../services/order.service";
import { Link } from "react-router-dom";
import { Header } from "../components/Header";
import { useInventory } from "../context/InventoryContext";
import { toast } from "react-toastify";

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

const ITEMS_PER_PAGE = 6;

export default function MyOrders() {
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [activeTab, setActiveTab] = useState<TabKey>("all");
  const [loading, setLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const { branchId } = useInventory()

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

  const getDisplayStatus = (order: OrderItem): string => {
    if (order.cancelStatus === "APPROVED" || order.status === "CANCELED") {
      return "Đã hủy";
    }
    const map: Record<string, string> = {
      PENDING: "Chờ xác nhận",
      CONFIRMED: "Đã xác nhận",
      PREPARING: "Đang làm bánh",
      DELIVERING: "Đang giao",
      COMPLETED: "Đã giao thành công",
    };
    return map[order.status] || order.status;
  };

  const isOrderCanceled = (order: OrderItem): boolean => {
    return order.status === "CANCELED" || order.cancelStatus === "APPROVED";
  };

  const filteredOrders = orders.filter((order) => {
    if (activeTab === "all") return true;
    if (activeTab === "pending") return order.status === "PENDING" && !isOrderCanceled(order);
    if (activeTab === "confirmed") return order.status === "CONFIRMED" && !isOrderCanceled(order);
    if (activeTab === "preparing") return order.status === "PREPARING";
    if (activeTab === "delivering") return order.status === "DELIVERING";
    if (activeTab === "completed") return order.status === "COMPLETED";
    if (activeTab === "canceled") return isOrderCanceled(order);
    return false;
  });

  const totalItems = filteredOrders.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedOrders = filteredOrders.slice(startIndex, endIndex);

  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab]);

  if (loading) {
    return (
        <div className="flex items-center justify-center min-h-screen bg-green-50">
          <div className="text-2xl text-green-700 font-medium animate-pulse">
            Đang tải đơn hàng...
          </div>
        </div>
    );
  }

  return (
      <div className="min-h-screen bg-green-50 py-12 px-4">
        <div className="max-w-4xl mx-auto"> {/* Giảm max-width một chút để gọn hơn */}
          {/* Tiêu đề trang */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-green-700 mb-3">
              Đơn hàng của tôi
            </h1>
            <p className="text-amber-800 text-lg font-medium">
              Quản lý và theo dõi tất cả đơn hàng của bạn
            </p>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 min-w-max justify-center gap-2 mb-8">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-6 py-3 rounded-full font-bold transition-all
                ${activeTab === tab.key
                    ? "bg-green-600 text-white"
                    : "bg-white text-gray-700 border border-gray-200 hover:border-green-200"
                  }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Không có đơn hàng */}
          {totalItems === 0 ? (
            <div className="bg-white rounded-3xl shadow-xl border border-amber-200 p-16 text-center">
              <div className="text-8xl mb-8">🍰</div>
              <p className="text-2xl text-gray-600 font-medium mb-10">
                Bạn chưa có đơn hàng nào
              </p>
              <Link
                to="/"
                className="inline-block px-10 py-5 bg-green-600 text-white text-xl font-bold rounded-full hover:bg-green-700 hover:scale-105 transition-all shadow-lg"
              >
                Đi đặt bánh nào!
              </Link>
            </div>
          ) : (
            <>
              {/* Danh sách đơn hàng - khung nhỏ gọn hơn */}
              <div className="space-y-10">
                {paginatedOrders.map((order) => (
                  <div
                    key={order.id}
                    className="bg-white rounded-3xl shadow-lg border border-amber-200 overflow-hidden"
                  >
                    {/* Header - vàng nhạt */}
                    <div className="bg-gradient-to-r from-amber-50 to-yellow-50 px-6 py-5 border-b border-amber-200">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                        <div>
                          <h3 className="text-xl font-bold text-green-800">
                            Đơn hàng {order.id}
                          </h3>
                          <p className="text-sm text-amber-900 mt-1">
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
                        <span
                          className={`px-6 py-2 rounded-full text-sm font-medium
                            ${isOrderCanceled(order)
                              ? "bg-pink-100 text-pink-700"
                              : "bg-green-100 text-green-700"
                            }`}
                        >
                          {getDisplayStatus(order)}
                        </span>
                      </div>
                    </div>

                    {/* Nội dung sản phẩm - gọn hơn */}
                    <div className="p-6 space-y-6">
                      {order.orderDetails && order.orderDetails.length > 0 ? (
                        order.orderDetails.map((detail, idx) => {
                          const info = detail.itemInfo || {};
                          return (
                            <div key={idx} className="flex gap-6 items-start">
                              {info.image ? (
                                <img
                                  src={info.image}
                                  alt={info.name}
                                  className="w-24 h-24 object-cover rounded-xl shadow border border-amber-100 flex-shrink-0"
                                />
                              ) : (
                                <div className="w-24 h-24 bg-gray-100 rounded-xl flex items-center justify-center text-4xl border border-amber-100 flex-shrink-0">
                                  🍰
                                </div>
                              )}
                              <div className="flex-1 min-w-0">
                                <h4 className="text-lg font-bold text-green-800 break-words">
                                  {info.name || "Bánh ngọt"}
                                </h4>
                                {detail.note && (
                                  <p className="text-sm text-amber-900 bg-amber-50 px-4 py-2 rounded-lg mt-2">
                                    Ghi chú: {detail.note}
                                  </p>
                                )}
                                <p className="text-sm text-gray-700 mt-2">
                                  Số lượng: <span className="font-bold">{detail.quantity || 1}</span>
                                </p>
                              </div>
                            </div>
                          );
                        })
                      ) : (
                        <p className="text-center text-gray-500 py-6 text-sm italic">
                          Chưa có thông tin sản phẩm
                        </p>
                      )}
                    </div>

                    {/* Footer - nhỏ gọn */}
                    <div className="bg-gradient-to-r from-amber-50 to-yellow-50 px-6 py-6 border-t border-amber-200">
                      <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
                        <div className="text-center sm:text-left">
                          <p className="text-sm text-gray-700">
                            Tổng số lượng: <span className="font-bold text-green-800">
                              {order.orderDetails?.reduce((sum, d) => sum + (d.quantity || 1), 0) || 0}
                            </span>
                          </p>
                          <p className="text-xl font-bold text-green-700 mt-2">
                            Tổng tiền: {order.orderDetails?.reduce((sum, d) => sum + ((d.itemInfo?.price || 0) * (d.quantity || 1)), 0).toLocaleString("vi-VN")}đ
                          </p>
                        </div>
                        <Link
                          to={`/orderDetails/${order.id}`}
                          className="inline-flex items-center gap-2 px-5 py-2.5 bg-green-600 text-white text-sm font-medium rounded-full hover:bg-green-700 transition-all shadow"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                          Xem chi tiết đơn
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Phân trang - nhỏ gọn */}
              <div className="mt-12 flex justify-center items-center gap-3">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className={`px-6 py-3 rounded-full text-sm font-medium transition-all shadow-sm
                    ${currentPage === 1
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-green-600 text-white hover:bg-green-700"
                    }`}
                >
                  Trước
                </button>

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
                      className={`w-11 h-11 rounded-full text-sm font-medium transition-all shadow-sm
                        ${currentPage === pageNum
                          ? "bg-green-600 text-white shadow-green-300"
                          : "bg-white border border-amber-200 text-gray-700 hover:border-green-400 hover:shadow-md"
                        }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}

                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className={`px-6 py-3 rounded-full text-sm font-medium transition-all shadow-sm
                    ${currentPage === totalPages
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-green-600 text-white hover:bg-green-700"
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