import { Link, useParams, Navigate } from "react-router-dom";

import { useEffect, useState } from "react";

import { getOrderById } from "../services/orders.service";
import { getPaymentByOrder } from "../services/payment.service";

import { getMyPoints } from "../services/memberpoint.service";
import type { MembershipPointsResponse } from "../services/memberpoint.service";

export default function SuccessPage() {
  const { orderId } = useParams<{ orderId: string }>();

  const [order, setOrder] = useState<any>(null);
  const [payment, setPayment] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [pointsInfo, setPointsInfo] = useState<MembershipPointsResponse | null>(
    null
  );

  const [earnedPoints, setEarnedPoints] = useState<number>(0);

  useEffect(() => {
    if (!orderId) return;

    const fetchData = async () => {
      try {
        const [orderData, paymentData, pointsData] = await Promise.all([
          getOrderById(Number(orderId)),
          getPaymentByOrder(Number(orderId)),
          getMyPoints(),
        ]);

        setOrder(orderData);
        setPayment(paymentData);
        setPointsInfo(pointsData);

        const pointOfThisOrder = pointsData.history.find(
          (h) => h.orderId === Number(orderId)
        );

        setEarnedPoints(pointOfThisOrder?.earnedPoints ?? 0);
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

          {/* MEMBERSHIP POINTS */}
          {pointsInfo && (
            <div className="mt-6 rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-white p-5">
              <h4 className="text-sm font-semibold text-emerald-700 mb-4 tracking-wide">
                Phần thưởng thành viên
              </h4>

              {/* Earned points */}
              <div className="flex items-center justify-between rounded-xl bg-white px-4 py-3 shadow-sm border border-emerald-100">
                <div className="flex flex-col">
                  <span className="text-xs text-gray-500">
                    Điểm nhận từ đơn hàng
                  </span>
                  <span className="text-lg font-bold text-emerald-700">
                    +{earnedPoints} điểm
                  </span>
                </div>

                <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center">
                  {/* lucide icon – Award */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-emerald-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 12l2 2 4-4M12 2l2.39 4.85L20 8l-4 3.9.95 5.5L12 15.77 7.05 17.4 8 12 4 8l5.61-.15L12 2z"
                    />
                  </svg>
                </div>
              </div>

              {/* Total points */}
              <div className="mt-3 flex items-center justify-between px-2">
                <span className="text-sm text-gray-600">
                  Tổng điểm tích lũy hiện tại
                </span>
                <span className="text-sm font-semibold text-gray-900">
                  {pointsInfo.totalPoints} điểm
                </span>
              </div>
            </div>
          )}

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
