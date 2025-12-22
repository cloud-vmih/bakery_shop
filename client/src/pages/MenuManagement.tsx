// src/pages/MenuManagement.tsx
import { useEffect, useState } from "react";
import itemService from "../services/items.service";
import { toast } from "react-toastify";
import {Item} from "../services/items.service";
import { Header } from "../components/Header";

type CakeType = "CHEESECAKE" | "BIRTHDAYCAKE" | "MOUSSE";



const categoryTitles: Record<string, string> = {
  BREAD: "BÁNH MÌ",
  COOKIE: "BÁNH QUY",
  CAKE: "BÁNH NGỌT",
  OTHER: "MÓN KÈM",
};

export default function MenuManagement() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<
    "ALL" | "BREAD" | "COOKIE" | "CAKE" | "OTHER"
  >("ALL");

  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const toggleExpand = (category: string) => {
    setExpandedCategories((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(category)) newSet.delete(category);
      else newSet.add(category);
      return newSet;
    });
  };

  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<Item | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  // Không còn quantity trong formData nữa vì không cho sửa
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: 0,
    imageURL: "",
    category: "CAKE",
    cakeType: "" as CakeType | "",
    size: 20,
    flavor: "",
    flourType: "",
    weight: 200,
    manufacturingDate: "",
  });

  // FETCH
  const fetchItems = async () => {
    try {
      setLoading(true);
      const res = await itemService.getAll();
      setItems(res.data || []);
    } catch {
      toast.error("Không thể tải danh sách món!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  // DELETE
  const handleDelete = (id: number) => setDeleteId(id);
  const confirmDelete = async () => {
    if (!deleteId) return;
    try {
      await itemService.delete(deleteId);
      toast.success("Đã xóa thành công!");
      fetchItems();
    } catch {
      toast.error("Xóa thất bại!");
    } finally {
      setDeleteId(null);
    }
  };

  // RESET FORM
  const resetForm = () => {
    setEditingItem(null);
    setFormData({
      name: "",
      description: "",
      price: 0,
      imageURL: "",
      category: "CAKE",
      cakeType: "",
      size: 20,
      flavor: "",
      flourType: "",
      weight: 200,
      manufacturingDate: "",
    });
  };

  // EDIT – chỉ điền các field được phép sửa
  const openEdit = (item: Item) => {
    const d = item.itemDetail || {};
    setEditingItem(item);
    setFormData({
      name: item.name,
      description: item.description || "",
      price: item.price,
      imageURL: item.imageURL || "",
      category: item.category,
      cakeType: d.cakeType || "",
      size: d.size ?? 20,
      flavor: d.flavor || "",
      flourType: d.flourType || "",
      weight: d.weight ?? 200,
      manufacturingDate: d.manufacturingDate?.slice(0, 10) || "",
    });
    setShowModal(true);
  };

  // SUBMIT
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.warning("Vui lòng nhập tên món!");
      return;
    }
    if (formData.price < 1000) {
      toast.warning("Giá phải ≥ 1.000đ");
      return;
    }

    // Lấy quantity hiện tại (nếu đang sửa) hoặc mặc định 0 (nếu thêm mới)
    const currentQuantity = editingItem?.itemDetail?.quantity ?? 0;

    const payload: any = {
      name: formData.name.trim(),
      description: formData.description.trim(),
      price: formData.price,
      imageURL: formData.imageURL.trim(),
      category: formData.category,
      itemDetail: {
        quantity: currentQuantity, // ← Luôn giữ quantity cũ hoặc 0 nếu thêm mới
        ...(formData.category === "CAKE" && {
          cakeType: formData.cakeType || null,
          size: formData.size || null,
          flavor: formData.flavor || null,
        }),
        ...(formData.category === "BREAD" && {
          flourType: formData.flourType || null,
        }),
        ...(formData.category === "COOKIE" && {
          flavor: formData.flavor || null,
          weight: formData.weight || null,
          manufacturingDate: formData.manufacturingDate || null,
        }),
      },
    };

    try {
      if (editingItem) {
        await itemService.update(editingItem.id, payload);
        toast.success("Cập nhật thành công!");
      } else {
        await itemService.create(payload);
        toast.success("Thêm món thành công!");
      }
      setShowModal(false);
      resetForm();
      fetchItems();
    } catch (err) {
      toast.error("Lưu thất bại!");
    }
  };

  // FILTER & GROUP
  const filteredItems = items.filter((item) => {
    if (activeTab !== "ALL" && item.category !== activeTab) return false;
    const key = search.toLowerCase();
    const d = item.itemDetail || {};
    return (
      item.name.toLowerCase().includes(key) ||
      (item.description || "").toLowerCase().includes(key) ||
      (d.flavor || "").toLowerCase().includes(key) ||
      (d.flourType || "").toLowerCase().includes(key)
    );
  });

  const groupedItems = filteredItems.reduce((acc, item) => {
    const cat = item.category;
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(item);
    return acc;
  }, {} as Record<string, Item[]>);

  const displayOrder = ["BREAD", "COOKIE", "CAKE", "OTHER"];
  const sortedCategories = displayOrder.filter((c) => groupedItems[c]);

  return (
      <>
          <Header />
    <div className="min-h-screen bg-gradient-to-b from-white via-emerald-50 to-white py-8">
      <div className="max-w-7xl mx-auto px-6">
        {/* HEADER */}
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-emerald-800 mb-4">
            Quản lý Menu
          </h1>

          <button
            onClick={() => {
              resetForm();
              setShowModal(true);
            }}
            className="bg-emerald-300 text-emerald-900 px-6 py-3 rounded-lg shadow hover:bg-emerald-400 transition font-bold text-lg"
          >
            + Thêm món mới
          </button>

          {/* SEARCH */}
          <div className="mt-6 flex justify-center gap-3 max-w-xl mx-auto">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm tên, mô tả, hương vị..."
              className="flex-1 px-4 py-2 border border-emerald-200 rounded-lg bg-white shadow-sm"
            />
            <button
              onClick={() => setSearch("")}
              className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
            >
              X
            </button>
          </div>

          {/* TABS */}
          <div className="flex justify-center gap-3 mt-6 flex-wrap">
            {[
              { key: "ALL", label: "Tất cả" },
              { key: "BREAD", label: "Bánh mì" },
              { key: "COOKIE", label: "Bánh quy" },
              { key: "CAKE", label: "Bánh ngọt" },
              { key: "OTHER", label: "Món kèm" },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`px-5 py-2 rounded-full font-medium transition ${
                  activeTab === tab.key
                    ? "bg-emerald-500 text-white shadow-lg"
                    : "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* BODY */}
        {loading ? (
          <p className="text-center py-20 text-gray-600">Đang tải...</p>
        ) : sortedCategories.length === 0 ? (
          <p className="text-center py-20 text-gray-500">Không tìm thấy món nào.</p>
        ) : (
          sortedCategories.map((category) => {
            const list = groupedItems[category];
            const isExpanded = expandedCategories.has(category);
            const visible = isExpanded ? list : list.slice(0, 8);

            return (
              <section key={category} className="mt-12">
                <h2 className="text-3xl font-bold text-center text-emerald-900 mb-8">
                  {categoryTitles[category]}
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {visible.map((item) => {
                    const quantity = item.itemDetail?.quantity ?? 0;

                    return (
                      <div
                        key={item.id}
                        className="bg-gradient-to-br from-amber-100 to-amber-200 p-1 rounded-xl shadow hover:shadow-xl transition"
                      >
                        <div className="bg-white rounded-xl overflow-hidden">
                          <img
                            src={item.imageURL || "https://picsum.photos/400"}
                            alt={item.name}
                            className="w-full h-48 object-cover"
                          />
                          <div className="p-4 text-center">
                            <h3 className="font-bold text-emerald-900">{item.name}</h3>
                            <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                              {item.description || "Chưa có mô tả"}
                            </p>
                            <p className="text-xl font-bold text-emerald-700 mt-3">
                              {item.price.toLocaleString()}đ
                            </p>

                            {/* VẪN HIỂN THỊ SỐ LƯỢNG CHO ADMIN XEM */}
                            <p className={`mt-2 text-sm font-medium ${quantity > 0 ? "text-green-600" : "text-red-600"}`}>
                              Tồn kho: {quantity} cái
                            </p>

                            <div className="flex gap-2 mt-4">
                              <button
                                onClick={() => openEdit(item)}
                                className="flex-1 bg-emerald-100 hover:bg-emerald-200 py-2 rounded text-emerald-800 font-medium"
                              >
                                Sửa
                              </button>
                              <button
                                onClick={() => handleDelete(item.id)}
                                className="flex-1 bg-red-100 hover:bg-red-200 py-2 rounded text-red-800 font-medium"
                              >
                                Xóa
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {list.length > 8 && (
                  <div className="text-center mt-8">
                    <button
                      onClick={() => toggleExpand(category)}
                      className="bg-emerald-100 hover:bg-emerald-200 px-8 py-3 rounded-full font-medium"
                    >
                      {isExpanded ? "Ẩn bớt" : `Xem thêm (${list.length - 8})`}
                    </button>
                  </div>
                )}
              </section>
            );
          })
        )}

        {/* MODAL – ĐÃ ẨN FIELD QUANTITY */}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-emerald-100">
              <div className="p-5 bg-emerald-50 border-b text-center">
                <h2 className="text-2xl font-bold text-emerald-800">
                  {editingItem ? "Chỉnh sửa món" : "Thêm món mới"}
                </h2>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-emerald-800 mb-1">
                      Tên món *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="VD: Bánh sinh nhật socola"
                      className="w-full px-4 py-2 border rounded-lg bg-emerald-50 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-emerald-800 mb-1">
                      Loại món *
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) =>
                        setFormData({ ...formData, category: e.target.value as any })
                      }
                      className="w-full px-4 py-2 border rounded-lg bg-emerald-50"
                    >
                      <option value="CAKE">Bánh ngọt</option>
                      <option value="BREAD">Bánh mì</option>
                      <option value="COOKIE">Bánh quy</option>
                      <option value="OTHER">Món kèm</option>
                    </select>
                  </div>
                </div>


                {/* CÁC FIELD RIÊNG THEO LOẠI */}
                {formData.category === "CAKE" && (
                  <div className="p-4 bg-emerald-50 rounded-lg space-y-4">
                    <div>
                      <label className="block text-sm font-medium">Loại bánh kem</label>
                      <select
                        value={formData.cakeType}
                        onChange={(e) => setFormData({ ...formData, cakeType: e.target.value as CakeType })}
                        className="w-full px-4 py-2 border rounded-lg"
                      >
                        <option value="">-- Chọn --</option>
                        <option value="BIRTHDAYCAKE">Bánh sinh nhật</option>
                        <option value="CHEESECAKE">Cheesecake</option>
                        <option value="MOUSSE">Mousse</option>
                      </select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm">Kích thước (cm)</label>
                        <input
                          type="number"
                          value={formData.size}
                          onChange={(e) =>
                            setFormData({ ...formData, size: Number(e.target.value) || 20 })
                          }
                          placeholder="20"
                          className="w-full px-4 py-2 border rounded-lg"
                        />
                      </div>
                      <div>
                        <label className="text-sm">Hương vị</label>
                        <input
                          type="text"
                          value={formData.flavor}
                          onChange={(e) => setFormData({ ...formData, flavor: e.target.value })}
                          placeholder="Socola, vani, dâu..."
                          className="w-full px-4 py-2 border rounded-lg"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {formData.category === "BREAD" && (
                  <div className="p-4 bg-emerald-50 rounded-lg">
                    <label className="block text-sm font-medium">Loại bột</label>
                    <select
                      value={formData.flourType}
                      onChange={(e) => setFormData({ ...formData, flourType: e.target.value })}
                      className="w-full px-4 py-2 border rounded-lg"
                    >
                      <option value="">-- Chọn --</option>
                      <option value="wheat">Bột mì thường</option>
                      <option value="whole_wheat">Nguyên cám</option>
                      <option value="rye">Lúa mạch đen</option>
                    </select>
                  </div>
                )}

                {formData.category === "COOKIE" && (
                  <div className="p-4 bg-emerald-50 rounded-lg grid grid-cols-3 gap-4">
                    <div>
                      <label className="text-sm">Hương vị</label>
                      <input
                        type="text"
                        value={formData.flavor}
                        onChange={(e) => setFormData({ ...formData, flavor: e.target.value })}
                        placeholder="Socola chip"
                        className="w-full px-3 py-2 border rounded"
                      />
                    </div>
                    <div>
                      <label className="text-sm">Trọng lượng (g)</label>
                      <input
                        type="number"
                        value={formData.weight}
                        onChange={(e) =>
                          setFormData({ ...formData, weight: Number(e.target.value) || 200 })
                        }
                        placeholder="200"
                        className="w-full px-3 py-2 border rounded"
                      />
                    </div>
                    <div>
                      <label className="text-sm">Ngày sản xuất</label>
                      <input
                        type="date"
                        value={formData.manufacturingDate}
                        onChange={(e) =>
                          setFormData({ ...formData, manufacturingDate: e.target.value })
                        }
                        className="w-full px-3 py-2 border rounded"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-emerald-800 mb-1">
                    Mô tả
                  </label>
                  <textarea
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Mềm, thơm, nhiều lớp..."
                    className="w-full px-4 py-2 border rounded-lg bg-emerald-50"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium">Giá (đ) *</label>
                    <input
                      type="number"
                      required
                      min="1000"
                      step="1000"
                      value={formData.price}
                      onChange={(e) =>
                        setFormData({ ...formData, price: Number(e.target.value) })
                      }
                      placeholder="25000"
                      className="w-full px-4 py-2 border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium">Link ảnh</label>
                    <input
                      type="url"
                      value={formData.imageURL}
                      onChange={(e) => setFormData({ ...formData, imageURL: e.target.value })}
                      placeholder="https://..."
                      className="w-full px-4 py-2 border rounded-lg bg-emerald-50"
                    />
                  </div>
                </div>

                {/* Ghi chú nhỏ cho admin biết quantity mặc định là 0 */}
                {!editingItem && (
                  <p className="text-xs text-gray-500 text-center">
                    Lưu ý: Số lượng tồn kho mặc định là <strong>0</strong>. Bạn có thể cập nhật sau trong phần quản lý kho.
                  </p>
                )}

                <div className="flex justify-end gap-3 pt-4 border-t">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-6 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="px-8 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 font-bold"
                  >
                    {editingItem ? "Cập nhật" : "Thêm món"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* DELETE MODAL */}
        {deleteId && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-xl shadow-xl text-center max-w-sm">
              <h3 className="text-xl font-bold text-red-600">Xóa món?</h3>
              <p className="mt-3 text-gray-600">Hành động này không thể hoàn tác.</p>
              <div className="flex justify-center gap-4 mt-6">
                <button
                  onClick={confirmDelete}
                  className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                >
                  Xóa
                </button>
                <button
                  onClick={() => setDeleteId(null)}
                  className="px-6 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
                >
                  Hủy
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
      </>
  );
}