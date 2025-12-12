// client/src/pages/OrderStatus.tsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { orderService } from "../services/order.service";

export default function OrderStatus() {
  const { orderId } = useParams();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    orderService.getOrderStatus(Number(orderId))
      .then(setData)
      .catch(() => alert("Không thể tải trạng thái đơn hàng"))
      .finally(() => setLoading(false));
  }, [orderId]);

  if (loading) return <div className="text-center py-20">Đang tải...</div>;
  if (!data) return <div className="text-center py-20 text-red-600">Không tìm thấy đơn hàng</div>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-2">Đơn hàng #{data.orderId}</h1>
      <p className="text-gray-600 mb-8">
        Đặt ngày: {new Date(data.createdAt).toLocaleString("vi-VN")}
      </p>

      {/* Trạng thái hiện tại */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-10">
        <p className="text-2xl font-bold text-blue-700">
          {data.statusText}
        </p>
        {data.message && <p className="text-amber-700 mt-3">{data.message}</p>}
      </div>

      {/* Timeline */}
      <div className="mb-10">
        <h2 className="text-xl font-semibold mb-6">Tiến trình đơn hàng</h2>
        <div className="space-y-8">
          {data.timeline.map((step: any, idx: number) => (
            <div key={idx} className="flex items-center">
              <div className="flex flex-col items-center">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold
                    ${step.completed ? "bg-green-500" : "bg-gray-300"}`}
                >
                  {step.completed ? "Check" : idx + 1}
                </div>
                {idx < data.timeline.length - 1 && (
                  <div
                    className={`w-1 h-16 mt-2 ${step.completed ? "bg-green-500" : "bg-gray-300"}`}
                  />
                )}
              </div>
              <div className="ml-6">
                <p className={`text-lg font-medium ${step.completed ? "text-green-700" : "text-gray-400"}`}>
                  {step.label}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Thông tin phụ */}
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <span className="font-medium">Cập nhật lần cuối:</span>
          <br />
          {new Date(data.lastUpdate).toLocaleString("vi-VN")}
        </div>
        <div>
          <span className="font-medium">Đơn vị vận chuyển:</span>
          <br />
          {data.shippingProvider}
        </div>
      </div>
    </div>
  );
}