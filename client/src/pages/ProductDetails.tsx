import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import itemService, { Item } from "../services/items.service";
import { addToCart } from "../services/cart.services";
import { getBranches } from "../services/branch.services";
import { Header } from "../components/Header";
import { useInventory } from "../context/inventoryContext";

type Branch = {
  id: number;
  name: string;
  address?: { fullAddress?: string };
};

const formatPrice = (price?: number) => {
  if (price === undefined || price === null) return "Liên hệ";
  return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " VNĐ";
};

const formatCategoryLabel = (category?: string) => {
  switch (category) {
    case "CAKE":
      return "Bánh ngọt";
    case "BREAD":
      return "Bánh mì";
    case "COOKIE":
      return "Bánh quy";
    default:
      return "Khác";
  }
};

const formatCakeSubtype = (subType?: string) => {
  switch (subType) {
    case "CHEESECAKE":
      return "Cheesecake";
    case "MOUSSE":
      return "Mousse";
    case "BIRTHDAYCAKE":
      return "Bánh kem";
    default:
      return undefined;
  }
};

const ProductDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const branchFromQuery = useMemo(() => {
    const value = searchParams.get("branch");
    if (!value) return null;
    const parsed = Number(value);
    return Number.isNaN(parsed) ? null : parsed;
  }, [searchParams]);

  const [item, setItem] = useState<Item | null>(null);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [selectedBranchId, setSelectedBranchId] = useState<number | null>(branchFromQuery);
  const [loadingItem, setLoadingItem] = useState<boolean>(true);
  const [loadingBranches, setLoadingBranches] = useState<boolean>(true);
  const { getItemQuantity, loadInventory } = useInventory();
  const navigate = useNavigate();

  useEffect(() => {
    loadInventory();
  }, [loadInventory]);

  useEffect(() => {
    if (!id) return;
    const fetchItem = async () => {
      try {
        setLoadingItem(true);
        const res = await itemService.getById(Number(id));
        const data = (res as any)?.data ?? res;
        setItem(data);
      } catch (error) {
        toast.error("Không tải được chi tiết sản phẩm");
      } finally {
        setLoadingItem(false);
      }
    };
    fetchItem();
  }, [id]);

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        setLoadingBranches(true);
        const data = await getBranches();
        setBranches(data || []);
        if (branchFromQuery && data?.some((branch: Branch) => branch.id === branchFromQuery)) {
          setSelectedBranchId(branchFromQuery);
        } else if (data?.length) {
          setSelectedBranchId(data[0].id);
        } else {
          setSelectedBranchId(null);
        }
      } catch (error) {
        toast.error("Không tải được danh sách chi nhánh");
      } finally {
        setLoadingBranches(false);
      }
    };
    fetchBranches();
  }, [branchFromQuery]);

  const tags = useMemo(() => {
    if (!item) return [];
    const detail = item.itemDetail || {};
    const computedTags: string[] = [];

    // Nhóm chính theo category
    computedTags.push(formatCategoryLabel(item.category));

    // Tag phụ cho bánh ngọt
    if (item.category === "CAKE") {
      const subType = formatCakeSubtype(detail.cakeSubType || (item as any).cakeSubType);
      if (subType) computedTags.push(subType);
    }

    // Cookie: hiển thị trọng lượng
    if (item.category === "COOKIE") {
      const weight = detail.weight || (item as any).weight;
      if (weight) computedTags.push(`Trọng lượng: ${weight}g`);
    }

    // Bánh mì: tag loại bột
    if (item.category === "BREAD") {
      const flourType = detail.flourType || (item as any).flourType;
      if (flourType) computedTags.push(`Loại bột: ${flourType}`);
    }

    return computedTags;
  }, [item]);

  const currentBranchQty = useMemo(() => {
    if (!item?.id || !selectedBranchId) return null;
    return getItemQuantity(item.id, selectedBranchId);
  }, [getItemQuantity, item?.id, selectedBranchId]);

  const selectedBranch = useMemo(
    () => branches.find((branch) => branch.id === selectedBranchId) ?? null,
    [branches, selectedBranchId]
  );

  const handleAddToCart = async () => {
    if (!item?.id) return;
    if (!selectedBranchId) {
      toast.error("Vui lòng chọn chi nhánh từ trang menu trước khi đặt hàng.");
      return;
    }
    try {
      await addToCart(item.id);
      toast.success("Đã thêm vào giỏ hàng!");
    } catch (err: any) {
      if (err?.message === "NEED_LOGIN") {
        navigate("/login");
        toast.error("Vui lòng đăng nhập để thêm vào giỏ");
        return;
      }
      toast.error("Thêm thất bại, vui lòng thử lại");
    }
  };

  const isOutOfStock = selectedBranchId ? (currentBranchQty ?? 0) === 0 : true;

  if (loadingItem) {
    return (
      <>
        <Header />
        <div className="max-w-6xl mx-auto px-4 py-10">
          <div className="animate-pulse space-y-6">
            <div className="h-8 w-64 bg-gray-200 rounded" />
            <div className="h-64 bg-gray-200 rounded-xl" />
            <div className="h-24 bg-gray-200 rounded-xl" />
          </div>
        </div>
      </>
    );
  }

  if (!item) {
    return (
      <>
        <Header />
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <p className="text-lg text-gray-600">Không tìm thấy sản phẩm.</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Hình ảnh */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
            <div className="aspect-square w-full overflow-hidden rounded-xl bg-gray-50 flex items-center justify-center">
              {item.imageURL ? (
                <img
                  src={item.imageURL}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-gray-400">Chưa có hình ảnh</span>
              )}
            </div>
          </div>

          {/* Nội dung */}
          <div className="lg:col-span-3 space-y-6">
            <div className="space-y-3">
              <h1 className="text-3xl font-semibold text-gray-900">{item.name}</h1>
              <p className="text-2xl text-green-700 font-semibold">{formatPrice(item.price)}</p>
              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={handleAddToCart}
                  disabled={isOutOfStock}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-white font-medium shadow-sm transition ${
                    isOutOfStock
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-green-600 hover:bg-green-700"
                  }`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                  {isOutOfStock ? "Hết hàng" : "Thêm vào giỏ hàng"}
                </button>
                {isOutOfStock && (
                  <span className="text-sm text-gray-500">
                    {!selectedBranchId
                      ? "Chọn chi nhánh ở trang menu để xem tồn kho."
                      : "Sản phẩm tạm hết tại chi nhánh này."}
                  </span>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 rounded-full bg-green-50 text-green-700 text-sm border border-green-100"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-3">
              <h2 className="text-lg font-semibold text-gray-900">Mô tả sản phẩm</h2>
              <p className="text-gray-700 leading-relaxed">
                {item.description || "Sản phẩm chưa có mô tả."}
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Tồn kho tại chi nhánh</h3>
              <div className="rounded-xl bg-gray-50 border border-gray-100 p-4">
                {loadingBranches ? (
                  <p className="text-gray-600">Đang tải chi nhánh...</p>
                ) : selectedBranchId ? (
                  <p className="text-base font-semibold text-green-700">
                    Số lượng sản phẩm tại chi nhánh: {currentBranchQty ?? 0}
                  </p>
                ) : (
                  <p className="text-gray-600">Không lấy được chi nhánh. Vui lòng thử lại sau.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductDetails;