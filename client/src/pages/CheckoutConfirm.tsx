import { Link, useLocation, useNavigate } from "react-router-dom";
import { useMemo, useState } from "react";

import OrderSummary from "../components/checkout/OrderSummary";

import { createOrder } from "../services/orders.service";
import { createVNPayUrl } from "../services/payment.service";
import { clearCart } from "../services/cart.service";
import { checkInventoryForCheckout } from "../services/inventory.service";

import { useCart } from "../context/CartContext";
import { useInventory } from "../context/InventoryContext";
import { calculateOrderTotals } from "../utils/orderCalculator";
import { formatVND } from "../utils/formatCurrency";

import {
  User,
  Mail,
  Phone,
  MapPin,
  CreditCard,
  ShoppingBag,
  AlertTriangle,
} from "lucide-react";

type InventoryErrorItem = {
  itemId: number;
  available: number;
  requested: number;
};

const PAYMENT_METHOD_META: Record<
  string,
  { label: string; className: string }
> = {
  COD: {
    label: "Thanh toán khi nhận hàng",
    className: "bg-emerald-100 text-emerald-700",
  },
  VNPAY: {
    label: "Thanh toán qua VNPay Gateway",
    className: "bg-blue-100 text-blue-700",
  },
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

  const totals = useMemo(() => {
    return calculateOrderTotals(payload.items, {
      shippingFee: payload.shippingFee ?? 0,
      discount: payload.discount ?? 0,
      membershipDiscount: payload.membershipDiscount ?? 0,
    });
  }, [payload]);

  const paymentMeta = PAYMENT_METHOD_META[payload.paymentMethod];

  /* ================= GUARDS ================= */
  if (!payload) {
    return (
      <div className="min-h-[calc(100vh-80px)] flex items-center justify-center">
        <p>Không tìm thấy dữ liệu đơn hàng</p>
      </div>
    );
  }

  if (!branchId) {
    return (
      <div className="min-h-[calc(100vh-80px)] flex items-center justify-center">
        <p>Vui lòng chọn chi nhánh trước khi thanh toán</p>
      </div>
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
        totalAmount: totals.total,
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
        const { vnpayUrl } = await createVNPayUrl(order.orderId, totals.total);
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
    <div className="min-h-[calc(100vh-80px)] bg-emerald-50 py-10 px-4">
      <div className="mx-auto max-w-6xl space-y-6">
        {/* PROGRESS */}
        <div className="text-sm text-gray-600">
          <span className="text-emerald-600 font-medium">Giỏ hàng</span>
          <span className="mx-2">›</span>
          <span className="text-emerald-600 font-medium">
            Thông tin đặt hàng
          </span>
          <span className="mx-2">›</span>
          <span className="font-semibold text-gray-900">Xác nhận đơn hàng</span>
        </div>

        <h2 className="text-2xl font-bold text-gray-900">Xác nhận đơn hàng</h2>

        {/* GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT */}
          <div className="lg:col-span-2 space-y-6">
            {/* CUSTOMER INFO */}
            <div className="rounded-2xl bg-white p-6 shadow-sm border">
              <h3 className="flex items-center gap-2 text-lg font-semibold mb-5">
                <User className="w-5 h-5 text-emerald-600" />
                Thông tin khách hàng
              </h3>

              <div className="space-y-4 text-sm text-gray-700">
                <div className="flex items-center gap-4">
                  <User className="w-4 h-4 text-emerald-500" />
                  <span className="w-28 text-gray-500">Khách hàng</span>
                  <span className="font-medium">
                    {payload.customer.fullName}
                  </span>
                </div>

                <div className="flex items-center gap-4">
                  <Phone className="w-4 h-4 text-emerald-500" />
                  <span className="w-28 text-gray-500">Điện thoại</span>
                  <span>{payload.customer.phone}</span>
                </div>

                <div className="flex items-center gap-4">
                  <Mail className="w-4 h-4 text-emerald-500" />
                  <span className="w-28 text-gray-500">Email</span>
                  <span>{payload.customer.email}</span>
                </div>

                <div className="flex items-start gap-4">
                  <MapPin className="w-4 h-4 text-emerald-500 mt-1" />
                  <span className="w-28 text-gray-500">Địa chỉ</span>
                  <span className="flex-1">{payload.address.fullAddress}</span>
                </div>

                {payload.note && (
                  <div className="flex items-start gap-4">
                    <ShoppingBag className="w-4 h-4 text-emerald-500 mt-1" />
                    <span className="w-28 text-gray-500">Ghi chú</span>
                    <span className="italic text-gray-500">{payload.note}</span>
                  </div>
                )}
              </div>
            </div>

            {/* ORDER SUMMARY */}
            <div className="rounded-2xl bg-white p-6 shadow-sm border">
              <h3 className="flex items-center gap-2 text-lg font-semibold mb-4">
                <ShoppingBag className="w-5 h-5 text-emerald-600" />
                Sản phẩm đã chọn
              </h3>
              <OrderSummary
                items={payload.items}
                shippingFee={payload.shippingFee}
                discount={payload.discount}
                membershipDiscount={payload.membershipDiscount}
              />
            </div>

            {/* INVENTORY ERROR */}
            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                <div className="flex items-center gap-2 font-semibold mb-2">
                  <AlertTriangle className="w-4 h-4" />
                  {error}
                </div>

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
          </div>

          {/* RIGHT – STICKY */}
          <div className="space-y-6 sticky top-24 h-fit">
            <div className="rounded-2xl bg-white p-6 shadow-md border">
              <h3 className="flex items-center gap-2 text-lg font-semibold mb-4">
                <CreditCard className="w-5 h-5 text-emerald-600" />
                Tóm tắt thanh toán
              </h3>

              <div className="space-y-3 text-sm text-gray-700">
                <div className="flex justify-between">
                  <span>Tạm tính</span>
                  <span>{formatVND(totals.subtotal)}</span>
                </div>

                <div className="flex justify-between">
                  <span>VAT (10%)</span>
                  <span>{formatVND(totals.vat)}</span>
                </div>

                <div className="flex justify-between">
                  <span>Phí ship</span>
                  <span>{formatVND(totals.shippingFee)}</span>
                </div>

                <div className="order-row text-green-600">
                  <span>Giảm giá</span>
                  <span>-{formatVND(totals.discount)}</span>
                </div>

                <div className="order-row text-green-600">
                  <span>Giảm giá thành viên</span>
                  <span>-{formatVND(totals.membershipDiscount)}</span>
                </div>

                <div className="flex justify-between font-bold text-lg text-emerald-700">
                  <span>Tổng cộng</span>
                  <span>{formatVND(totals.total)}</span>
                </div>
              </div>

              {/* PAYMENT METHOD */}
              <div
                className={`mt-4 inline-flex items-center gap-2 text-xs font-medium px-3 py-1 rounded-full ${
                  paymentMeta?.className ?? "bg-gray-100 text-gray-600"
                }`}
              >
                Phương thức:&nbsp;
                {paymentMeta?.label ?? payload.paymentMethod}
              </div>

              {/* CTA */}
              <button
                onClick={handleConfirm}
                disabled={isSubmitting}
                className="mt-6 w-full rounded-xl bg-emerald-600 py-3 text-white font-semibold hover:bg-emerald-700 transition disabled:opacity-50"
              >
                {isSubmitting ? "Đang xử lý..." : "Xác nhận đặt hàng"}
              </button>

              <button
                onClick={() => navigate("/checkout")}
                disabled={isSubmitting}
                className="mt-3 w-full rounded-xl border bg-white py-3 text-sm"
              >
                Quay lại chỉnh sửa
              </button>

              <Link
                to="/cart"
                className="block mt-3 text-center text-sm text-emerald-600"
              >
                ← Quay lại giỏ hàng
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
