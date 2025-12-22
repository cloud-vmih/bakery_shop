// Thêm component này trong BranchPage (trước return)
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { getMenu} from "../services/menu.services";
import { updateMultipleQuantities } from "../services/inventory.services";
import { useInventory} from "../context/inventoryContext";

export default function InventoryPopup({
                            branchId,
                            open,
                            onClose
                        }: {
    branchId: number;
    open: boolean;
    onClose: () => void;
}) {
    const [items, setItems] = useState<any[]>([]);
    const [categories, setCategories] = useState<string[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [inventory, setInventory] = useState<Record<number, number>>({});
    const [loading, setLoading] = useState(true);
    const { summary, loadInventory, getItemQuantity, clearInventory, refreshInventory } = useInventory();

    useEffect(() => {
        if (open && branchId) {
            loadInventoryData();
        }
    }, [open, branchId]);

    const loadInventoryData = async () => {
        try {
            // Giả sử có API lấy menu items
            const menuItems = await getMenu();
            setItems(menuItems);

            // Lấy categories từ items
            const uniqueCategories: string[] = Array.from(
                new Set(
                    menuItems
                        .map((item: any) => item?.category)
                        .filter((category: any): category is string =>
                            Boolean(category) && typeof category === 'string'
                        )
                )
            );
            setCategories(uniqueCategories);
            const initialInventory = menuItems.reduce((acc: any, item: any) => {
                if (item?.id) {
                    acc[item.id] = getItemQuantity(item.id, branchId);
                }
                return acc;
            }, {} as Record<number, number>);

            setInventory(initialInventory);

        } catch (error) {
            console.error('Lỗi tải inventory:', error);
            toast.error('Không thể tải dữ liệu tồn kho');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateQuantity = (itemId: number, newQuantity: number) => {
        setInventory(prev => ({
            ...prev,
            [itemId]: newQuantity
        }));
    };

    const handleSaveInventory = async () => {
        try {
            // Chuyển inventory object thành mảng updates
            const updates: Array<{ itemId: number; quantity: number }> = Object.entries(inventory)
                .map(([itemIdStr, quantity]) => ({
                    itemId: Number(itemIdStr),
                    quantity: Number(quantity)
                }))
                .filter(update => !isNaN(update.itemId) && !isNaN(update.quantity));

            if (updates.length === 0) {
                toast.error('Không có dữ liệu để cập nhật');
                return;
            }

            // Gọi API với updates array
            const result = await updateMultipleQuantities(branchId, updates);

            if (result.success) {
                toast.success(result.message || 'Đã cập nhật tồn kho thành công!');
                refreshInventory();
                onClose();
            } else {
                toast.error(result.error || 'Cập nhật thất bại');
            }
        } catch (error: any) {
            toast.error(error.message || 'Cập nhật thất bại')
        }
    };

    const filteredItems = selectedCategory
        ? items.filter(item => item.category === selectedCategory)
        : items;

    if (!open) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">
            <div className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b bg-gradient-to-r from-emerald-50 to-white">
                    <div>
                        <h2 className="text-2xl font-bold text-emerald-800">Quản lý tồn kho</h2>
                        <p className="text-emerald-600 text-sm mt-1">
                            Chi nhánh ID: {branchId} • {items.length} sản phẩm
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={handleSaveInventory}
                            className="px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-medium rounded-lg hover:shadow-lg transition-all"
                        >
                            Lưu thay đổi
                        </button>
                        <button
                            onClick={onClose}
                            className="px-5 py-2.5 border border-emerald-200 text-emerald-700 rounded-lg hover:bg-emerald-50 transition-colors"
                        >
                            ✕ Đóng
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-hidden">
                    {/* Categories Filter */}
                    <div className="p-4 border-b bg-emerald-50/50">
                        <div className="flex flex-wrap gap-2">
                            <button
                                onClick={() => setSelectedCategory(null)}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                                    selectedCategory === null
                                        ? 'bg-emerald-500 text-white shadow'
                                        : 'bg-white text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                                }`}
                            >
                                Tất cả
                            </button>
                            {categories.map(category => (
                                <button
                                    key={category}
                                    onClick={() => setSelectedCategory(category)}
                                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                                        selectedCategory === category
                                            ? 'bg-emerald-500 text-white shadow'
                                            : 'bg-white text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                                    }`}
                                >
                                    {/*{category === 'CAKE' ? '🍰 Bánh ngọt' :*/}
                                    {/*    category === 'BREAD' ? '🥖 Bánh mì' :*/}
                                    {/*        category === 'COOKIE' ? '🍪 Bánh quy' :*/}
                                    {/*            category === 'OTHER' ? 'Khác' :*/}
                                    {/*            '📋 ' + category}*/}
                                    {category}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Items List */}
                    <div className="overflow-y-auto max-h-[calc(90vh-200px)] p-4">
                        {loading ? (
                            <div className="flex justify-center items-center h-64">
                                <div className="text-center">
                                    <div className="w-16 h-16 border-4 border-emerald-200 border-t-emerald-500 rounded-full animate-spin mx-auto"></div>
                                    <p className="mt-4 text-emerald-600">Đang tải tồn kho...</p>
                                </div>
                            </div>
                        ) : filteredItems.length === 0 ? (
                            <div className="text-center py-12 text-gray-500">
                                <p className="text-lg">Không có sản phẩm nào</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {filteredItems.map(item => (
                                    <div
                                        key={item.id}
                                        className="bg-white border border-emerald-100 rounded-xl p-4 hover:shadow-md transition-shadow flex items-center gap-4"
                                    >
                                        {/* Item Image */}
                                        <div className="flex-shrink-0">
                                            {item.imageURL ? (
                                                <img
                                                    src={item.imageURL}
                                                    alt={item.name}
                                                    className="w-20 h-20 rounded-lg object-cover border border-emerald-100"
                                                />
                                            ) : (
                                                <div className="w-20 h-20 rounded-lg bg-emerald-100 flex items-center justify-center">
                                                    <span className="text-3xl">🍞</span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Item Info */}
                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-semibold text-emerald-900 truncate">
                                                {item.name}
                                            </h4>
                                            <p className="text-sm text-emerald-600 mt-1">
                                                {item.price?.toLocaleString()} VND
                                            </p>
                                            <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
                                                <span>Danh mục: {item.category || 'Khác'}</span>
                                            </div>
                                        </div>

                                        {/* Quantity Control */}
                                        <div className="flex-shrink-0">
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => handleUpdateQuantity(item.id, Math.max(0, (inventory[item.id] || 0) - 1))}
                                                    className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 hover:bg-emerald-200 flex items-center justify-center"
                                                >
                                                    -
                                                </button>
                                                <div className="w-20 text-center">
                                                    <input
                                                        type="number"
                                                        min="0"
                                                        value={inventory[item.id]}
                                                        onChange={(e) => handleUpdateQuantity(item.id, parseInt(e.target.value) || 0)}
                                                        className="w-full px-3 py-1.5 border border-emerald-200 rounded-lg text-center text-emerald-900 font-medium"
                                                    />
                                                    <div className="text-xs text-emerald-600 mt-1">số lượng</div>
                                                </div>
                                                <button
                                                    onClick={() => handleUpdateQuantity(item.id, (inventory[item.id] || 0) + 1)}
                                                    className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 hover:bg-emerald-200 flex items-center justify-center"
                                                >
                                                    +
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer Stats */}
                <div className="p-4 border-t bg-emerald-50">
                    <div className="grid grid-cols-3 gap-4 text-center">
                        <div className="bg-white p-3 rounded-lg border border-emerald-100">
                            <div className="text-2xl font-bold text-emerald-700">
                                {Object.values(inventory).reduce((sum, qty) => sum + qty, 0)}
                            </div>
                            <div className="text-sm text-emerald-600">Tổng tồn kho</div>
                        </div>
                        <div className="bg-white p-3 rounded-lg border border-emerald-100">
                            <div className="text-2xl font-bold text-emerald-700">
                                {filteredItems.length}
                            </div>
                            <div className="text-sm text-emerald-600">Sản phẩm hiển thị</div>
                        </div>
                        <div className="bg-white p-3 rounded-lg border border-emerald-100">
                            <div className="text-2xl font-bold text-emerald-700">
                                {Object.keys(inventory).filter(id => (inventory[Number(id)] || 0) === 0).length}
                            </div>
                            <div className="text-sm text-emerald-600">Hết hàng</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}