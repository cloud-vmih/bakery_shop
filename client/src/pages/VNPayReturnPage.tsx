import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import { getPaymentByOrder } from "../services/payment.service";
import { clearCart } from "../services/cart.service";
import { useCart } from "../context/CartContext";

export default function VNPayReturnPage() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const { resetCart } = useCart();

  useEffect(() => {
    const handleVNPayReturn = async () => {
      const orderIdParam = params.get("orderId");

      if (!orderIdParam) {
        console.error("❌ Missing orderId in VNPay return URL");
        navigate("/payment-failed", { replace: true });
        return;
      }

      const orderId = Number(orderIdParam);

      try {
        /**
         * 🔥 SOURCE OF TRUTH
         * - Không tin query string (responseCode)
         * - Không tin VNPay param
         * → chỉ tin DB
         */
        const payment = await getPaymentByOrder(orderId);

        // ✅ PAYMENT PAID
        if (payment.status === "PAID") {
          await clearCart();
          resetCart();

          navigate(`/order-success/${orderId}`, { replace: true });
          return;
        }

        // ❌ FAILED / CANCELED
        navigate(
          `/payment-failed?orderId=${orderId}&reason=${payment.status}`,
          { replace: true }
        );
      } catch (error) {
        console.error("❌ VNPay return error", error);
        navigate(`/payment-failed?orderId=${orderId}&reason=UNKNOWN`, {
          replace: true,
        });
      }
    };

    handleVNPayReturn();
  }, [navigate, params, resetCart]);

  return (
    <div
      style={{
        minHeight: "60vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
      }}
    >
      <h3>Đang xử lý kết quả thanh toán…</h3>
      <p>Vui lòng không đóng trình duyệt</p>
    </div>
  );
}
