import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useUser } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { getMyAddresses } from "../services/address.service";

import CustomerInfo from "../components/checkout/CustomerInfo";
import ShippingInfo from "../components/checkout/ShippingInfo";
import DeliveryTimeSelector from "../components/checkout/DeliveryTimeSelector";
import PaymentMethodSelector from "../components/checkout/PaymentMethodSelector";
import OrderSummary from "../components/checkout/OrderSummary";
import ConfirmOrderButton from "../components/checkout/ConfirmOrderButton";

import "../styles/checkout.css";

const DRAFT_KEY = "checkout_draft_v1";

type Draft = {
  customer: { fullName: string; email: string; phone: string };
  selectedAddressId: number | null;
  newAddress: string;
  saveAddress: boolean;
  setDefault: boolean;
  deliveryDate: string;
  timeFrame: string;
  paymentMethod: "COD" | "VNPAY";
  note?: string;
};

function loadDraft(): Draft | null {
  try {
    const raw = sessionStorage.getItem(DRAFT_KEY);
    return raw ? (JSON.parse(raw) as Draft) : null;
  } catch {
    return null;
  }
}

function saveDraft(d: Draft) {
  try {
    sessionStorage.setItem(DRAFT_KEY, JSON.stringify(d));
  } catch {
    // ignore
  }
}

export default function Checkout() {
  const navigate = useNavigate();
  const { user } = useUser();
  const { items, checkedItems } = useCart();

  // ✅ lấy selectedItems y như bạn làm
  const selectedItems = useMemo(
    () => items.filter((i) => checkedItems.includes(i.id)),
    [items, checkedItems]
  );

  // ✅ load draft trước để F5 không mất
  const draft = loadDraft();

  /* ================= CUSTOMER ================= */
  const [customer, setCustomer] = useState(() => ({
    fullName: draft?.customer.fullName || "",
    email: draft?.customer.email || "",
    phone: draft?.customer.phone || "",
  }));

  // ✅ Giữ behavior cũ: prefill từ user (nhưng không ghi đè nếu người dùng đã sửa)
  useEffect(() => {
    if (!user) return;

    setCustomer((prev) => ({
      fullName: prev.fullName || user.fullName || "",
      email: prev.email || user.email || "",
      phone: prev.phone || user.phoneNumber || "",
    }));
  }, [user]);

  /* ================= ADDRESS ================= */
  const [addresses, setAddresses] = useState<any[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(
    draft?.selectedAddressId ?? null
  );
  const [newAddress, setNewAddress] = useState(draft?.newAddress ?? "");
  const [saveAddressState, setSaveAddressState] = useState(
    draft?.saveAddress ?? false
  );
  const [setDefault, setSetDefault] = useState(draft?.setDefault ?? false);

  useEffect(() => {
    if (!user) return;

    const loadAddresses = async () => {
      const data = await getMyAddresses();
      setAddresses(data || []);

      // ✅ chỉ auto-pick default nếu user chưa chọn gì & chưa nhập mới
      if (
        (draft?.selectedAddressId ?? null) === null &&
        (draft?.newAddress ?? "") === "" &&
        selectedAddressId === null &&
        newAddress.trim() === ""
      ) {
        const defaultAddr = data?.find((a: any) => a.isDefault);
        if (defaultAddr) setSelectedAddressId(defaultAddr.id);
      }
    };

    loadAddresses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  /* ================= DELIVERY ================= */
  const [deliveryDate, setDeliveryDate] = useState(draft?.deliveryDate ?? "");
  const [timeFrame, setTimeFrame] = useState(draft?.timeFrame ?? "");

  /* ================= NOTE ================= */
  const [note, setNote] = useState(draft?.note ?? "");

  /* ================= PAYMENT ================= */
  const [paymentMethod, setPaymentMethod] = useState<"COD" | "VNPAY">(
    draft?.paymentMethod ?? "COD"
  );

  // Handle form validation errors
  const [errors, setErrors] = useState<string[]>([]);

  const validate = (): boolean => {
    const errs: string[] = [];

    // CUSTOMER
    if (!customer.fullName.trim()) {
      errs.push("Vui lòng nhập họ và tên.");
    }

    if (!customer.phone.trim()) {
      errs.push("Vui lòng nhập số điện thoại.");
    } else if (!/^0\d{9}$/.test(customer.phone)) {
      errs.push("Số điện thoại không hợp lệ.");
    }

    if (!customer.email.trim()) {
      errs.push("Vui lòng nhập email.");
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customer.email)) {
      errs.push("Email không hợp lệ.");
    }

    // ADDRESS
    if (!selectedAddressId && !newAddress.trim()) {
      errs.push("Vui lòng chọn hoặc nhập địa chỉ giao hàng.");
    }

    // DELIVERY
    if (!deliveryDate) {
      errs.push("Vui lòng chọn ngày giao hàng.");
    } else {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const chosen = new Date(deliveryDate);
      if (chosen < today) {
        errs.push("Ngày giao hàng không được ở quá khứ.");
      }
    }

    if (!timeFrame) {
      errs.push("Vui lòng chọn khung giờ giao hàng.");
    }

    // CART
    if (selectedItems.length === 0) {
      errs.push("Giỏ hàng của bạn đang trống.");
    }

    setErrors(errs);
    return errs.length === 0;
  };

  // ✅ Auto-save toàn bộ form vào sessionStorage để F5 vẫn giữ
  useEffect(() => {
    saveDraft({
      customer,
      selectedAddressId,
      newAddress,
      saveAddress: saveAddressState,
      setDefault,
      deliveryDate,
      timeFrame,
      paymentMethod,
      note,
    });
  }, [
    customer,
    selectedAddressId,
    newAddress,
    saveAddressState,
    setDefault,
    deliveryDate,
    timeFrame,
    paymentMethod,
    note,
  ]);

  /* ================= SUBMIT ================= */
  const selectedAddress = addresses.find(
    (a: any) => a.id === selectedAddressId
  );
  const handleSubmit = () => {
    if (!validate()) return;

    const payload = {
      customer,
      address: selectedAddressId
        ? {
            addressId: selectedAddressId,
            formattedAddress: selectedAddress?.formattedAddress,
          }
        : {
            formattedAddress: newAddress,
            latitude: null,
            longitude: null,
            saveAddress: saveAddressState,
            isDefault: setDefault,
          },
      delivery: { deliveryDate, timeFrame },
      paymentMethod,
      items: selectedItems,
      note,
    };

    navigate("/checkout/confirm", { state: { payload } });
  };

  return (
    <div className="bg-white">
      {/* ===== BREADCRUMB ===== */}
      <div className="max-w-6xl mx-auto px-4 pt-6 text-sm">
        <span className="text-cyan-700 font-medium">Giỏ hàng</span>
        <span className="mx-2">›</span>
        <span>Thanh toán và giao hàng</span>
      </div>

      {/* ===== MAIN ===== */}
      <div className="max-w-6xl mx-auto px-4 py-10 grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* ================= LEFT ================= */}
        <div className="lg:col-span-2">
          <div className="checkout-section">
            <CustomerInfo value={customer} onChange={setCustomer} />
          </div>

          <div className="checkout-section">
            <ShippingInfo
              addresses={addresses}
              selectedAddressId={selectedAddressId}
              onSelectAddress={setSelectedAddressId}
              newAddress={newAddress}
              onNewAddressChange={setNewAddress}
              saveAddress={saveAddressState}
              setSaveAddress={setSaveAddressState}
              setDefault={setDefault}
              setSetDefault={setSetDefault}
            />
          </div>

          <div className="checkout-section">
            <DeliveryTimeSelector
              deliveryDate={deliveryDate}
              setDeliveryDate={setDeliveryDate}
              timeFrame={timeFrame}
              setTimeFrame={setTimeFrame}
            />
          </div>

          <div className="checkout-section checkout-note">
            <h3 className="checkout-title">Yêu cầu khác (tuỳ chọn)</h3>

            <textarea
              className="checkout-textarea"
              placeholder="Nhập yêu cầu của bạn (ví dụ: ít ngọt, giao trước 18h...)"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={3}
            />
          </div>

          <div className="checkout-section">
            <PaymentMethodSelector
              paymentMethod={paymentMethod}
              setPaymentMethod={setPaymentMethod}
            />
          </div>
        </div>

        {/* ================= RIGHT ================= */}
        <div className="space-y-6">
          <OrderSummary items={selectedItems} />

          <ConfirmOrderButton onSubmit={handleSubmit} />
          {errors.length > 0 && (
            <div className="checkout-errors">
              {errors.map((e, i) => (
                <div key={i} className="checkout-error">
                  • {e}
                </div>
              ))}
            </div>
          )}

          <Link to="/cart" className="checkout-back">
            Quay lại giỏ hàng
          </Link>
        </div>
      </div>
    </div>
  );
}
