import { Link, useLocation, useNavigate } from "react-router-dom";
import { useMemo, useState } from "react";

import OrderSummary from "../components/checkout/OrderSummary";
import "../styles/checkoutConfirm.css";

import { createOrder } from "../services/orders.service";
import { createVNPayUrl } from "../services/payment.service";
import { clearCart } from "../services/cart.service";
import { useCart } from "../context/CartContext";

function formatDateVN(isoDate: string) {
  if (!isoDate) return "";
  const date = new Date(isoDate + "T00:00:00");
  const days = [
    "Chủ nhật",
    "Thứ Hai",
    "Thứ Ba",
    "Thứ Tư",
    "Thứ Năm",
    "Thứ Sáu",
    "Thứ Bảy",
  ];
  return `${days[date.getDay()]}, ${String(date.getDate()).padStart(
    2,
    "0"
  )}/${String(date.getMonth() + 1).padStart(2, "0")}/${date.getFullYear()}`;
}

export default function CheckoutConfirm() {
  const { resetCart } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  const payload = (location.state as any)?.payload;
  const [isSubmitting, setIsSubmitting] = useState(false);

  const totalAmount = useMemo(() => {
    if (!payload?.items) return 0;
    return payload.items.reduce(
      (sum: number, i: any) => sum + i.item.price * i.quantity,
      0
    );
  }, [payload]);

  if (!payload) {
    return (
      <div className="confirm-container">
        <div className="confirm-card">
          <h3>Xác nhận đơn hàng</h3>
          <p>Không tìm thấy dữ liệu đơn hàng</p>
          <button onClick={() => navigate("/checkout")}>
            Quay lại Checkout
          </button>
        </div>
      </div>
    );
  }

  const handleConfirm = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const paymentMethod = payload.paymentMethod;

      // 1️⃣ CREATE ORDER
      const order = await createOrder(payload);

      // 2️⃣ COD → CONFIRMED → success
      if (paymentMethod === "COD") {
        await clearCart();
        resetCart();

        navigate(`/order-success/${order.orderId}`, { replace: true });
        return;
      }

      // 3️⃣ VNPAY → redirect
      if (paymentMethod === "VNPAY") {
        const { vnpayUrl } = await createVNPayUrl(order.orderId, totalAmount);
        window.location.href = vnpayUrl;
        return;
      }

      throw new Error("Unsupported payment method");
    } catch (err: any) {
      alert(err.message || "Không thể tạo đơn hàng");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="confirm-container">
      <h2 className="confirm-title">Xác nhận đơn hàng</h2>

      <div className="confirm-card">
        <h3 className="confirm-section-title">Thông tin khách hàng</h3>{" "}
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
            <span>Địa chỉ</span>
            <strong>{payload.address.fullAddress}</strong>
          </div>
          {/* <div>
            <span>Thời gian giao</span>
            <strong>
              {formatDateVN(payload.delivery.deliveryDate)} –{" "}
              {payload.delivery.timeFrame}
            </strong>
          </div> */}
          <div>
            <span>Thanh toán</span>
            <strong>
              <span className="payment-badge">{payload.paymentMethod}</span>
            </strong>{" "}
          </div>
        </div>
      </div>

      <div className="confirm-card">
        <OrderSummary items={payload.items} />
      </div>

      <div className="confirm-actions">
        <button
          className="confirm-btn primary"
          onClick={handleConfirm}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Đang xử lý..." : "Xác nhận đặt hàng"}
        </button>

        <button
          className="confirm-btn ghost"
          onClick={() => navigate("/checkout")}
          disabled={isSubmitting}
        >
          Quay lại chỉnh sửa
        </button>

        <Link to="/cart" className="confirm-back">
          ← Quay lại giỏ hàng
        </Link>
      </div>
    </div>
  );
}
