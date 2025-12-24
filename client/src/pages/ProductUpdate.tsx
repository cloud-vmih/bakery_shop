// src/pages/MenuManagement.tsx
import { useEffect, useState } from "react";
import itemService from "../services/items.service";
import { toast } from "react-toastify";
import {Item} from "../services/items.service";

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
    "ALL" | "BREAD" | "COOKIE" | "CAKE" | "OTHER" | "OUT_OF_STOCK"
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

  const [editingQuantity, setEditingQuantity] = useState<Record<number, string>>({});

  // FETCH
  const fetchItems = async () => {
    try {
      setLoading(true);
      const res = await itemService.getAll();
      setItems(res.data || []);
    } catch {
      // Removed unrelated toast
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  // UPDATE QUANTITY
  const updateQuantity = async (id: number) => {
    const qtyStr = editingQuantity[id] ?? "";
    const quantityNum = Number(qtyStr);
    if (isNaN(quantityNum) || quantityNum < 0) {
      return;
    }

    try {
      await itemService.update(id, { itemDetail: { quantity: quantityNum } });
      fetchItems();
      setEditingQuantity((prev) => {
        const newPrev = { ...prev };
        delete newPrev[id];
        return newPrev;
      });
    } catch (err) {
      // Removed unrelated toast
    }
  };

  // FILTER & GROUP
  const filteredItems = items.filter((item) => {
    const key = search.toLowerCase();
    const d = item.itemDetail || {};
    const matchesSearch = (
      item.name.toLowerCase().includes(key) ||
      (item.description || "").toLowerCase().includes(key) ||
      (d.flavor || "").toLowerCase().includes(key) ||
      (d.flourType || "").toLowerCase().includes(key)
    );
    const quantity = d.quantity ?? 0;

    if (activeTab === "OUT_OF_STOCK") {
      return quantity === 0 && matchesSearch;
    } else {
      if (activeTab !== "ALL" && item.category !== activeTab) return false;
      return quantity > 0 && matchesSearch;
    }
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
    <div className="min-h-screen bg-gradient-to-b from-white via-emerald-50 to-white py-8">
      <div className="max-w-7xl mx-auto px-6">
        {/* HEADER */}
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-emerald-800 mb-4">
            Cập Nhật Số Lượng Sản Phẩm
          </h1>

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
              { key: "OUT_OF_STOCK", label: "Hết hàng" },
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
                    const currentQty = editingQuantity[item.id] ?? quantity.toString();

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

                            <div className="mt-2 flex items-center justify-center gap-2">
                              <label className="text-sm font-medium">Tồn kho:</label>
                              <input
                                type="number"
                                min="0"
                                value={currentQty}
                                onChange={(e) =>
                                  setEditingQuantity({ ...editingQuantity, [item.id]: e.target.value })
                                }
                                className={`w-20 px-2 py-1 border rounded-lg ${Number(currentQty) > 0 ? "text-green-600" : "text-red-600"}`}
                              />
                              <button
                                onClick={() => updateQuantity(item.id)}
                                className="px-3 py-1 bg-emerald-100 hover:bg-emerald-200 rounded text-emerald-800 font-medium"
                              >
                                Cập nhật
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
      </div>
    </div>
  );
}