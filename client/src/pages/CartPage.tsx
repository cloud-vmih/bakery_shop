import CartItem from "../components/CartItem";
import ConfirmRemoveModal from "../components/ConfirmRemoveModal";
import { useCart } from "../context/CartContext";
import { useInventory } from "../context/InventoryContext";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Header } from "../components/Header";

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

  const { branchId, getItemQuantity } = useInventory();

  const selectedItems = items.filter((i) => checkedItems.includes(i.id));

  const subtotal = selectedItems.reduce(
    (sum, i) => sum + i.item.price * i.quantity,
    0
  );
  const vat = subtotal * 0.1;
  const total = subtotal + vat;

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

  const hasOverStockItem = items.some((cartItem) => {
    if (branchId === null) return false;

    const available = getItemQuantity(cartItem.item.id, branchId);
    return cartItem.quantity > available;
  });

  return (
    <>
      <div className="min-h-screen bg-green-50">
        <div className="max-w-6xl mx-auto px-4 py-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-6">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-2xl font-bold text-green-800">
                🛒 Giỏ hàng của bạn
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
                    if (cartItem.quantity >= available) {
                      toast.error(
                        `⚠️ "${cartItem.item.name}" chỉ còn ${available} sản phẩm`
                      );
                      return;
                    }
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
            <h3 className="text-xl font-semibold text-green-800 mb-4">
              🧾 Tổng cộng giỏ hàng
            </h3>

            <div className="space-y-3 text-sm text-gray-700">
              <div className="flex justify-between">
                <span>Tạm tính</span>
                <span>{subtotal.toLocaleString()} VND</span>
              </div>

              <div className="flex justify-between">
                <span>VAT (10%)</span>
                <span>{vat.toLocaleString()} VND</span>
              </div>

              <hr />

              <div
                className={`flex justify-between font-bold text-lg transition ${
                  highlight ? "text-green-800 scale-[1.02]" : "text-green-700"
                }`}
              >
                <span>Tổng cộng</span>
                <span>{total.toLocaleString()} VND</span>
              </div>
            </div>

            <button
              disabled={selectedItems.length === 0 || hasOverStockItem}
              onClick={() => navigate("/checkout")}
              className={`mt-6 w-full py-3 rounded-xl font-semibold shadow-md transition
    ${
      selectedItems.length === 0 || hasOverStockItem
        ? "bg-gray-400 cursor-not-allowed opacity-60"
        : "bg-green-600 hover:bg-green-700 text-white"
    }
  `}
            >
              Tiến hành thanh toán
            </button>
          </div>
        </div>
      </div>

      <ConfirmRemoveModal
        open={confirmOpen}
        onConfirm={confirmRemove}
        onCancel={cancelRemove}
      />
    </>
  );
}
