import { useEffect, useState, FormEvent } from "react";
import toast from "react-hot-toast";
import {
  getAllItemsDiscount,
  createItemsDiscount,
  updateItemsDiscount,
  deleteItemsDiscount,
  ItemsDiscount,
} from "../services/itemsDiscount.service";

export default function ItemsDiscountPage() {
  // =======================
  // DATA SẢN PHẨM MẪU
  // =======================
  const [products] = useState([
    { id: 1, name: "Trà Sữa Matcha" },
    { id: 2, name: "Trà Sữa Socola" },
    { id: 3, name: "Trà Sữa Đậu Đỏ" },
    { id: 4, name: "Trà Sữa Trân Châu" },
  ]);

  // =======================
  // STATE DISCOUNT
  // =======================
  const [discounts, setDiscounts] = useState<ItemsDiscount[]>([]);
  const [isEditing, setIsEditing] = useState(false);

  const [form, setForm] = useState({
    id: "", 
    itemId: "", 
    title: "",
    discountAmount: "",
    startAt: "",
    endAt: "",
  });

  // =======================
  // LOAD DISCOUNTS
  // =======================
  const loadDiscounts = async () => {
    try {
      const res = await getAllItemsDiscount();
      setDiscounts(res);
    } catch (err: any) {
      toast.error("Không thể tải danh sách giảm giá");
    }
  };

  useEffect(() => {
    loadDiscounts();
  }, []);

  // =======================
  // HANDLE SUBMIT
  // =======================
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      if (!form.itemId) return toast.error("Vui lòng chọn sản phẩm");

      if (isEditing) {
        await updateItemsDiscount(Number(form.id), form as any);
        toast.success("Cập nhật giảm giá thành công!");
      } else {
        await createItemsDiscount(form as any);
        toast.success("Tạo giảm giá thành công!");
      }

      setForm({ id: "", itemId: "", title: "", discountAmount: "", startAt: "", endAt: "" });
      setIsEditing(false);
      loadDiscounts();
    } catch (err: any) {
      toast.error(err.message || "Tạo discount thất bại");
    }
  };

  // =======================
  // EDIT DISCOUNT
  // =======================
  const editDiscount = (discount: any) => {
    setIsEditing(true);
    setForm({
      id: discount.id,
      itemId: discount.itemId,
      title: discount.title,
      discountAmount: discount.discountAmount,
      startAt: discount.startAt,
      endAt: discount.endAt,
    });
  };

  // =======================
  // DELETE DISCOUNT
  // =======================
  const removeDiscount = async (id: number) => {
    if (!window.confirm("Bạn chắc chắn muốn xóa?")) return;
    await deleteItemsDiscount(id);
    toast.success("Xóa thành công!");
    loadDiscounts();
  };

  return (
    <div style={{ padding: 20, maxWidth: 800, margin: "0 auto" }}>
      <h1 className="text-2xl font-bold mb-4">Quản lý giảm giá sản phẩm</h1>

      {/* =======================
          CHỌN SẢN PHẨM BẰNG CLICK
      ======================= */}
      <h2 className="font-semibold mb-2">Chọn sản phẩm</h2>
      <div className="grid grid-cols-2 gap-4 mb-4">
        {products.map((p) => (
          <div
            key={p.id}
            className={`p-3 border rounded cursor-pointer ${
              form.itemId === String(p.id) ? "border-cyan-600 bg-cyan-50" : "border-gray-300"
            }`}
            onClick={() => setForm({ ...form, itemId: String(p.id) })}
          >
            {p.name}
          </div>
        ))}
      </div>

      {/* =======================
          FORM CREATE / EDIT
      ======================= */}
      <form onSubmit={handleSubmit} className="space-y-3 mb-6">
        <input
          placeholder="Tên giảm giá"
          className="input-box"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          required
        />
        <input
          placeholder="Số tiền giảm (%)"
          className="input-box"
          type="number"
          value={form.discountAmount}
          onChange={(e) => setForm({ ...form, discountAmount: e.target.value })}
          required
        />
        <input
          type="date"
          className="input-box"
          value={form.startAt}
          onChange={(e) => setForm({ ...form, startAt: e.target.value })}
          required
        />
        <input
          type="date"
          className="input-box"
          value={form.endAt}
          onChange={(e) => setForm({ ...form, endAt: e.target.value })}
          required
        />
        <button type="submit" className="auth-btn">
          {isEditing ? "Lưu thay đổi" : "Tạo giảm giá"}
        </button>
      </form>

      {/* =======================
          DANH SÁCH DISCOUNT
      ======================= */}
      <h2 className="text-xl font-semibold mt-4 mb-2">Danh sách giảm giá</h2>
      {discounts.length === 0 && <p>Chưa có giảm giá nào</p>}
      {discounts.map((d: any) => {
        const product = products.find((p) => p.id === Number(d.itemId));
        return (
          <div
            key={d.id}
            className="flex justify-between items-center bg-gray-100 p-3 mb-2 rounded"
          >
            <div>
              <p>
                <b>{d.title}</b> — {product?.name || "Unknown"} — Giảm {d.discountAmount}%
              </p>
              <p>
                Từ {d.startAt} đến {d.endAt}
              </p>
            </div>
            <div className="flex gap-2">
              <button className="auth-btn" onClick={() => editDiscount(d)}>
                Sửa
              </button>
              <button
                className="auth-btn"
                style={{ backgroundColor: "#d9534f" }}
                onClick={() => removeDiscount(d.id)}
              >
                Xóa
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
