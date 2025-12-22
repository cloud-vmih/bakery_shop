// import { useEffect } from "react";
// import { useNavigate, useSearchParams } from "react-router-dom";

// import { getPaymentByOrder } from "../services/payment.service";
// import { clearCart } from "../services/cart.service";
// import { useCart } from "../context/CartContext";

// export default function VNPayReturnPage() {
//   const navigate = useNavigate();
//   const [params] = useSearchParams();
//   const { resetCart } = useCart();

//   useEffect(() => {
//     const handleVNPayReturn = async () => {
//       const txnRef = params.get("vnp_TxnRef");

//       if (!txnRef) {
//         navigate("/payment-failed", { replace: true });
//         return;
//       }

//       // ✅ vnp_TxnRef = orderId_timestamp
//       const orderId = Number(txnRef.split("_")[0]);
//       if (Number.isNaN(orderId)) {
//         navigate("/payment-failed", { replace: true });
//         return;
//       }

//       try {
//         // 🔥 SOURCE OF TRUTH: DB
//         const payment = await getPaymentByOrder(orderId);

//         if (payment.status === "PAID") {
//           // clear cart
//           await clearCart();
//           resetCart();

//           navigate(`/order-success/${orderId}`, { replace: true });
//           return;
//         }

//         // FAILED / CANCELED
//         navigate(`/payment-failed?orderId=${orderId}`, { replace: true });
//       } catch (err) {
//         navigate(`/payment-failed?orderId=${orderId}`, { replace: true });
//       }
//     };

//     handleVNPayReturn();
//   }, [navigate, params, resetCart]);

//   return (
//     <div
//       style={{
//         minHeight: "60vh",
//         display: "flex",
//         alignItems: "center",
//         justifyContent: "center",
//         flexDirection: "column",
//       }}
//     >
//       <h3>Đang xử lý kết quả thanh toán…</h3>
//       <p>Vui lòng không đóng trình duyệt</p>
//     </div>
//   );
// }
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
      const txnRef = params.get("vnp_TxnRef");

      // ❌ Không có txnRef
      if (!txnRef) {
        navigate("/payment-failed?reason=INVALID_TXN", { replace: true });
        return;
      }

      // ✅ vnp_TxnRef = orderId_timestamp
      const orderId = Number(txnRef.split("_")[0]);
      if (Number.isNaN(orderId)) {
        navigate("/payment-failed?reason=INVALID_ORDER_ID", { replace: true });
        return;
      }

      try {
        /**
         * 🔥 SOURCE OF TRUTH
         * Không tin query string
         * Không tin responseCode
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
        // ❌ Lỗi hệ thống / không lấy được payment
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
