import CartItem from "../components/CartItem";
import ConfirmRemoveModal from "../components/ConfirmRemoveModal";
import { useCart } from "../context/CartContext";
import { useInventory } from "../context/InventoryContext";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { calculateOrderTotals } from "../utils/orderCalculator";
import BranchSelectModal from "../components/BranchSelectModal";
import { formatVND } from "../utils/formatCurrency";

import { MapPinIcon, PencilIcon } from "@heroicons/react/24/outline";
import { getBranches } from "../services/branch.service";

import toast from "react-hot-toast";

export default function Cart() {
  const navigate = useNavigate();

  const {
    items,
    loading,
    checkedItems,
    toggleItem,
    toggleAll,
    increase,
    decrease,
    askRemove,
    confirmRemove,
    cancelRemove,
    confirmOpen,
  } = useCart();

  const [branches, setBranches] = useState<any[]>([]);

  useEffect(() => {
    getBranches()
      .then(setBranches)
      .catch(() => {
        toast.error("Không thể tải danh sách chi nhánh");
      });
  }, []);

  const { branchId, getItemQuantity, setBranchId, refreshInventory } =
    useInventory();

  const selectedBranch = branchId
    ? branches.find((b) => b.id === branchId)
    : null;

  const [showBranchModal, setShowBranchModal] = useState(false);

  const selectedItems = items.filter((i) => checkedItems.includes(i.id));

  const { subtotal, vat, total, discount } =
    calculateOrderTotals(selectedItems);

  const [highlight, setHighlight] = useState(false);
  useEffect(() => {
    if (selectedItems.length > 0) {
      setHighlight(true);
      const t = setTimeout(() => setHighlight(false), 300);
      return () => clearTimeout(t);
    }
  }, [total, selectedItems.length]);

  if (loading) {
    return (
      <p className="text-center mt-16 text-green-700 font-medium">
        Đang tải giỏ hàng...
      </p>
    );
  }

  const hasOverStockItem =
    branchId !== null &&
    items.some((cartItem) => {
      const available = getItemQuantity(cartItem.item.id, branchId);
      return cartItem.quantity > available;
    });

  const cannotCheckout = selectedItems.length === 0 || hasOverStockItem;

  return (
    <>
      <div className="min-h-screen bg-green-50">
        <div className="max-w-6xl mx-auto px-4 py-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-6">
            <div className="flex justify-between items-center mb-2">
              <h2 className="flex items-center gap-3 text-xl font-bold text-green-800">
                <svg
                  className="w-6 h-6 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                >
                  <path d="M3 3h2l.4 2M7 13h10l4-8H5.4" />
                  <circle cx="9" cy="21" r="1" />
                  <circle cx="20" cy="21" r="1" />
                </svg>
                Giỏ hàng của bạn
              </h2>

              {items.length > 0 && (
                <button
                  onClick={toggleAll}
                  className="text-sm text-green-600 hover:underline"
                >
                  {checkedItems.length === items.length
                    ? "Bỏ chọn tất cả"
                    : "Chọn tất cả"}
                </button>
              )}
            </div>

            {checkedItems.length > 0 && (
              <p className="text-sm text-gray-500 mb-4">
                Đã chọn <b>{checkedItems.length}</b> sản phẩm
              </p>
            )}

            {/* EMPTY */}
            {items.length === 0 && (
              <div className="text-center py-16">
                <div className="text-5xl mb-4">🛒</div>
                <p className="text-gray-600 mb-6">
                  Giỏ hàng của bạn đang trống
                </p>

                <button
                  onClick={() => navigate("/menu")}
                  className="inline-flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-xl font-semibold shadow-md hover:bg-green-700 transition"
                >
                  ← Quay lại cửa hàng
                </button>
              </div>
            )}

            {/* ITEMS */}
            {items.map((cartItem) => {
              const available =
                branchId !== null
                  ? getItemQuantity(cartItem.item.id, branchId)
                  : Infinity;

              return (
                <CartItem
                  key={cartItem.id}
                  item={cartItem}
                  checked={checkedItems.includes(cartItem.id)}
                  available={available}
                  onToggle={() => toggleItem(cartItem.id)}
                  onIncrease={() => {
                    increase(cartItem);
                  }}
                  onDecrease={() => {
                    if (cartItem.quantity === 1) {
                      askRemove(cartItem.id);
                    } else {
                      decrease(cartItem);
                    }
                  }}
                  onRemove={() => askRemove(cartItem.id)}
                />
              );
            })}
          </div>

          {/* RIGHT */}
          <div className="bg-white rounded-2xl shadow-lg p-6 h-fit sticky top-24">
            {/* HEADER */}
            <h2 className="flex items-center gap-3 text-xl font-bold text-green-800">
              <svg
                className="w-6 h-6 text-green-600"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 14h6M9 10h6M7 4h10a2 2 0 012 2v14l-3-2-3 2-3-2-3 2V6a2 2 0 012-2z"
                />
              </svg>
              Tổng cộng giỏ hàng
            </h2>

            {/* SELECTED BRANCH */}
            <div className="mt-4 mb-6">
              {selectedBranch ? (
                <div className="flex items-center justify-between gap-4 px-4 py-3.5 rounded-xl bg-emerald-50 border border-emerald-100">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-9 h-9 rounded-full bg-emerald-100 shrink-0">
                      <MapPinIcon className="w-5 h-5 text-emerald-600" />
                    </div>

                    <div className="leading-tight">
                      <div className="text-sm font-semibold text-emerald-800">
                        {selectedBranch.name}
                      </div>
                      <div className="text-xs text-gray-600 mt-0.5">
                        {selectedBranch.address?.fullAddress ||
                          "Chưa có địa chỉ"}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => setShowBranchModal(true)}
                    className="flex items-center gap-1 text-xs font-medium text-emerald-700 hover:text-emerald-800 transition"
                  >
                    <PencilIcon className="w-4 h-4" />
                    Đổi
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowBranchModal(true)}
                  className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl bg-gray-50 border border-dashed border-gray-300 text-gray-600 hover:border-emerald-400 hover:text-emerald-700 transition"
                >
                  <MapPinIcon className="w-5 h-5 shrink-0" />
                  <span className="text-sm font-medium">
                    Chọn chi nhánh để kiểm tra tồn kho
                  </span>
                </button>
              )}
            </div>

            {/* SUBTOTAL */}
            <div className="mt-6 space-y-3 text-sm text-gray-700">
              <div className="flex justify-between">
                <span className="text-gray-600">Tạm tính (sau ưu đãi)</span>{" "}
                <span className="font-medium">{formatVND(subtotal)} </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600">VAT (10%)</span>
                <span className="font-medium">{formatVND(vat)}</span>
              </div>
            </div>

            {/* TIẾT KIỆM – HIGHLIGHT */}
            {discount > 0 && (
              <div className="mt-3 px-4 py-2 rounded-lg bg-emerald-50 border border-emerald-200">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-emerald-700">
                    Bạn đã tiết kiệm
                  </span>
                  <span className="text-base font-bold text-emerald-800">
                    {formatVND(discount)}
                  </span>
                </div>
              </div>
            )}

            {/* DIVIDER */}
            <hr className="my-5 border-gray-200" />

            {/* TOTAL */}
            <div
              className={`
      flex justify-between items-center
      text-lg font-bold
      transition-all duration-300
      ${highlight ? "scale-105 text-green-800" : "text-green-700"}
    `}
            >
              <span>Tổng cộng</span>
              <span>{formatVND(total)}</span>
            </div>
            {branchId === null && (
              <div className="mt-3 text-sm text-red-600 bg-red-50 border border-red-200 p-3 rounded-lg">
                Vui lòng chọn chi nhánh để kiểm tra tồn kho và tiếp tục thanh
                toán
              </div>
            )}
            {/* CTA */}
            <button
              disabled={cannotCheckout}
              onClick={() => {
                if (branchId === null) {
                  setShowBranchModal(true);
                  return;
                }

                navigate("/checkout");
              }}
              className={`
    mt-6 w-full py-3.5 rounded-xl font-semibold
    transition-all duration-200
    ${
      cannotCheckout
        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
        : "bg-emerald-600 hover:bg-emerald-700 text-white shadow-md hover:shadow-lg"
    }
  `}
            >
              Tiến hành đặt hàng
            </button>
          </div>
        </div>
      </div>

      <ConfirmRemoveModal
        open={confirmOpen}
        onConfirm={confirmRemove}
        onCancel={cancelRemove}
      />
      <BranchSelectModal
        open={showBranchModal}
        onClose={() => setShowBranchModal(false)}
        onSelect={(branchId) => {
          setBranchId(branchId);
          setShowBranchModal(false);
          refreshInventory();
        }}
      />
    </>
  );
}
