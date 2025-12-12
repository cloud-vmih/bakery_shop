// client/src/pages/MyOrders.tsx
import { useEffect, useState } from "react";
import { orderService } from "../services/order.service";
import { Link } from "react-router-dom";

export default function MyOrders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    orderService.getMyOrders().then((res) => {
      if (res.orders) setOrders(res.orders);
      if (res.message) setMessage(res.message);
    });
  }, []);

  if (message) return <div className="text-center py-10">{message}</div>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Đơn hàng của tôi</h1>
      {orders.map((order) => (
        <div key={order.id} className="border rounded-lg p-4 mb-4 flex justify-between items-center">
          <div>
            <p>Mã đơn: <strong>#{order.id}</strong></p>
            <p>Ngày đặt: {new Date(order.createAt).toLocaleDateString("vi-VN")}</p>
            <p className="text-blue-600 font-medium">
              {getStatusText(order.status)}
            </p>
          </div>
          <Link
            to={`/order/${order.id}/status`}
            className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Xem chi tiết
          </Link>
        </div>
      ))}
    </div>
  );
}

function getStatusText(status: string) {
  const map: any = {
    PENDING: "Chờ xác nhận",
    CONFIRMED: "Đã xác nhận",
    PREPARING: "Đang chuẩn bị hàng",
    DELIVERING: "Đang giao",
    COMPLETED: "Giao thành công",
    CANCELED: "Đã hủy",
  };
  return map[status] || status;
}