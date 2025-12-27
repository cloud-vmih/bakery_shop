import { Minus, Plus, X } from "lucide-react";
import toast from "react-hot-toast";

type Props = {
  item: any;
  checked: boolean;
  available: number;
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

  return (
    <div
      className={`
    flex items-center py-5 border-b gap-4 transition
    ${isOverStock ? "bg-red-50" : ""}
    hover:bg-gray-50 hover:shadow-sm
  `}
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
          <span
            className={`inline-block mt-1 px-2 py-0.5 rounded-full text-xs font-medium
      ${
        available === 0
          ? "bg-red-100 text-red-700"
          : isOverStock
          ? "bg-yellow-100 text-yellow-700"
          : "bg-green-100 text-green-700"
      }
    `}
          >
            {available === 0
              ? "Hết hàng"
              : isOverStock
              ? "Vượt số lượng hàng có sẵn"
              : `Còn ${available}`}
          </span>
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
            onClick={() => {
              if (available !== Infinity && item.quantity >= available) {
                toast.error("Không thể tăng quá số lượng có sẵn hiện tại");
                return;
              }
              onIncrease();
            }}
            className="w-7 h-7 flex items-center justify-center border rounded transition hover:bg-gray-100"
            title="Tăng số lượng"
          >
            <Plus size={14} />
          </button>
        </div>
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
