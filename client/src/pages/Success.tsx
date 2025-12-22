import { Link, useParams, Navigate } from "react-router-dom";
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
    <div className="min-h-[calc(100vh-80px)] bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 text-center">
        {/* ICON */}
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-green-100">
          <svg
            className="h-8 w-8 text-green-600"
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
        <h2 className="text-2xl font-bold text-green-700 mb-2">
          Đặt hàng thành công
        </h2>

        <p className="text-sm text-gray-500 mb-6">
          Cảm ơn bạn đã mua hàng! Đơn hàng của bạn đã được ghi nhận trên hệ
          thống.
        </p>

        {/* ORDER INFO */}
        <div className="space-y-3 text-sm text-left bg-gray-50 rounded-xl p-4">
          <div className="flex justify-between">
            <span className="text-gray-500">Mã đơn hàng</span>
            <span className="font-semibold text-gray-900">#{order.id}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-500">Trạng thái</span>
            <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-0.5 text-xs font-semibold text-green-700">
              {order.status}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-500">Thanh toán</span>
            <span className="font-medium text-gray-900">
              {payment?.paymentMethod ?? "Không xác định"}
            </span>
          </div>
        </div>

        {/* ACTIONS */}
        <div className="mt-8 flex flex-col sm:flex-row gap-3">
          <Link
            to="/menu"
            className="flex-1 rounded-xl bg-black px-5 py-3 text-sm font-semibold text-white text-center hover:bg-gray-900 transition"
          >
            Tiếp tục mua hàng
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
