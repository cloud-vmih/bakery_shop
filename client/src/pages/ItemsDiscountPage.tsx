import { useEffect, useState, FormEvent } from "react";
import toast from "react-hot-toast";
import {
  getAllItemsDiscount,
  getItemsDiscount, 
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
} from "../services/membershipDiscount.service";
export default function ItemsDiscountPage() { 
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
  const [activeTab, setActiveTab] = useState<'product' | 'member'>('product'); // Tab state
  const [items, setItems] = useState<any[]>([]);
  const [selectedItemIds, setSelectedItemIds] = useState<string[]>([]);
  const [productDiscounts, setProductDiscounts] = useState<ItemsDiscount[]>([]);
  const [isEditingProduct, setIsEditingProduct] = useState(false);
  const [productForm, setProductForm] = useState({
    id: "",
    title: "",
    discountAmount: 0,
    startAt: "",
    endAt: "",
  });
  const [productError, setProductError] = useState<{ [key: string]: string }>({}); // Validation errors
  const [selectedDiscount, setSelectedDiscount] = useState<ItemsDiscount | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [memberDiscounts, setMemberDiscounts] = useState<MembershipDiscount[]>([]);
  const [isEditingMember, setIsEditingMember] = useState(false);
  const [memberForm, setMemberForm] = useState({
    id: 0,
    title: "",
    discountAmount: 0,
    minPoints: 0,
    startAt: "",
    endAt: "",
    isActive: true,
  });
  const [memberError, setMemberError] = useState<{ [key: string]: string }>({});
  useEffect(() => {
    setSelectedItemIds([]);
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
    if (type === 'product' && selectedItemIds.length === 0) {
      errors.items = "Vui lòng chọn ít nhất 1 sản phẩm";
    }
    const now = new Date();
    now.setHours(0, 0, 0, 0); 
    if (form.startAt) {
      const start = new Date(form.startAt + 'T00:00:00'); 
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
    if (type === 'member') {
      if (form.minPoints < 0) {
        errors.minPoints = "Điểm tối thiểu >= 0";
      }
    }
    return errors;
  };
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
      if (selectedItemIds.length === 0) return toast.error("Vui lòng chọn sản phẩm"); 
      const payload: ItemsDiscountPayload = {
        itemIds: selectedItemIds.map(id => Number(id)), 
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
      setProductForm({ id: "", title: "", discountAmount: 0, startAt: "", endAt: "" }); 
      setSelectedItemIds([]); 
      setIsEditingProduct(false);
      getAllItemsDiscount().then(setProductDiscounts);
    } catch (err: any) {
      toast.error(err.message || "Tạo discount thất bại");
    }
  };
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
        title: memberForm.title,
        discountAmount: Number(memberForm.discountAmount),
        minPoints: Number(memberForm.minPoints),
        itemIds: selectedItemIds.length > 0 ? selectedItemIds.map(id => Number(id)) : undefined, 
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
  startAt: "",
  endAt: "",
  isActive: true
}));
      setSelectedItemIds([]); 
      setIsEditingMember(false);
      getAllMembershipDiscounts().then(setMemberDiscounts);
    } catch (err: any) {
      toast.error(err.message || "Tạo chương trình thành viên thất bại"); 
    }
  };
  const editProductDiscount = (discount: ItemsDiscount) => {
  setIsEditingProduct(true);
  setProductForm({
    id: discount.id.toString(),
    title: discount.title || "",
    discountAmount: discount.discountAmount || 0,
    startAt: formatDateForInput(discount.startAt), 
    endAt: formatDateForInput(discount.endAt),
  });
  setSelectedItemIds(discount.itemIds ? discount.itemIds.map((id: number) => id.toString()) : []); 
};
  const viewProductDetail = async (discount: ItemsDiscount) => {
    try {
      const detail = await getItemsDiscount(discount.id); 
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
    startAt: formatDateForInput(discount.startAt),
    endAt: formatDateForInput(discount.endAt), 
    isActive: discount.isActive,
  });
  setSelectedItemIds(discount.itemIds ? discount.itemIds.map((id: number) => id.toString()) : []); 
};
  const removeMemberDiscount = async (id: number) => {
    if (!window.confirm("Bạn chắc chắn muốn xóa?")) return;
    await deleteMembershipDiscount(id);
    toast.success("Xóa thành công!");
    getAllMembershipDiscounts().then(setMemberDiscounts);
  };
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
  const ProductSelector = ({
  selectedIds,
  onSelectToggle,
  title = "Chọn sản phẩm",
}: {
  selectedIds: string[];
  onSelectToggle: (id: string) => void;
  title?: string;
}) => (
  <>
    <h2 className="font-semibold mb-2">{title}</h2>

    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
      {items.map((p) => {
        const isSelected = selectedIds.includes(String(p.id));

        return (
          <div
            key={p.id}
            onClick={() => onSelectToggle(String(p.id))}
            className={`
              cursor-pointer p-4 rounded-xl border transition
              ${
                isSelected
                  ? "border-emerald-500 bg-emerald-50 shadow-md"
                  : "border-gray-200 bg-white hover:bg-gray-50"
              }
            `}
          >
            <p
              className={`text-sm font-medium ${
                isSelected ? "text-emerald-700" : "text-gray-700"
              }`}
            >
              {p.name}
            </p>
          </div>
        );
      })}
    </div>
  </>
);

  const DetailModal = () => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
      <h3 className="text-xl font-bold mb-4">Chi Tiết Giảm Giá</h3>
      {selectedDiscount && (
        <div className="space-y-2">
          <p><strong>ID:</strong> {selectedDiscount.id}</p>
          <p><strong>Sản phẩm ID:</strong> {selectedDiscount.itemIds && selectedDiscount.itemIds.length > 0 ? selectedDiscount.itemIds.join(', ') : "Không xác định"}</p> 
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
    <div className="w-full min-h-screen p-6 bg-gray-50"> 
      {/* Header */}
      <div className="w-full mb-6"> 
        <h1 className="text-3xl font-bold text-emerald-800 text-center">Quản lý Khuyến mãi</h1>
      </div>
      {/* Tabs */}
      <div className="flex space-x-4 mb-6 justify-center w-full">
        <button
          onClick={() => setActiveTab('product')}
          className={`px-4 py-2 rounded-full font-medium transition ${
            activeTab === 'product' ? 'bg-emerald-600 text-white shadow-md' : 'bg-gray-200 text-gray-700'
          }`}
        >
          Khuyến Mãi Sản phẩm
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
          <div className="w-full bg-gradient-to-r from-emerald-50 to-green-50 p-6 rounded-2xl shadow-lg mb-6"> 
            <h2 className="text-xl font-semibold text-gray-700 mb-4 text-center">{isEditingProduct ? "Chỉnh sửa giảm giá" : "Tạo giảm giá mới"}</h2>
          
            <ProductSelector 
              selectedIds={selectedItemIds} 
              onSelectToggle={(id) => {
                setSelectedItemIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
              }} 
              title="Chọn sản phẩm (có thể chọn nhiều)" 
            />
            <form onSubmit={handleProductSubmit} className="space-y-4 w-full">
              <div className="w-full">
                <label className="block text-sm font-medium mb-1">Tên giảm giá</label>
                {renderInput("title", "", productForm.title, (e) => setProductForm({ ...productForm, title: e.target.value }), "text", productError.title)}
                {productError.title && <p className="text-red-500 text-sm">{productError.title}</p>}
              </div>
              <div className="w-full">
                <label className="block text-sm font-medium mb-1">% Giảm (0-100)</label>
                {renderInput("discountAmount", "", productForm.discountAmount, (e) => setProductForm({ ...productForm, discountAmount: Number(e.target.value) }), "number", productError.discountAmount)}
                {productError.discountAmount && <p className="text-red-500 text-sm">{productError.discountAmount}</p>}
              </div>
              <div className="w-full">
                <label className="block text-sm font-medium mb-1">Ngày bắt đầu</label>
                {renderInput("startAt", "", productForm.startAt, (e) => setProductForm({ ...productForm, startAt: e.target.value }), "date", productError.startAt)}
                {productError.startAt && <p className="text-red-500 text-sm">{productError.startAt}</p>}
              </div>
              <div className="w-full">
                <label className="block text-sm font-medium mb-1">Ngày kết thúc</label>
                {renderInput("endAt", "", productForm.endAt, (e) => setProductForm({ ...productForm, endAt: e.target.value }), "date", productError.endAt)}
                {productError.endAt && <p className="text-red-500 text-sm">{productError.endAt}</p>}
              </div>
              <button type="submit" className="w-full bg-emerald-600 text-white font-semibold py-2 rounded-lg shadow hover:bg-emerald-700 transition">
                {isEditingProduct ? "Lưu thay đổi" : "Tạo giảm giá"}
              </button>
            </form>
          </div>
          <div className="w-full"> 
            <h2 className="text-2xl font-semibold mb-4 w-full">Danh sách giảm giá sản phẩm</h2>
            {productDiscounts.length === 0 ? <p className="text-gray-500 w-full">Chưa có giảm giá nào</p> :
              <div className="space-y-4 w-full">
                {productDiscounts.map((d) => {
                  const productNames = d.itemIds ? d.itemIds.map((id: number) => items.find(p => p.id === id)?.name).filter(Boolean).join(', ') : "(Không xác định)";
                  return (
                    <div key={d.id} className="w-full bg-white p-4 rounded-2xl shadow hover:shadow-md transition flex justify-between items-center">
                      <div className="flex-1">
                        <p className="font-semibold text-gray-800">{d.title} — Sản phẩm: {productNames} — Giảm {d.discountAmount}%</p>
                        <p className="text-sm text-gray-500">Từ {formatDate(d.startAt)} đến {formatDate(d.endAt)}</p>
                      </div>
                      <div className="flex gap-2 flex-shrink-0">
                        <button className="px-3 py-1 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition" onClick={() => editProductDiscount(d)}>Sửa</button>
                        <button className="px-3 py-1 rounded-lg bg-cyan-500 text-white hover:bg-cyan-600 transition" onClick={() => viewProductDetail(d)}>Chi tiết</button>
                        <button className="px-3 py-1 rounded-lg bg-red-500 text-white hover:bg-red-600 transition" onClick={() => removeProductDiscount(d.id)}>Xóa</button>
                      </div>
                    </div>
                  );
                })}
              </div>
            }
          </div>
        </>
      )}
      {activeTab === 'member' && (
        <>
          <div className="w-full bg-gradient-to-r from-emerald-50 to-green-50 p-6 rounded-2xl shadow-lg mb-6"> 
            <h2 className="text-xl font-semibold text-gray-700 mb-4 text-center">{isEditingMember ? "Chỉnh sửa chương trình" : "Tạo chương trình mới"}</h2>
            <ProductSelector 
              selectedIds={selectedItemIds} 
              onSelectToggle={(id) => {
                setSelectedItemIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
              }} 
              title="Chọn sản phẩm áp dụng (để trống = toàn bộ)" 
            />
            <form onSubmit={handleMemberSubmit} className="space-y-4 w-full">
              <div className="w-full">
                <label className="block text-sm font-medium mb-1">Tiêu đề ưu đãi</label>
                {renderInput("title", "", memberForm.title, (e) => setMemberForm({ ...memberForm, title: e.target.value }), "text", memberError.title)}
                {memberError.title && <p className="text-red-500 text-sm">{memberError.title}</p>}
              </div>
              <div className="w-full">
                <label className="block text-sm font-medium mb-1">% Giảm (0-100)</label>
                {renderInput("discountAmount", "", memberForm.discountAmount, (e) => setMemberForm({ ...memberForm, discountAmount: Number(e.target.value) }), "number", memberError.discountAmount)}
                {memberError.discountAmount && <p className="text-red-500 text-sm">{memberError.discountAmount}</p>}
              </div>
              <div className="w-full">
                <label className="block text-sm font-medium mb-1">Điểm tối thiểu</label>
                {renderInput("minPoints", "", memberForm.minPoints, (e) => setMemberForm({ ...memberForm, minPoints: Number(e.target.value) }), "number", memberError.minPoints)}
                {memberError.minPoints && <p className="text-red-500 text-sm">{memberError.minPoints}</p>}
              </div>
              <div className="w-full">
                <label className="block text-sm font-medium mb-1">Ngày bắt đầu</label>
                {renderInput("startAt", "", memberForm.startAt, (e) => setMemberForm({ ...memberForm, startAt: e.target.value }), "date", memberError.startAt)}
                {memberError.startAt && <p className="text-red-500 text-sm">{memberError.startAt}</p>}
              </div>
              <div className="w-full">
                <label className="block text-sm font-medium mb-1">Ngày kết thúc</label>
                {renderInput("endAt", "", memberForm.endAt, (e) => setMemberForm({ ...memberForm, endAt: e.target.value }), "date", memberError.endAt)}
                {memberError.endAt && <p className="text-red-500 text-sm">{memberError.endAt}</p>}
              </div>
              <div className="flex items-center w-full">
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
          <div className="w-full">
            <h2 className="text-2xl font-semibold mb-4 w-full">Danh sách chương trình thành viên</h2>
            {memberDiscounts.length === 0 ? <p className="text-gray-500 w-full">Chưa có chương trình nào</p> :
              <div className="space-y-4 w-full">
                {memberDiscounts.map((d) => {
                  const productNames = d.itemIds
  ? d.itemIds.map((id: number) => items.find(p => p.id === id)?.name)
      .filter(Boolean)
      .join(', ')
  : "Toàn bộ sản phẩm";

                  return (
                    <div key={d.id} className="w-full bg-white p-4 rounded-2xl shadow hover:shadow-md transition flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="text-lg font-bold mb-1">{d.title}</h3>
                        <p className="text-sm text-gray-600 mb-1">Áp dụng: {productNames}</p>
                        <p className="text-sm mb-1">Giảm <span className="font-semibold">{d.discountAmount}%</span> | Điểm tối thiểu: <span className="font-semibold">{d.minPoints}</span></p>
                        <p className="text-sm">Từ {formatDate(d.startAt)} đến {formatDate(d.endAt)} - Trạng thái: {d.isActive ? 'Hoạt động' : 'Tắt'}</p>
                      </div>
                      <div className="flex flex-col gap-2 ml-4 flex-shrink-0">
                        <button className="px-3 py-1 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition" onClick={() => editMemberDiscount(d)}>Sửa</button>
                        <button className="px-3 py-1 rounded-lg bg-red-500 text-white hover:bg-red-600 transition" onClick={() => removeMemberDiscount(d.id)}>Xóa</button>
                      </div>
                    </div>
                  );
                })}
              </div>
            }
          </div>
        </>
      )}
      {showModal && selectedDiscount && <DetailModal />}
    </div>
  );
}