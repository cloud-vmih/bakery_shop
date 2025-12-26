import { useEffect, useState, FormEvent } from "react";
import toast from "react-hot-toast";
import {
  getAllItemsDiscount,
  getItemsDiscount,  // ← Thêm import cho GET one
  createItemsDiscount,
  updateItemsDiscount,
  deleteItemsDiscount,
  ItemsDiscount,
  ItemsDiscountPayload,
} from "../services/itemsDiscount.service";
import { getMenu } from "../services/menu.service";
import {
  getAllMembershipDiscounts,
  createMembershipDiscount,
  updateMembershipDiscount,
  deleteMembershipDiscount,
  MembershipDiscount,
} from "../services/membershipDiscount.service";  // Service mới từ trước


export default function ItemsDiscountPage() {  // ← Giả sử rename từ PromotionPage
  const formatDateForInput = (date?: string | Date) => {
  if (!date) return "";
  const d = new Date(date);
  if (isNaN(d.getTime())) return "";
  return d.toISOString().slice(0, 10); // yyyy-mm-dd
};

  const formatDate = (dateStr?: string) => {
  if (!dateStr) return "Không giới hạn";
  const date = new Date(dateStr);
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};


  const [activeTab, setActiveTab] = useState<'product' | 'member'>('product');  // Tab state
  const [items, setItems] = useState<any[]>([]);

  // State chung cho selected item (áp dụng cho cả 2 tab)
  const [selectedItemId, setSelectedItemId] = useState<string>("");

  // State cho Product Discount (giữ nguyên, bỏ itemId)
  const [productDiscounts, setProductDiscounts] = useState<ItemsDiscount[]>([]);
  const [isEditingProduct, setIsEditingProduct] = useState(false);
  const [productForm, setProductForm] = useState({
    id: "",
    // itemId: "",  // ← XÓA: Giờ dùng selectedItemId chung
    title: "",
    discountAmount: 0,
    startAt: "",
    endAt: "",
  });
  const [productError, setProductError] = useState<{ [key: string]: string }>({});  // Validation errors

  // ← Thêm state cho modal detail
  const [selectedDiscount, setSelectedDiscount] = useState<ItemsDiscount | null>(null);
  const [showModal, setShowModal] = useState(false);

  // State cho Member Discount (bỏ itemId và code)
  const [memberDiscounts, setMemberDiscounts] = useState<MembershipDiscount[]>([]);
  const [isEditingMember, setIsEditingMember] = useState(false);
  const [memberForm, setMemberForm] = useState({
    id: 0,
    // code: "",  // ← XÓA: Bỏ code hoàn toàn
    title: "",
    discountAmount: 0,
    minPoints: 0,
    // itemId: "",  // ← XÓA: Giờ dùng selectedItemId chung
    startAt: "",
    endAt: "",
    isActive: true,
  });
  const [memberError, setMemberError] = useState<{ [key: string]: string }>({});

  // Reset selectedItemId khi switch tab
  useEffect(() => {
    setSelectedItemId("");
  }, [activeTab]);

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

  const validateForm = (form: any, type: 'product' | 'member') => {
    const errors: { [key: string]: string } = {};
    if (!form.title?.trim()) {
      errors.title = "Tiêu đề bắt buộc";
    }
    if (form.discountAmount > 100 || form.discountAmount < 0) {
      errors.discountAmount = "% giảm phải từ 0-100";
    }

    // ← Fix: Parse ISO safe (input date luôn yyyy-mm-dd)
    const now = new Date();
    now.setHours(0, 0, 0, 0);  // Ignore time

    if (form.startAt) {
      const start = new Date(form.startAt + 'T00:00:00');  // Force date only
      if (start < now) {
        errors.startAt = "Ngày bắt đầu >= hiện tại";
      }
    }
    if (form.endAt && form.startAt) {
      const end = new Date(form.endAt + 'T00:00:00');
      const start = new Date(form.startAt + 'T00:00:00');
      if (end <= start) {
        errors.endAt = "Ngày kết thúc > bắt đầu";
      }
    }
    // Validation cho member (bỏ code, chỉ giữ minPoints)
    if (type === 'member') {
      // if (!form.code?.trim()) { errors.code = "Mã code bắt buộc"; }  // ← XÓA: Bỏ validation code
      if (form.minPoints < 0) {
        errors.minPoints = "Điểm tối thiểu >= 0";
      }
    }
    return errors;
  };

  // Handle Product Submit (giữ nguyên, thêm validation, dùng selectedItemId)
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
      if (!selectedItemId) return toast.error("Vui lòng chọn sản phẩm");  // ← DÙNG selectedItemId
      const payload: ItemsDiscountPayload = {
        itemId: Number(selectedItemId),  // ← DÙNG selectedItemId
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
      setProductForm({ id: "", title: "", discountAmount: 0, startAt: "", endAt: "" });  // ← Bỏ itemId
      setIsEditingProduct(false);
      getAllItemsDiscount().then(setProductDiscounts);  // Reload
    } catch (err: any) {
      toast.error(err.message || "Tạo discount thất bại");
    }
  };

  // Handle Member Submit (mới, dùng selectedItemId optional, bỏ code)
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
        // code: memberForm.code,  // ← XÓA: Bỏ code
        title: memberForm.title,
        discountAmount: Number(memberForm.discountAmount),
        minPoints: Number(memberForm.minPoints),
        itemId: selectedItemId ? Number(selectedItemId) : undefined,  // ← THÊM: Optional, undefined = áp dụng toàn bộ
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
      setMemberForm(prev => ({ 
  ...prev, 
  id: 0, 
  title: "", 
  discountAmount: 0, 
  minPoints: 0, 
  // giữ nguyên startAt và endAt
  isActive: true 
}));

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
    title: discount.title || "",
    discountAmount: discount.discountAmount || 0,
    startAt: formatDateForInput(discount.startAt), // ← giữ nguyên nếu có
    endAt: formatDateForInput(discount.endAt),     // ← giữ nguyên nếu có
  });
  setSelectedItemId(discount.itemId.toString());
};


  // ← Thêm hàm view detail (modal)
  const viewProductDetail = async (discount: ItemsDiscount) => {
    try {
      const detail = await getItemsDiscount(discount.id);  // Gọi GET one
      setSelectedDiscount(detail);
      setShowModal(true);
    } catch (err: any) {
      toast.error("Không tải được chi tiết");
    }
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
    title: discount.title,
    discountAmount: discount.discountAmount || 0,
    minPoints: discount.minPoints || 0,
    startAt: formatDateForInput(discount.startAt), // ← giữ nguyên
    endAt: formatDateForInput(discount.endAt),     // ← giữ nguyên
    isActive: discount.isActive,
  });
  setSelectedItemId(discount.itemId?.toString() || "");
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
      className={`w-full p-2 rounded-lg border shadow-sm focus:ring-emerald-300 focus:border-emerald-500 ${error ? 'border-red-500' : 'border-gray-300'}`}
      type={type}
      value={value}
      onChange={onChange}
      required
    />
  );

  // ← Component chung cho grid chọn sản phẩm (inline để đơn giản)
  const ProductSelector = ({ selectedId, onSelect, title = "Chọn sản phẩm" }: { selectedId: string; onSelect: (id: string) => void; title?: string }) => (
    <>
      <h2 className="font-semibold mb-2">{title}</h2>
      <div className="grid grid-cols-2 gap-4 mb-4">
        {items.map((p) => (
          <div
            key={p.id}
            className={`p-3 border rounded cursor-pointer ${
              selectedId === String(p.id) ? "border-cyan-600 bg-cyan-50" : "border-gray-300"
            }`}
            onClick={() => onSelect(String(p.id))}
          >
            {p.name}
          </div>
        ))}
      </div>
    </>
  );

  // ← JSX Modal Detail (render nếu showModal)
  const DetailModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
        <h3 className="text-xl font-bold mb-4">Chi Tiết Giảm Giá</h3>
        {selectedDiscount && (
          <div className="space-y-2">
            <p><strong>ID:</strong> {selectedDiscount.id}</p>
            <p><strong>Sản phẩm ID:</strong> {selectedDiscount.itemId}</p>
            <p><strong>Tiêu đề:</strong> {selectedDiscount.title}</p>
            <p><strong>% Giảm:</strong> {selectedDiscount.discountAmount}%</p>
            <p><strong>Bắt đầu:</strong> {formatDate(selectedDiscount.startAt)}</p>
<p><strong>Kết thúc:</strong> {formatDate(selectedDiscount.endAt)}</p>

          </div>
        )}
        <button
          className="auth-btn mt-4"
          onClick={() => setShowModal(false)}
        >
          Đóng
        </button>
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <h1 className="text-3xl font-bold mb-6 text-emerald-800 text-center">Quản lý Khuyến mãi</h1>

      {/* Tabs */}
      <div className="flex space-x-4 mb-6 justify-center">
        <button
          onClick={() => setActiveTab('product')}
          className={`px-4 py-2 rounded-full font-medium transition ${
            activeTab === 'product' ? 'bg-emerald-600 text-white shadow-md' : 'bg-gray-200 text-gray-700'
          }`}
        >
          Discount Sản phẩm
        </button>
        <button
          onClick={() => setActiveTab('member')}
          className={`px-4 py-2 rounded-full font-medium transition ${
            activeTab === 'member' ? 'bg-emerald-600 text-white shadow-md' : 'bg-gray-200 text-gray-700'
          }`}
        >
          Chương trình Thành viên
        </button>
      </div>

      {/* Tab Product Discount */}
      {activeTab === 'product' && (
        <>
          <div className="bg-gradient-to-r from-emerald-50 to-green-50 p-6 rounded-2xl shadow-lg mb-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-4 text-center">{isEditingProduct ? "Chỉnh sửa giảm giá" : "Tạo giảm giá mới"}</h2>

            <ProductSelector selectedId={selectedItemId} onSelect={setSelectedItemId} title="Chọn sản phẩm" />

            <form onSubmit={handleProductSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Tên giảm giá</label>
                {renderInput("title", "", productForm.title, (e) => setProductForm({ ...productForm, title: e.target.value }), "text", productError.title)}
                {productError.title && <p className="text-red-500 text-sm">{productError.title}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">% Giảm (0-100)</label>
                {renderInput("discountAmount", "", productForm.discountAmount, (e) => setProductForm({ ...productForm, discountAmount: Number(e.target.value) }), "number", productError.discountAmount)}
                {productError.discountAmount && <p className="text-red-500 text-sm">{productError.discountAmount}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Ngày bắt đầu</label>
                {renderInput("startAt", "", productForm.startAt, (e) => setProductForm({ ...productForm, startAt: e.target.value }), "date", productError.startAt)}
                {productError.startAt && <p className="text-red-500 text-sm">{productError.startAt}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Ngày kết thúc</label>
                {renderInput("endAt", "", productForm.endAt, (e) => setProductForm({ ...productForm, endAt: e.target.value }), "date", productError.endAt)}
                {productError.endAt && <p className="text-red-500 text-sm">{productError.endAt}</p>}
              </div>

              <button type="submit" className="w-full bg-emerald-600 text-white font-semibold py-2 rounded-lg shadow hover:bg-emerald-700 transition">
                {isEditingProduct ? "Lưu thay đổi" : "Tạo giảm giá"}
              </button>
            </form>
          </div>

          <h2 className="text-2xl font-semibold mb-4">Danh sách giảm giá sản phẩm</h2>
          {productDiscounts.length === 0 ? <p className="text-gray-500">Chưa có giảm giá nào</p> :
            <div className="space-y-4">
              {productDiscounts.map((d) => {
                const product = items.find((p) => p.id === d.itemId);
                return (
                  <div key={d.id} className="bg-white p-4 rounded-2xl shadow hover:shadow-md transition flex justify-between items-center">
                    <div>
                      <p className="font-semibold text-gray-800">{d.title} — {product?.name || "(Không xác định)"} — Giảm {d.discountAmount}%</p>
                      <p className="text-sm text-gray-500">Từ {formatDate(d.startAt)} đến {formatDate(d.endAt)}</p>
                    </div>
                    <div className="flex gap-2">
                      <button className="px-3 py-1 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition" onClick={() => editProductDiscount(d)}>Sửa</button>
                      <button className="px-3 py-1 rounded-lg bg-cyan-500 text-white hover:bg-cyan-600 transition" onClick={() => viewProductDetail(d)}>Chi tiết</button>
                      <button className="px-3 py-1 rounded-lg bg-red-500 text-white hover:bg-red-600 transition" onClick={() => removeProductDiscount(d.id)}>Xóa</button>
                    </div>
                  </div>
                );
              })}
            </div>
          }
        </>
      )}

      {/* Tab Member Discount */}
      {activeTab === 'member' && (
        <>
          <div className="bg-gradient-to-r from-emerald-50 to-green-50 p-6 rounded-2xl shadow-lg mb-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-4 text-center">{isEditingMember ? "Chỉnh sửa chương trình" : "Tạo chương trình mới"}</h2>

            <ProductSelector selectedId={selectedItemId} onSelect={setSelectedItemId} title="Chọn sản phẩm áp dụng (để trống = toàn bộ)" />

            <form onSubmit={handleMemberSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Tiêu đề ưu đãi</label>
                {renderInput("title", "", memberForm.title, (e) => setMemberForm({ ...memberForm, title: e.target.value }), "text", memberError.title)}
                {memberError.title && <p className="text-red-500 text-sm">{memberError.title}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">% Giảm (0-100)</label>
                {renderInput("discountAmount", "", memberForm.discountAmount, (e) => setMemberForm({ ...memberForm, discountAmount: Number(e.target.value) }), "number", memberError.discountAmount)}
                {memberError.discountAmount && <p className="text-red-500 text-sm">{memberError.discountAmount}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Điểm tối thiểu</label>
                {renderInput("minPoints", "", memberForm.minPoints, (e) => setMemberForm({ ...memberForm, minPoints: Number(e.target.value) }), "number", memberError.minPoints)}
                {memberError.minPoints && <p className="text-red-500 text-sm">{memberError.minPoints}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Ngày bắt đầu</label>
                {renderInput("startAt", "", memberForm.startAt, (e) => setMemberForm({ ...memberForm, startAt: e.target.value }), "date", memberError.startAt)}
                {memberError.startAt && <p className="text-red-500 text-sm">{memberError.startAt}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Ngày kết thúc</label>
                {renderInput("endAt", "", memberForm.endAt, (e) => setMemberForm({ ...memberForm, endAt: e.target.value }), "date", memberError.endAt)}
                {memberError.endAt && <p className="text-red-500 text-sm">{memberError.endAt}</p>}
              </div>

              <div className="flex items-center">
                <input
                  id="isActive"
                  type="checkbox"
                  checked={memberForm.isActive}
                  onChange={(e) => setMemberForm({ ...memberForm, isActive: e.target.checked })}
                  className="mr-2 h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                />
                <label htmlFor="isActive" className="text-sm font-medium">Hoạt động</label>
              </div>

              <button type="submit" className="w-full bg-emerald-600 text-white font-semibold py-2 rounded-lg shadow hover:bg-emerald-700 transition">
                {isEditingMember ? "Lưu thay đổi" : "Tạo chương trình thành viên"}
              </button>
            </form>
          </div>

          <h2 className="text-2xl font-semibold mb-4">Danh sách chương trình thành viên</h2>
          {memberDiscounts.length === 0 ? <p className="text-gray-500">Chưa có chương trình nào</p> :
            <div className="space-y-4">
              {memberDiscounts.map((d) => {
                const product = items.find((p) => p.id === (d.itemId || 0));
                return (
                  <div key={d.id} className="bg-white p-4 rounded-2xl shadow hover:shadow-md transition flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-bold mb-1">{d.title}</h3>
                      <p className="text-sm text-gray-600 mb-1">{product ? `Áp dụng: ${product.name}` : "Áp dụng: Toàn bộ sản phẩm"}</p>
                      <p className="text-sm mb-1">Giảm <span className="font-semibold">{d.discountAmount}%</span> | Điểm tối thiểu: <span className="font-semibold">{d.minPoints}</span></p>
                      <p className="text-sm">Từ {formatDate(d.startAt)} đến {formatDate(d.endAt)} - Trạng thái: {d.isActive ? 'Hoạt động' : 'Tắt'}</p>
                    </div>
                    <div className="flex flex-col gap-2 ml-4">
                      <button className="px-3 py-1 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition" onClick={() => editMemberDiscount(d)}>Sửa</button>
                      <button className="px-3 py-1 rounded-lg bg-red-500 text-white hover:bg-red-600 transition" onClick={() => removeMemberDiscount(d.id)}>Xóa</button>
                    </div>
                  </div>
                );
              })}
            </div>
          }
        </>
      )}

      {showModal && selectedDiscount && <DetailModal />}
    </div>
  );
}