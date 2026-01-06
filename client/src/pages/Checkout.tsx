import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useUser } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import {
    getMyAddresses,
    createAddressForCheckout,
    Address,
} from "../services/address.service";

import CustomerInfo from "../components/checkout/CustomerInfo";
import ShippingInfo from "../components/checkout/ShippingInfo";
import PaymentMethodSelector from "../components/checkout/PaymentMethodSelector";
import OrderSummary from "../components/checkout/OrderSummary";
import ConfirmOrderButton from "../components/checkout/ConfirmOrderButton";

import MapProvider from "../components/MapProvider";
import { AddressResult } from "../components/AddressAutocomplete";

import { Header } from "../components/Header";

import { useInventory } from "../context/InventoryContext";
import { getBranches, Branch } from "../services/branch.services";
import { getDistanceKm } from "../utils/distance";
import { calculateShippingFee } from "../utils/shippingCalculator";

import "../styles/checkout.css";

/* ===============================
   SESSION STORAGE
================================ */
const DRAFT_KEY = "checkout_draft_v1";

type Draft = {
    customer: { fullName: string; email: string; phone: string };
    selectedAddressId: number | null;
    newAddress: string;
    newAddressObj?: AddressResult | null;
    saveAddress: boolean;
    setDefault: boolean;
    paymentMethod: "COD" | "VNPAY";
    note?: string;
};

const loadDraft = (): Draft | null => {
    try {
        const raw = sessionStorage.getItem(DRAFT_KEY);
        return raw ? JSON.parse(raw) : null;
    } catch {
        return null;
    }
};

const saveDraft = (draft: Draft) => {
    try {
        sessionStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
    } catch { }
};

/* ===============================
   COMPONENT
================================ */
export default function Checkout() {
    const navigate = useNavigate();
    const { user } = useUser();
    const { items, checkedItems } = useCart();

    const draft = loadDraft();
    const { branchId } = useInventory();
    const [branches, setBranches] = useState<Branch[]>([]);
    const [cartBranch, setCartBranch] = useState<Branch | null>(null);
    const [customerLocation, setCustomerLocation] = useState<{ lat: number; lng: number } | null>(null);
    const [shippingFee, setShippingFee] = useState<number>(0);
    const [shippingDistance, setShippingDistance] = useState<number | null>(null);

    /* ================= CUSTOMER ================= */
    const [customer, setCustomer] = useState({
        fullName: draft?.customer.fullName || "",
        email: draft?.customer.email || "",
        phone: draft?.customer.phone || "",
    });

    useEffect(() => {
        if (!user) return;
        setCustomer((prev) => ({
            fullName: prev.fullName || user.fullName || "",
            email: prev.email || user.email || "",
            phone: prev.phone || user.phoneNumber || "",
        }));
    }, [user]);

    /* ================= CART ================= */
    const selectedItems = useMemo(
        () => items.filter((i) => checkedItems.includes(i.id)),
        [items, checkedItems]
    );

    /* ================= ADDRESS ================= */
    const [addresses, setAddresses] = useState<Address[]>([]);
    const [selectedAddressId, setSelectedAddressId] = useState<number | null>(
        draft?.selectedAddressId ?? null
    );

    const [newAddress, setNewAddress] = useState(draft?.newAddress ?? "");
    const [newAddressObj, setNewAddressObj] = useState<AddressResult | null>(
        draft?.newAddressObj ?? null
    );

    const [saveAddressState, setSaveAddressState] = useState(
        draft?.saveAddress ?? false
    );
    const [setDefault, setSetDefault] = useState(draft?.setDefault ?? false);

    useEffect(() => {
        if (!user) return;

        const loadAddresses = async () => {
            const data = await getMyAddresses();
            setAddresses(data);

            if (
                !draft?.selectedAddressId &&
                !draft?.newAddress &&
                selectedAddressId === null &&
                newAddress.trim() === ""
            ) {
                const defaultAddr = data.find((a) => a.isDefault);
                setSelectedAddressId(defaultAddr?.id ?? null);
            }
        };

        loadAddresses();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]);

    // Load danh sách chi nhánh
    useEffect(() => {
        getBranches()
            .then(setBranches)
            .catch(err => {
                console.error("Lỗi load branches:", err);
            });
    }, []);

    // Tìm chi nhánh của giỏ hàng
    useEffect(() => {
        if (!branchId || branches.length === 0) {
            setCartBranch(null);
            return;
        }
        const branch = branches.find(b => b.id === branchId);
        setCartBranch(branch || null);

    }, [branchId, branches]);

    // Cập nhật tọa độ khách hàng khi chọn địa chỉ
    useEffect(() => {
        let lat: number | null = null;
        let lng: number | null = null;

        if (selectedAddressId) {
            const addr = addresses.find(a => a.id === selectedAddressId);
            lat = addr?.lat ?? null;
            lng = addr?.lng ?? null;
        } else if (newAddressObj) {
            lat = newAddressObj.lat;
            lng = newAddressObj.lng;
        }

        setCustomerLocation(lat && lng ? { lat, lng } : null);
    }, [selectedAddressId, addresses, newAddressObj]);

    // Tính khoảng cách + phí ship
    useEffect(() => {
        if (!cartBranch || !customerLocation) {
            setShippingFee(0);
            setShippingDistance(null);
            return;
        }

        const distance = getDistanceKm(
            cartBranch.lat,
            cartBranch.lng,
            customerLocation.lat,
            customerLocation.lng
        );

        setShippingDistance(distance);
        setShippingFee(calculateShippingFee(
            cartBranch.lat,
            cartBranch.lng,
            customerLocation.lat,
            customerLocation.lng));
    }, [cartBranch, customerLocation]);

    /* ================= NOTE ================= */
    const [note, setNote] = useState(draft?.note ?? "");

    /* ================= PAYMENT ================= */
    const [paymentMethod, setPaymentMethod] = useState<"COD" | "VNPAY">(
        draft?.paymentMethod ?? "COD"
    );

    /* ================= ERRORS ================= */
    const [errors, setErrors] = useState<string[]>([]);

    const validate = (): boolean => {
        const errs: string[] = [];

        if (!customer.fullName.trim()) errs.push("Vui lòng nhập họ và tên.");
        if (!/^0\d{9}$/.test(customer.phone))
            errs.push("Số điện thoại không hợp lệ.");
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customer.email))
            errs.push("Email không hợp lệ.");

        if (!selectedAddressId) {
            if (!newAddress.trim())
                errs.push("Vui lòng chọn hoặc nhập địa chỉ giao hàng.");
            if (!newAddressObj) errs.push("Vui lòng chọn địa chỉ từ gợi ý Google.");
        }

        if (selectedItems.length === 0) errs.push("Giỏ hàng của bạn đang trống.");

        setErrors(errs);
        return errs.length === 0;
    };

    /* ================= SAVE DRAFT ================= */
    useEffect(() => {
        saveDraft({
            customer,
            selectedAddressId,
            newAddress,
            newAddressObj,
            saveAddress: saveAddressState,
            setDefault,
            paymentMethod,
            note,
        });
    }, [
        customer,
        selectedAddressId,
        newAddress,
        newAddressObj,
        saveAddressState,
        setDefault,
        paymentMethod,
        note,
    ]);

    /* ================= SUBMIT ================= */
    const handleSubmit = async () => {
        if (!validate()) return;

        let addressId = selectedAddressId;
        let fullAddress = "";

        // 🔥 CASE 1: user nhập địa chỉ mới
        if (!addressId && newAddressObj) {
            try {
                const res = await createAddressForCheckout({
                    fullAddress: newAddressObj.fullAddress,
                    lat: newAddressObj.lat,
                    lng: newAddressObj.lng,
                    placeId: newAddressObj.placeId,
                    isDefault: setDefault,
                });
                addressId = res.addressId;
                fullAddress = res.fullAddress;
            } catch {
                setErrors(["Không thể lưu địa chỉ mới. Vui lòng thử lại."]);
                return;
            }
        }

        // 🔥 CASE 2: chọn địa chỉ từ sổ địa chỉ
        if (addressId && !fullAddress) {
            const selected = addresses.find((a) => a.id === addressId);
            fullAddress = selected?.fullAddress || "";
        }

        const payload = {
            customer,
            address: {
                addressId,
                fullAddress,
            },
            paymentMethod,
            items: selectedItems,
            note,
            shippingFee: shippingFee, //thay đổi biến ở đây
            discount: 50000, //thay đổi biến ở đây
        };

        navigate("/checkout/confirm", { state: { payload } });
    };

    /* ================= RENDER ================= */
    return (
        <>
            <Header />
            <div
                className="min-h-screen"
                style={{ backgroundColor: "var(--page-bg)" }}
            >
                <div className="max-w-6xl mx-auto px-4 pt-6 text-sm">
                    <span className="text-emerald-600 font-medium">Giỏ hàng</span>
                    <span className="mx-2">›</span>
                    <span className="font-semibold text-gray-900">
                        Thông tin đặt hàng
                    </span>
                </div>

                <div className="max-w-6xl mx-auto px-4 py-10 grid grid-cols-1 lg:grid-cols-3 gap-12">
                    <div className="lg:col-span-2">
                        <div className="checkout-section">
                            <CustomerInfo value={customer} onChange={setCustomer} />
                        </div>

                        <MapProvider>
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
                                    onSelectNewAddress={setNewAddressObj}
                                />
                            </div>
                        </MapProvider>

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

                    <div className="space-y-6">
                        <OrderSummary
                            items={selectedItems}
                            discount={50000} //Thêm biến ở đây
                            shippingFee={shippingFee} 
                        />
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
                        <Link
                            to="/cart"
                            className="block mt-3 text-center text-sm text-emerald-600"
                        >
                            ← Quay lại giỏ hàng
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
}