import CartItem from "../components/CartItem";
import ConfirmRemoveModal from "../components/ConfirmRemoveModal";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

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

  const selectedItems = items.filter((i) => checkedItems.includes(i.id));

  const subtotal = selectedItems.reduce(
    (sum, i) => sum + i.item.price * i.quantity,
    0
  );
  const vat = subtotal * 0.1;
  const total = subtotal + vat;

  /* 🔥 animate total when changed */
  const [highlight, setHighlight] = useState(false);
  useEffect(() => {
    if (selectedItems.length > 0) {
      setHighlight(true);
      const t = setTimeout(() => setHighlight(false), 300);
      return () => clearTimeout(t);
    }
  }, [total]);

  if (loading) {
    return <p className="text-center mt-10">Đang tải giỏ hàng...</p>;
  }

  return (
    <>
      <div className="max-w-6xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* LEFT */}
        <div className="md:col-span-2 bg-white rounded-xl shadow p-6">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-2xl font-bold">🛒 Giỏ hàng của bạn</h2>

            {items.length > 0 && (
              <button
                onClick={toggleAll}
                className="text-sm text-cyan-600 hover:underline"
              >
                {checkedItems.length === items.length
                  ? "Bỏ chọn tất cả"
                  : "Chọn tất cả"}
              </button>
            )}
          </div>

          {/* Selected count */}
          {checkedItems.length > 0 && (
            <p className="text-sm text-gray-500 mb-4">
              Đã chọn <b>{checkedItems.length}</b> sản phẩm
            </p>
          )}

          {/* EMPTY */}
          {items.length === 0 && (
            <div className="text-center py-14">
              <div className="text-4xl mb-3">🛒</div>
              <p className="text-gray-600 mb-6">Giỏ hàng của bạn đang trống</p>

              <button
                onClick={() => navigate("/menu")}
                className="inline-flex items-center gap-2 bg-cyan-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-cyan-800 transition"
              >
                ← Quay lại cửa hàng
              </button>
            </div>
          )}

          {/* ITEMS */}
          {items.map((item) => (
            <CartItem
              key={item.id}
              item={item}
              checked={checkedItems.includes(item.id)}
              onToggle={() => toggleItem(item.id)}
              onIncrease={() => increase(item)}
              onDecrease={() => decrease(item)}
              onRemove={() => askRemove(item.id)}
            />
          ))}
        </div>

        {/* RIGHT – SUMMARY */}
        <div className="bg-white rounded-xl shadow p-6 h-fit sticky top-24">
          <h3 className="text-xl font-semibold mb-4">🧾 Tổng cộng giỏ hàng</h3>

          <div className="space-y-3 text-sm">
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
                highlight ? "text-cyan-800 scale-[1.02]" : "text-cyan-700"
              }`}
            >
              <span>Tổng cộng</span>
              <span>{total.toLocaleString()} VND</span>
            </div>
          </div>

          <button
            disabled={selectedItems.length === 0}
            className="mt-6 w-full bg-cyan-700 text-white py-3 rounded-lg font-semibold hover:bg-cyan-800 disabled:opacity-40 disabled:cursor-not-allowed"
            onClick={() => navigate("/checkout")}
          >
            Tiến hành thanh toán
          </button>
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
