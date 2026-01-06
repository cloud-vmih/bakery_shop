import { useEffect, useState } from "react";
import {
  XMarkIcon,
  MapPinIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/solid";
import toast from "react-hot-toast";
import { getBranches } from "../services/branch.service";

type Branch = {
  id: number;
  name: string;
  address?: {
    fullAddress?: string;
  };
};

interface BranchSelectModalProps {
  open: boolean;
  onClose: () => void;
  onSelect: (branchId: number) => void;
}

export default function BranchSelectModal({
  open,
  onClose,
  onSelect,
}: BranchSelectModalProps) {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  useEffect(() => {
    if (!open) return;

    const loadBranches = async () => {
      setLoading(true);
      try {
        const data = await getBranches();
        setBranches(data);
      } catch {
        toast.error("Không thể tải danh sách chi nhánh");
      } finally {
        setLoading(false);
      }
    };

    loadBranches();
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl animate-scaleIn">
        {/* Header */}
        <div className="flex items-start justify-between px-6 py-5 border-b">
          <div>
            <h3 className="text-xl font-bold text-emerald-700 flex items-center gap-2">
              <MapPinIcon className="w-6 h-6" />
              Chọn chi nhánh giao hàng
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              Tồn kho và phí giao hàng phụ thuộc vào chi nhánh
            </p>
          </div>

          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-4">
          {loading ? (
            <div className="py-12 text-center text-gray-500">
              Đang tải danh sách chi nhánh…
            </div>
          ) : (
            <div className="space-y-3 max-h-[360px] overflow-y-auto pr-1">
              {branches.map((branch) => {
                const active = selectedId === branch.id;

                return (
                  <button
                    key={branch.id}
                    onClick={() => setSelectedId(branch.id)}
                    className={`
                      relative w-full text-left p-4 rounded-2xl border
                      transition-all duration-200
                      ${
                        active
                          ? "border-emerald-600 bg-emerald-50 shadow-sm"
                          : "border-gray-200 hover:border-emerald-400 hover:bg-gray-50"
                      }
                    `}
                  >
                    {/* Check icon */}
                    {active && (
                      <CheckCircleIcon
                        className="
    absolute right-4 top-1/2
    -translate-y-1/2
    w-6 h-6 text-emerald-600
  "
                      />
                    )}

                    <div className="font-semibold text-gray-800 text-base">
                      {branch.name}
                    </div>
                    <div className="text-sm text-gray-500 mt-1">
                      {branch.address?.fullAddress || "Chưa có địa chỉ"}
                    </div>
                  </button>
                );
              })}

              {branches.length === 0 && (
                <p className="text-center text-gray-500 py-6">
                  Không có chi nhánh nào
                </p>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 px-6 py-4 border-t bg-gray-50 rounded-b-3xl">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl border border-gray-300 text-gray-600 hover:bg-gray-100"
          >
            Hủy
          </button>

          <button
            disabled={selectedId === null}
            onClick={() => {
              if (!selectedId) {
                toast.error("Vui lòng chọn một chi nhánh");
                return;
              }
              onSelect(selectedId);
            }}
            className={`
              px-6 py-2 rounded-xl font-semibold transition
              ${
                selectedId === null
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-emerald-600 hover:bg-emerald-700 text-white shadow-md"
              }
            `}
          >
            Xác nhận chi nhánh
          </button>
        </div>
      </div>
    </div>
  );
}
