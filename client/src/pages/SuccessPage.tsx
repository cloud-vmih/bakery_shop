import { Link, useParams, Navigate } from "react-router-dom";
import { Header } from "../components/Header";

import { useEffect, useState } from "react";

import { getOrderById } from "../services/orders.service";
import { getPaymentByOrder } from "../services/payment.service";

export default function SuccessPage() {
  const { orderId } = useParams<{ orderId: string }>();

  const [order, setOrder] = useState<any>(null);
  const [payment, setPayment] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!orderId) return;

    const fetchData = async () => {
      try {
        const [orderData, paymentData] = await Promise.all([
          getOrderById(Number(orderId)),
          getPaymentByOrder(Number(orderId)),
        ]);

        setOrder(orderData);
        setPayment(paymentData);
      } catch (err) {
        console.error("FETCH SUCCESS DATA FAILED", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [orderId]);

  // ❌ URL sai
  if (!orderId) {
    return <Navigate to="/" replace />;
  }

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center text-gray-500">
        Đang tải đơn hàng…
      </div>
    );
  }

  if (!order) {
    return <Navigate to="/" replace />;
  }

  return (
    <>
      <Header />

      <div className="min-h-[calc(100vh-80px)] bg-gradient-to-br from-green-50 via-emerald-50 to-lime-50 flex items-center justify-center px-4">
        <div className="w-full max-w-lg bg-white/90 backdrop-blur rounded-3xl shadow-2xl p-8 text-center animate-fadeIn">
          {/* ICON */}
          <div
            className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full 
                        bg-gradient-to-br from-green-100 to-emerald-100 shadow-inner"
          >
            <svg
              className="h-9 w-9 text-green-600"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>

          {/* TITLE */}
          <h2 className="text-3xl font-extrabold text-green-700 mb-2">
            Đặt hàng thành công
          </h2>

          <p className="text-sm text-gray-500 mb-8 leading-relaxed">
            Cảm ơn bạn đã tin tưởng MyBakery. Đơn hàng của bạn đã được ghi nhận
            và đang được xử lý.
          </p>

          {/* ORDER INFO */}
          <div className="space-y-4 text-sm text-left bg-green-50/70 rounded-2xl p-5 border border-green-100">
            <div className="flex justify-between items-center">
              <span className="text-gray-500">Mã đơn hàng</span>
              <span className="font-bold text-gray-900 tracking-wide">
                #{order.data.id}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-gray-500">Trạng thái</span>
              <span
                className="inline-flex items-center gap-1 rounded-full 
                             bg-green-100 px-3 py-1 text-xs font-semibold text-green-700"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                {order.data.status}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-gray-500">Thanh toán</span>
              <span className="font-medium text-gray-900">
                {payment?.paymentMethod ?? "Không xác định"}
              </span>
            </div>
          </div>

          {/* NOTE */}
          <div className="mt-6 text-xs text-gray-500 italic">
            Bạn có thể theo dõi trạng thái đơn hàng trong mục
            <span className="font-medium text-green-700"> “My Orders”</span>.
          </div>

          {/* ACTIONS */}
          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <Link
              to="/menu"
              className="flex-1 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 
                       px-6 py-3 text-sm font-semibold text-white 
                       shadow-md hover:shadow-lg hover:from-green-700 hover:to-emerald-700 
                       transition-all duration-300"
            >
              Tiếp tục mua hàng
            </Link>

            <Link
              to="/"
              className="flex-1 rounded-xl bg-white px-6 py-3 text-sm font-semibold 
                       text-green-700 border border-green-200 
                       hover:bg-green-50 transition"
            >
              Về trang chủ
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
