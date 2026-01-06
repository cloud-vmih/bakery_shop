interface Props {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmRemoveModal({
  open,
  onConfirm,
  onCancel,
}: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-[360px] shadow-xl">
        <h3 className="text-lg font-bold text-red-600 mb-2">
          Xác nhận xoá sản phẩm
        </h3>

        <p className="text-gray-600 mb-6">
          Bạn có chắc chắn muốn xoá sản phẩm này khỏi giỏ hàng không?
        </p>

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 border py-2 rounded-lg hover:bg-gray-50"
          >
            Huỷ
          </button>

          <button
            onClick={onConfirm}
            className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700"
          >
            Xoá
          </button>
        </div>
      </div>
    </div>
  );
}
