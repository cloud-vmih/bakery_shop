// import { Link, useLocation, useNavigate } from "react-router-dom";
// import { useMemo, useState } from "react";

// import { Header } from "../components/Header";
// import OrderSummary from "../components/checkout/OrderSummary";

// import { createOrder } from "../services/orders.service";
// import { createVNPayUrl } from "../services/payment.service";
// import { clearCart } from "../services/cart.service";
// import { useCart } from "../context/CartContext";

// export default function CheckoutConfirm() {
//   const { resetCart } = useCart();
//   const navigate = useNavigate();
//   const location = useLocation();

//   const payload = (location.state as any)?.payload;
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   const totalAmount = useMemo(() => {
//     if (!payload?.items) return 0;
//     return payload.items.reduce(
//       (sum: number, i: any) => sum + i.item.price * i.quantity,
//       0
//     );
//   }, [payload]);

//   if (!payload) {
//     return (
//       <>
//         <Header />
//         <div className="min-h-[calc(100vh-80px)] bg-emerald-50 flex items-center justify-center px-4">
//           <div className="bg-white rounded-2xl border border-emerald-200 p-6 text-center">
//             <h3 className="text-lg font-semibold mb-2">Xác nhận đơn hàng</h3>
//             <p className="text-sm text-gray-500 mb-4">
//               Không tìm thấy dữ liệu đơn hàng
//             </p>
//             <button
//               onClick={() => navigate("/checkout")}
//               className="rounded-xl bg-emerald-600 px-5 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
//             >
//               Quay lại Checkout
//             </button>
//           </div>
//         </div>
//       </>
//     );
//   }

//   const handleConfirm = async () => {
//     if (isSubmitting) return;
//     setIsSubmitting(true);

//     try {
//       const order = await createOrder(payload);

//       if (payload.paymentMethod === "COD") {
//         await clearCart();
//         resetCart();
//         navigate(`/order-success/${order.orderId}`, { replace: true });
//         return;
//       }

//       if (payload.paymentMethod === "VNPAY") {
//         const { vnpayUrl } = await createVNPayUrl(order.orderId, totalAmount);
//         window.location.href = vnpayUrl;
//         return;
//       }

//       throw new Error("Unsupported payment method");
//     } catch (err: any) {
//       alert(err.message || "Không thể tạo đơn hàng");
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <>
//       <Header />

//       <div className="min-h-[calc(100vh-80px)] bg-emerald-50 py-10 px-4">
//         <div className="mx-auto max-w-3xl space-y-6">
//           {/* TITLE */}
//           <h2 className="text-center text-2xl font-bold text-gray-900">
//             Xác nhận đơn hàng
//           </h2>

//           {/* CUSTOMER INFO */}
//           <div className="rounded-2xl border border-emerald-200 bg-white p-6 shadow-sm">
//             <h3 className="mb-4 text-lg font-semibold">Thông tin khách hàng</h3>

//             <div className="space-y-3 text-sm">
//               <div className="flex justify-between">
//                 <span className="text-gray-500">Khách hàng</span>
//                 <span className="font-medium text-gray-900 text-right">
//                   {payload.customer.fullName} – {payload.customer.phone}
//                 </span>
//               </div>

//               <div className="flex justify-between">
//                 <span className="text-gray-500">Email</span>
//                 <span className="font-medium text-gray-900">
//                   {payload.customer.email}
//                 </span>
//               </div>

//               <div className="flex justify-between">
//                 <span className="text-gray-500">Địa chỉ</span>
//                 <span className="font-medium text-gray-900 text-right">
//                   {payload.address.fullAddress}
//                 </span>
//               </div>

//               <div className="flex justify-between items-center">
//                 <span className="text-gray-500">Thanh toán</span>
//                 <span className="inline-flex rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
//                   {payload.paymentMethod}
//                 </span>
//               </div>
//             </div>
//           </div>

//           {/* ORDER SUMMARY */}
//           <div className="rounded-2xl border border-emerald-200 bg-white p-6 shadow-sm">
//             <OrderSummary items={payload.items} />
//           </div>

//           {/* ACTIONS */}
//           <div className="space-y-3">
//             <button
//               onClick={handleConfirm}
//               disabled={isSubmitting}
//               className="w-full rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500
//                          py-3 text-sm font-semibold text-white
//                          hover:from-emerald-700 hover:to-emerald-600
//                          disabled:opacity-50"
//             >
//               {isSubmitting ? "Đang xử lý..." : "Xác nhận đặt hàng"}
//             </button>

//             <button
//               onClick={() => navigate("/checkout")}
//               disabled={isSubmitting}
//               className="w-full rounded-xl border border-emerald-200 bg-white
//                          py-3 text-sm font-semibold text-gray-700
//                          hover:bg-emerald-50"
//             >
//               Quay lại chỉnh sửa
//             </button>

//             <Link
//               to="/cart"
//               className="block text-center text-sm text-emerald-600 hover:underline"
//             >
//               ← Quay lại giỏ hàng
//             </Link>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useMemo, useState } from "react";

import { Header } from "../components/Header";
import OrderSummary from "../components/checkout/OrderSummary";

import { createOrder } from "../services/orders.service";
import { createVNPayUrl } from "../services/payment.service";
import { clearCart } from "../services/cart.service";
import { checkInventoryForCheckout } from "../services/inventory.service";

import { useCart } from "../context/CartContext";
import { useInventory } from "../context/InventoryContext";

type InventoryErrorItem = {
  itemId: number;
  available: number;
  requested: number;
};

export default function CheckoutConfirm() {
  const { resetCart } = useCart();
  const { branchId } = useInventory();

  const navigate = useNavigate();
  const location = useLocation();

  const payload = (location.state as any)?.payload;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [inventoryErrors, setInventoryErrors] = useState<InventoryErrorItem[]>(
    []
  );
  const [error, setError] = useState<string | null>(null);

  const totalAmount = useMemo(() => {
    if (!payload?.items) return 0;
    return payload.items.reduce(
      (sum: number, i: any) => sum + i.item.price * i.quantity,
      0
    );
  }, [payload]);

  /* ================= GUARDS ================= */
  if (!payload) {
    return (
      <>
        <Header />
        <div className="min-h-[calc(100vh-80px)] flex items-center justify-center">
          <p>Không tìm thấy dữ liệu đơn hàng</p>
        </div>
      </>
    );
  }

  if (!branchId) {
    return (
      <>
        <Header />
        <div className="min-h-[calc(100vh-80px)] flex items-center justify-center">
          <p>Vui lòng chọn chi nhánh trước khi thanh toán</p>
        </div>
      </>
    );
  }

  /* ================= CONFIRM ================= */
  const handleConfirm = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    setError(null);
    setInventoryErrors([]);

    try {
      // 1️⃣ CHECK INVENTORY
      const res = await checkInventoryForCheckout(
        branchId,
        payload.items.map((i: any) => ({
          itemId: i.item.id,
          quantity: i.quantity,
        }))
      );

      if (!res.ok) {
        setInventoryErrors(res.insufficient || []);
        setError(
          "Một số sản phẩm không đủ số lượng có sẵn, vui lòng quay lại giỏ hàng để điều chỉnh."
        );
        setIsSubmitting(false);
        return;
      }

      // 2️⃣ CREATE ORDER
      const order = await createOrder({
        ...payload,
        branchId,
      });

      // 3️⃣ COD
      if (payload.paymentMethod === "COD") {
        await clearCart();
        resetCart();
        navigate(`/order-success/${order.orderId}`, { replace: true });
        return;
      }

      // 4️⃣ VNPAY
      if (payload.paymentMethod === "VNPAY") {
        const { vnpayUrl } = await createVNPayUrl(order.orderId, totalAmount);
        window.location.href = vnpayUrl;
        return;
      }

      throw new Error("Unsupported payment method");
    } catch (err: any) {
      setError(err.message || "Không thể tạo đơn hàng");
      setIsSubmitting(false);
    }
  };

  /* ================= HELPER ================= */
  const getItemName = (itemId: number) => {
    const found = payload.items.find((i: any) => i.item.id === itemId);
    return found?.item?.name || `Sản phẩm #${itemId}`;
  };

  /* ================= UI ================= */
  return (
    <>
      <Header />

      <div className="min-h-[calc(100vh-80px)] bg-emerald-50 py-10 px-4">
        <div className="mx-auto max-w-3xl space-y-6">
          <h2 className="text-center text-2xl font-bold text-gray-900">
            Xác nhận đơn hàng
          </h2>

          {/* CUSTOMER INFO */}
          <div className="rounded-2xl border bg-white p-6">
            <h3 className="mb-4 font-semibold">Thông tin khách hàng</h3>
            <div className="text-sm space-y-2">
              <div className="flex justify-between">
                <span>Khách hàng</span>
                <span>
                  {payload.customer.fullName} – {payload.customer.phone}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Email</span>
                <span>{payload.customer.email}</span>
              </div>
              <div className="flex justify-between">
                <span>Địa chỉ</span>
                <span>{payload.address.fullAddress}</span>
              </div>
            </div>
          </div>

          {/* ORDER SUMMARY */}
          <div className="rounded-2xl border bg-white p-6">
            <OrderSummary items={payload.items} />
          </div>

          {/* INVENTORY ERROR */}
          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 space-y-2">
              <p className="font-semibold">{error}</p>

              {inventoryErrors.length > 0 && (
                <ul className="list-disc list-inside space-y-1">
                  {inventoryErrors.map((e) => (
                    <li key={e.itemId}>
                      {getItemName(e.itemId)}: còn {e.available}, cần{" "}
                      {e.requested}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {/* ACTIONS */}
          <div className="space-y-3">
            <button
              onClick={handleConfirm}
              disabled={isSubmitting}
              className="w-full rounded-xl bg-emerald-600 py-3 text-white font-semibold disabled:opacity-50"
            >
              {isSubmitting ? "Đang xử lý..." : "Xác nhận đặt hàng"}
            </button>

            <button
              onClick={() => navigate("/checkout")}
              disabled={isSubmitting}
              className="w-full rounded-xl border bg-white py-3"
            >
              Quay lại chỉnh sửa
            </button>

            <Link to="/cart" className="block text-center text-emerald-600">
              ← Quay lại giỏ hàng
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
