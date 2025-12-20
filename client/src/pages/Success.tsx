import { Link, useLocation, Navigate } from "react-router-dom";
import "../styles/success.css";

export default function SuccessPage() {
  const location = useLocation();
  const state = location.state as any;

  if (!state?.orderId) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="success-container">
      <div className="success-card">
        <h2 className="success-title">🎉 Đặt hàng thành công!</h2>

        <p>
          Mã đơn hàng: <strong>#{state.orderId}</strong>
        </p>

        <p>
          Trạng thái đơn hàng:{" "}
          <strong className="status-badge">{state.orderStatus}</strong>
        </p>

        <p>
          Phương thức thanh toán: <strong>{state.paymentMethod}</strong>
        </p>

        <div className="success-actions">
          <Link to="/menu" className="btn primary">
            Tiếp tục mua hàng
          </Link>

          <Link to="/" className="btn ghost">
            Về trang chủ
          </Link>
        </div>
      </div>
    </div>
  );
}
