import { useEffect, useState, FormEvent } from "react";
import toast from "react-hot-toast";
import {
  getAllItemsDiscount,
  createItemsDiscount,
  updateItemsDiscount,
  deleteItemsDiscount,
  ItemsDiscount,
  ItemsDiscountPayload,
} from "../services/itemsDiscount.services";
import { getMenu } from "../services/menu.services";
import {
  getAllMembershipDiscounts,
  createMembershipDiscount,
  updateMembershipDiscount,
  deleteMembershipDiscount,
  MembershipDiscount,
} from "../services/membershipDiscount.services";  // Service mới từ trước


export default function PromotionPage() {
  const [activeTab, setActiveTab] = useState<'product' | 'member'>('product');  // Tab state
  const [items, setItems] = useState<any[]>([]);

  // State cho Product Discount (giữ nguyên)
  const [productDiscounts, setProductDiscounts] = useState<ItemsDiscount[]>([]);
  const [isEditingProduct, setIsEditingProduct] = useState(false);
  const [productForm, setProductForm] = useState({
    id: "",
    itemId: "",
    title: "",
    discountAmount: 0,
    startAt: "",
    endAt: "",
  });
  const [productError, setProductError] = useState<{ [key: string]: string }>({});  // Validation errors

  // State cho Member Discount
  const [memberDiscounts, setMemberDiscounts] = useState<MembershipDiscount[]>([]);
  const [isEditingMember, setIsEditingMember] = useState(false);
  const [memberForm, setMemberForm] = useState({
    id: 0,
    code: "",
    title: "",
    discountAmount: 0,
    minPoints: 0,
    startAt: "",
    endAt: "",
    isActive: true,
  });
  const [memberError, setMemberError] = useState<{ [key: string]: string }>({});

  // Load data chung
  useEffect(() => {
    const loadAll = async () => {
      try {
        const [itemsRes, productDiscountsRes, memberDiscountsRes] = await Promise.all([
          getMenu(),
          getAllItemsDiscount(),
          getAllMembershipDiscounts(),
        ]);
        setItems(itemsRes);
        setProductDiscounts(productDiscountsRes);
        setMemberDiscounts(memberDiscountsRes);
      } catch (err: any) {
        toast.error("Không tải được dữ liệu khuyến mãi");
      }
    };
    loadAll();
  }, []);

  // Validation chung (trả về errors object)
  const validateForm = (form: any, type: 'product' | 'member') => {
    const errors: { [key: string]: string } = {};
    if (form.discountAmount > 100 || form.discountAmount < 0) {
      errors.discountAmount = "% giảm phải từ 0-100";
    }
    if (form.startAt && new Date(form.startAt) < new Date()) {
      errors.startAt = "Ngày bắt đầu >= hiện tại";
    }
    if (form.endAt && form.startAt && new Date(form.endAt) <= new Date(form.startAt)) {
      errors.endAt = "Ngày kết thúc > bắt đầu";
    }
    if (type === 'member' && form.minPoints <= 0) {
      errors.minPoints = "Điểm tối thiểu phải > 0";
    }
    if (type === 'member' && !form.code) {
      errors.code = "Mã code bắt buộc";
    }
    return errors;
  };

  // Handle Product Submit (giữ nguyên, thêm validation)
  const handleProductSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const errors = validateForm(productForm, 'product');
    if (Object.keys(errors).length > 0) {
      setProductError(errors);
      toast.error("Vui lòng sửa lỗi form");
      return;
    }
    setProductError({});
    try {
      if (!productForm.itemId) return toast.error("Vui lòng chọn sản phẩm");
      const payload: ItemsDiscountPayload = {
  itemId: Number(productForm.itemId),
  title: productForm.title,
  discountAmount: Number(productForm.discountAmount),
  startAt: productForm.startAt || undefined,
  endAt: productForm.endAt || undefined,
};

      if (isEditingProduct) {
        await updateItemsDiscount(Number(productForm.id), payload);
        toast.success("Cập nhật giảm giá sản phẩm thành công!");
      } else {
        await createItemsDiscount(payload);
        toast.success("Tạo giảm giá sản phẩm thành công!");
      }
      setProductForm({ id: "", itemId: "", title: "", discountAmount: 0, startAt: "", endAt: "" });
      setIsEditingProduct(false);
      getAllItemsDiscount().then(setProductDiscounts);  // Reload
    } catch (err: any) {
      toast.error(err.message || "Tạo discount thất bại");
    }
  };

  // Handle Member Submit (mới)
  const handleMemberSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const errors = validateForm(memberForm, 'member');
    if (Object.keys(errors).length > 0) {
      setMemberError(errors);
      toast.error("Vui lòng sửa lỗi form");
      return;
    }
    setMemberError({});
    try {
      const payload = {
        code: memberForm.code,
        title: memberForm.title,
        discountAmount: Number(memberForm.discountAmount),
        minPoints: Number(memberForm.minPoints),
        startAt: memberForm.startAt || undefined,
        endAt: memberForm.endAt || undefined,
        isActive: memberForm.isActive,
      };
      if (isEditingMember) {
        await updateMembershipDiscount(memberForm.id, payload);
        toast.success("Cập nhật chương trình thành viên thành công!");
      } else {
        await createMembershipDiscount(payload);
        toast.success("Tạo chương trình thành viên thành công!");
      }
      setMemberForm({ id: 0, code: "", title: "", discountAmount: 0, minPoints: 0, startAt: "", endAt: "", isActive: true });
      setIsEditingMember(false);
      getAllMembershipDiscounts().then(setMemberDiscounts);  // Reload
    } catch (err: any) {
      toast.error(err.message || "Tạo chương trình thành viên thất bại");  // Handle mã duplicate từ backend
    }
  };

  // Edit/Delete functions (tương tự cho member)
  const editProductDiscount = (discount: ItemsDiscount) => {
    setIsEditingProduct(true);
    setProductForm({
      id: discount.id.toString(),
      itemId: discount.itemId.toString(),
      title: discount.title || "",
      discountAmount: discount.discountAmount || 0,
      startAt: discount.startAt || "",
      endAt: discount.endAt || "",
    });
  };

  const removeProductDiscount = async (id: number) => {
    if (!window.confirm("Bạn chắc chắn muốn xóa?")) return;
    await deleteItemsDiscount(id);
    toast.success("Xóa thành công!");
    getAllItemsDiscount().then(setProductDiscounts);
  };

  const editMemberDiscount = (discount: MembershipDiscount) => {
    setIsEditingMember(true);
    setMemberForm({
      id: discount.id,
      code: discount.code,
      title: discount.title,
      discountAmount: discount.discountAmount || 0,
      minPoints: discount.minPoints || 0,
      startAt: discount.startAt || "",
      endAt: discount.endAt || "",
      isActive: discount.isActive,
    });
  };

  const removeMemberDiscount = async (id: number) => {
    if (!window.confirm("Bạn chắc chắn muốn xóa?")) return;
    await deleteMembershipDiscount(id);
    toast.success("Xóa thành công!");
    getAllMembershipDiscounts().then(setMemberDiscounts);
  };

  // Render input với error highlight
  const renderInput = (field: string, placeholder: string, value: any, onChange: (e: any) => void, type = "text", error?: string) => (
    <input
      placeholder={placeholder}
      className={`input-box ${error ? 'border-red-500' : ''}`}  // Highlight đỏ nếu lỗi
      type={type}
      value={value}
      onChange={onChange}
      required
    />
  );

  return (
    <div style={{ padding: 20, maxWidth: 800, margin: "0 auto" }}>
      <h1 className="text-2xl font-bold mb-4">Quản lý Khuyến mãi</h1>

      {/* Tabs */}
      <div className="flex space-x-4 mb-6">
        <button
          onClick={() => setActiveTab('product')}
          className={`p-2 rounded ${activeTab === 'product' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        >
          Discount Sản phẩm
        </button>
        <button
          onClick={() => setActiveTab('member')}
          className={`p-2 rounded ${activeTab === 'member' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        >
          Chương trình Thành viên
        </button>
      </div>

      {/* Tab Product Discount */}
      {activeTab === 'product' && (
        <>
          <h2 className="font-semibold mb-2">Chọn sản phẩm</h2>
          <div className="grid grid-cols-2 gap-4 mb-4">
            {items.map((p) => (
              <div
                key={p.id}
                className={`p-3 border rounded cursor-pointer ${
                  productForm.itemId === String(p.id) ? "border-cyan-600 bg-cyan-50" : "border-gray-300"
                }`}
                onClick={() => setProductForm({ ...productForm, itemId: String(p.id) })}
              >
                {p.name}
              </div>
            ))}
          </div>

          <form onSubmit={handleProductSubmit} className="space-y-3 mb-6">
            {renderInput("title", "Tên giảm giá", productForm.title, (e) => setProductForm({ ...productForm, title: e.target.value }), "text", productError.title)}
            {productError.discountAmount && <p className="text-red-500 text-sm">{productError.discountAmount}</p>}
            {renderInput("discountAmount", "Số tiền giảm (%)", productForm.discountAmount, (e) => setProductForm({ ...productForm, discountAmount: Number(e.target.value) }), "number", productError.discountAmount)}
            {renderInput("startAt", "", productForm.startAt, (e) => setProductForm({ ...productForm, startAt: e.target.value }), "date", productError.startAt)}
            {productError.endAt && <p className="text-red-500 text-sm">{productError.endAt}</p>}
            {renderInput("endAt", "", productForm.endAt, (e) => setProductForm({ ...productForm, endAt: e.target.value }), "date", productError.endAt)}
            <button type="submit" className="auth-btn" disabled={Object.keys(productError).length > 0}>
              {isEditingProduct ? "Lưu thay đổi" : "Tạo giảm giá"}
            </button>
          </form>

          <h2 className="text-xl font-semibold mt-4 mb-2">Danh sách giảm giá sản phẩm</h2>
          {productDiscounts.length === 0 && <p>Chưa có giảm giá nào</p>}
          {productDiscounts.map((d) => {
            const product = items.find((p) => p.id === d.itemId);
            return (
              <div key={d.id} className="flex justify-between items-center bg-gray-100 p-3 mb-2 rounded">
                <div>
                  <p><b>{d.title}</b> — {product?.name || "Unknown"} — Giảm {d.discountAmount}%</p>
                  <p>Từ {d.startAt} đến {d.endAt}</p>
                </div>
                <div className="flex gap-2">
                  <button className="auth-btn" onClick={() => editProductDiscount(d)}>Sửa</button>
                  <button className="auth-btn" style={{ backgroundColor: "#d9534f" }} onClick={() => removeProductDiscount(d.id)}>Xóa</button>
                </div>
              </div>
            );
          })}
        </>
      )}

      {/* Tab Member Discount */}
      {activeTab === 'member' && (
        <>
          <form onSubmit={handleMemberSubmit} className="space-y-3 mb-6">
            {renderInput("code", "Mã code (unique)", memberForm.code, (e) => setMemberForm({ ...memberForm, code: e.target.value }), "text", memberError.code)}
            {renderInput("title", "Tiêu đề ưu đãi", memberForm.title, (e) => setMemberForm({ ...memberForm, title: e.target.value }), "text", memberError.title)}
            {memberError.discountAmount && <p className="text-red-500 text-sm">{memberError.discountAmount}</p>}
            {renderInput("discountAmount", "% Giảm (0-100)", memberForm.discountAmount, (e) => setMemberForm({ ...memberForm, discountAmount: Number(e.target.value) }), "number", memberError.discountAmount)}
            {memberError.minPoints && <p className="text-red-500 text-sm">{memberError.minPoints}</p>}
            {renderInput("minPoints", "Điểm tối thiểu", memberForm.minPoints, (e) => setMemberForm({ ...memberForm, minPoints: Number(e.target.value) }), "number", memberError.minPoints)}
            {renderInput("startAt", "", memberForm.startAt, (e) => setMemberForm({ ...memberForm, startAt: e.target.value }), "date", memberError.startAt)}
            {memberError.endAt && <p className="text-red-500 text-sm">{memberError.endAt}</p>}
            {renderInput("endAt", "", memberForm.endAt, (e) => setMemberForm({ ...memberForm, endAt: e.target.value }), "date", memberError.endAt)}
            <button type="submit" className="auth-btn" disabled={Object.keys(memberError).length > 0}>
              {isEditingMember ? "Lưu thay đổi" : "Tạo chương trình thành viên"}
            </button>
          </form>

          <h2 className="text-xl font-semibold mt-4 mb-2">Danh sách chương trình thành viên</h2>
          {memberDiscounts.length === 0 && <p>Chưa có chương trình nào</p>}
          {memberDiscounts.map((d) => (
            <div key={d.id} className="flex justify-between items-center bg-gray-100 p-3 mb-2 rounded">
              <div>
                <p><b>{d.title}</b> - Mã: {d.code} - Giảm {d.discountAmount}% (từ {d.minPoints} points)</p>
                <p>Từ {d.startAt} đến {d.endAt} - Trạng thái: {d.isActive ? 'Hoạt động' : 'Tắt'}</p>
              </div>
              <div className="flex gap-2">
                <button className="auth-btn" onClick={() => editMemberDiscount(d)}>Sửa</button>
                <button className="auth-btn" style={{ backgroundColor: "#d9534f" }} onClick={() => removeMemberDiscount(d.id)}>Xóa</button>
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  );
}