// // src/components/CartItem.tsx
import { Minus, Plus, X } from "lucide-react";

export default function CartItem({
  item,
  checked,
  onToggle,
  onIncrease,
  onDecrease,
  onRemove,
}: any) {
  const totalPrice = item.item.price * item.quantity;

  return (
    <div className="flex items-center py-5 border-b gap-4">
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

        {/* QUANTITY CONTROL */}
        <div className="flex items-center gap-2 mt-2">
          <button
            onClick={onDecrease}
            className="w-7 h-7 flex items-center justify-center border rounded hover:bg-gray-100"
          >
            <Minus size={14} />
          </button>

          <span className="w-8 text-center text-sm font-medium">
            {item.quantity}
          </span>

          <button
            onClick={onIncrease}
            className="w-7 h-7 flex items-center justify-center border rounded hover:bg-gray-100"
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
