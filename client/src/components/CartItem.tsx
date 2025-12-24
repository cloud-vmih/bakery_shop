import { Minus, Plus, X } from "lucide-react";

type Props = {
  item: any;
  checked: boolean;
  available: number; // tồn kho thực tế (stock - reserved)
  onToggle: () => void;
  onIncrease: () => void;
  onDecrease: () => void;
  onRemove: () => void;
};

export default function CartItem({
  item,
  checked,
  available,
  onToggle,
  onIncrease,
  onDecrease,
  onRemove,
}: Props) {
  const totalPrice = item.item.price * item.quantity;

  const isOverStock = available !== Infinity && item.quantity > available;

  const isMaxReached = available !== Infinity && item.quantity >= available;

  return (
    <div
      className={`flex items-center py-5 border-b gap-4 ${
        isOverStock ? "bg-red-50" : ""
      }`}
    >
      {/* CHECKBOX */}
      <input
        type="checkbox"
        checked={checked}
        onChange={onToggle}
        className="w-4 h-4 accent-cyan-600"
      />

      {/* IMAGE */}
      <img
        src={item.item.imageURL}
        alt={item.item.name}
        className="w-16 h-16 object-cover rounded-md border"
      />

      {/* NAME + PRICE */}
      <div className="flex-1">
        <h4 className="font-semibold text-cyan-800 hover:underline cursor-pointer">
          {item.item.name}
        </h4>

        <p className="text-sm text-gray-500 mt-1">
          {item.item.price.toLocaleString()} VND
        </p>

        {/* STOCK INFO */}
        {available !== Infinity && (
          <p
            className={`text-xs mt-1 ${
              available === 0 || isOverStock ? "text-red-600" : "text-gray-500"
            }`}
          >
            {available === 0 ? "Hết hàng" : `Còn ${available} sản phẩm`}
          </p>
        )}

        {/* QUANTITY CONTROL */}
        <div className="flex items-center gap-2 mt-2">
          {/* MINUS */}
          <button
            onClick={onDecrease}
            className="w-7 h-7 flex items-center justify-center border rounded hover:bg-gray-100"
          >
            <Minus size={14} />
          </button>

          <span
            className={`w-8 text-center text-sm font-medium ${
              isOverStock ? "text-red-600" : ""
            }`}
          >
            {item.quantity}
          </span>

          {/* PLUS */}
          <button
            onClick={onIncrease}
            disabled={isMaxReached}
            title={
              isMaxReached ? "Số lượng vượt quá hàng có sẵn" : "Tăng số lượng"
            }
            className={`w-7 h-7 flex items-center justify-center border rounded transition
              ${
                isMaxReached
                  ? "opacity-40 cursor-not-allowed"
                  : "hover:bg-gray-100"
              }
            `}
          >
            <Plus size={14} />
          </button>
        </div>

        {/* WARNING */}
        {isOverStock && (
          <p className="text-xs text-red-600 mt-1">
            ⚠️ Số lượng trong giỏ vượt quá số hàng có sẵn
          </p>
        )}
      </div>

      {/* TOTAL PRICE */}
      <div className="w-28 text-right font-semibold text-gray-800">
        {totalPrice.toLocaleString()} VND
      </div>

      {/* REMOVE */}
      <button
        onClick={onRemove}
        className="text-gray-400 hover:text-red-500 transition"
        title="Xoá sản phẩm"
      >
        <X size={20} />
      </button>
    </div>
  );
}
