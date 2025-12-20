import { Link, useLocation, useNavigate } from "react-router-dom";
import OrderSummary from "../components/checkout/OrderSummary";
import "../styles/checkoutConfirm.css";

import { createOrder } from "../services/orders.service";
import { clearCart } from "../services/cart.service";
import { useCart } from "../context/CartContext";

function formatDateVN(isoDate: string) {
  if (!isoDate) return "";

  const date = new Date(isoDate + "T00:00:00"); // tránh lệch timezone

  const days = [
    "Chủ nhật",
    "Thứ Hai",
    "Thứ Ba",
    "Thứ Tư",
    "Thứ Năm",
    "Thứ Sáu",
    "Thứ Bảy",
  ];

  const dayName = days[date.getDay()];
  const d = String(date.getDate()).padStart(2, "0");
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const y = date.getFullYear();

  return `${dayName}, ${d}/${m}/${y}`;
}

export default function CheckoutConfirm() {
  const { resetCart } = useCart();

  const navigate = useNavigate();
  const location = useLocation();

  const payload = (location.state as any)?.payload;

  if (!payload) {
    return (
      <div className="confirm-container">
        <div className="confirm-card">
          <h3 className="confirm-title">Xác nhận đơn hàng</h3>
          <p className="confirm-empty">
            Không tìm thấy dữ liệu đơn hàng (có thể bạn vừa tải lại trang).
          </p>
          <button
            type="button"
            className="confirm-btn primary"
            onClick={() => navigate("/checkout")}
          >
            Quay lại trang Checkout
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="confirm-container">
      <h2 className="confirm-title">Xác nhận đơn hàng</h2>

      {/* ===== CUSTOMER INFO ===== */}
      <div className="confirm-card">
        <h4 className="confirm-section-title">Thông tin khách hàng</h4>

        <div className="confirm-info">
          <div>
            <span>Khách hàng</span>
            <strong>
              {payload.customer.fullName} – {payload.customer.phone}
            </strong>
          </div>

          <div>
            <span>Email</span>
            <strong>{payload.customer.email || "(không có)"}</strong>
          </div>

          <div>
            <span>Địa chỉ giao hàng</span>
            <strong>
              {payload.address.formattedAddress ||
                (payload.address.addressId
                  ? `Địa chỉ đã lưu (ID: ${payload.address.addressId})`
                  : "(không có địa chỉ)")}
            </strong>
          </div>

          <div>
            <span>Thời gian giao</span>
            <strong>
              {formatDateVN(payload.delivery.deliveryDate)} –{" "}
              {payload.delivery.timeFrame}
            </strong>
          </div>

          <div>
            <span>Thanh toán</span>
            <strong className="payment-badge">{payload.paymentMethod}</strong>
          </div>
        </div>
      </div>

      {/* ===== ORDER SUMMARY ===== */}
      <div className="confirm-card">
        {/* <h4 className="confirm-section-title">Đơn hàng của bạn</h4> */}
        <OrderSummary items={payload.items} />
      </div>

      {/* ===== ACTIONS ===== */}
      <div className="confirm-actions">
        <button
          type="button"
          className="confirm-btn ghost"
          onClick={() => navigate("/checkout")}
        >
          Quay lại chỉnh sửa
        </button>

        <button
          type="button"
          className="confirm-btn primary"
          onClick={async () => {
            try {
              const result = await createOrder(payload);

              // clear cart
              await clearCart();
              resetCart();

              // COD → đi success luôn
              navigate("/order-success", {
                replace: true, // 🔥 QUAN TRỌNG
                state: {
                  orderId: result.orderId,
                  orderStatus: result.orderStatus,
                  paymentMethod: result.paymentMethod,
                },
              });
            } catch (err: any) {
              alert(err.message || "Không thể tạo đơn hàng");
            }
          }}
        >
          Xác nhận đặt hàng
        </button>

        <Link to="/cart" className="confirm-back">
          Quay lại giỏ hàng
        </Link>
      </div>
    </div>
  );
}
