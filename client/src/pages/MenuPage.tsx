import { useEffect, useState, useMemo } from "react";
import "../styles/menu.css";
import toast from "react-hot-toast";
import { getMenu } from "../services/menu.service";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import RequireAuthModal from "../components/RequireAuthModal";
import { Header } from "../components/Header";

import {
  ChevronLeftIcon,
  ChevronRightIcon,
  MagnifyingGlassIcon,
  ChevronDownIcon,
  MapPinIcon,
} from "@heroicons/react/24/outline";
import { getBranches } from "../services/branch.service";
import { useInventory } from "../context/InventoryContext";

export default function MenuPage() {
  const [items, setItems] = useState<any[]>([]);
  const [branches, setBranches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingBranches, setLoadingBranches] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedBranchId, setSelectedBranchId] = useState<number | null>(null);
  const [priceSort, setPriceSort] = useState<
    "none" | "low-to-high" | "high-to-low"
  >("none");

  const [showAuthModal, setShowAuthModal] = useState(false);

  const itemsPerPage = 12;

  const { user, setUser } = useUser();
  const { addToCart } = useCart();

  const navigate = useNavigate();
  const { getItemQuantity, branchId, setBranchId } = useInventory(); //gọi brandId để lưu brandId

  useEffect(() => {
    console.log("[MenuPage] InventoryContext branchId changed:", branchId);
  }, [branchId]);

  useEffect(() => {
    const loadMenu = async () => {
      try {
        const data = await getMenu();
        setItems(data);
      } catch (err: any) {
        toast.error(err.message || "Không thể tải danh sách sản phẩm");
      } finally {
        setLoading(false);
      }
    };
    loadMenu();
  }, []);

  useEffect(() => {
    const loadBranches = async () => {
      try {
        const data = await getBranches(); // ← Dùng đúng hàm có sẵn
        setBranches(data);
      } catch (err: any) {
        console.error("Lỗi tải chi nhánh:", err);
        toast.error("Không thể tải danh sách chi nhánh");
        setBranches([]);
      } finally {
        setLoadingBranches(false);
      }
    };
    loadBranches();
  }, []);

  const handleAddToCart = async (itemId: number) => {
    try {
      await addToCart(itemId, 1);
    } catch (err: any) {
      if (err?.message === "NEED_LOGIN") {
        setShowAuthModal(true);
        return;
      }
      toast.error("Thêm thất bại, vui lòng thử lại");
    }
  };

  const formatPrice = (price: number) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " VNĐ";
  };

  // Lọc và sắp xếp sản phẩm
  const filteredAndSortedItems = useMemo(() => {
    let filtered = [...items];

    // Lọc tìm kiếm
    if (searchQuery.trim()) {
      filtered = filtered.filter(
        (item) =>
          item.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Lọc danh mục
    if (selectedCategory) {
      filtered = filtered.filter((item) => item.category === selectedCategory);
    }

    // Sắp xếp theo tồn kho nếu đã chọn chi nhánh
    if (selectedBranchId !== null) {
      filtered.sort((a, b) => {
        const qtyA = getItemQuantity(a.id, selectedBranchId);
        const qtyB = getItemQuantity(b.id, selectedBranchId);
        return qtyB - qtyA; // Có hàng (qty > 0) lên trước, hết hàng xuống sau
      });
    }

    // Sắp xếp giá
    if (priceSort === "low-to-high") {
      filtered.sort((a, b) => (a.price || 0) - (b.price || 0));
    } else if (priceSort === "high-to-low") {
      filtered.sort((a, b) => (b.price || 0) - (a.price || 0));
    }

    return filtered;
  }, [
    items,
    searchQuery,
    selectedCategory,
    selectedBranchId,
    priceSort,
    getItemQuantity,
  ]);

  // Tính toán phân trang
  const totalPages = Math.ceil(filteredAndSortedItems.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = filteredAndSortedItems.slice(startIndex, endIndex);

  // Reset về trang 1 khi filter thay đổi
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory, priceSort]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const categories = [
    { value: "CAKE", label: "Bánh ngọt" },
    { value: "BREAD", label: "Bánh mì" },
    { value: "COOKIE", label: "Bánh quy" },
    { value: "OTHER", label: "Khác" },
  ];

  return (
    <>
      <Header />
      <div className="menuPage">
        <section className="menuSection">
          <div className="menuLayout">
            {/* Sidebar */}
            <aside className="categorySidebar">
              <div className="sidebarHeader">
                <h3 className="sidebarTitle">Danh mục</h3>
              </div>
              <div className="categoryList">
                <button
                  onClick={() => setSelectedCategory(null)}
                  className={`categoryItem ${
                    selectedCategory === null ? "active" : ""
                  }`}
                >
                  <span className="categoryIndicator"></span>
                  <span className="categoryLabel">Tất cả</span>
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.value}
                    onClick={() => setSelectedCategory(cat.value)}
                    className={`categoryItem ${
                      selectedCategory === cat.value ? "active" : ""
                    }`}
                  >
                    <span className="categoryIndicator"></span>
                    <span className="categoryLabel">{cat.label}</span>
                  </button>
                ))}
              </div>

              <div className="priceSortSection">
                <h3 className="sidebarTitle">Sắp xếp giá</h3>
                <div className="priceSortOptions">
                  <button
                    onClick={() => setPriceSort("none")}
                    className={`priceSortButton ${
                      priceSort === "none" ? "active" : ""
                    }`}
                  >
                    <span className="priceSortIndicator"></span>
                    <span>Mặc định</span>
                  </button>
                  <button
                    onClick={() => setPriceSort("low-to-high")}
                    className={`priceSortButton ${
                      priceSort === "low-to-high" ? "active" : ""
                    }`}
                  >
                    <span className="priceSortIndicator"></span>
                    <span>Thấp → Cao</span>
                  </button>
                  <button
                    onClick={() => setPriceSort("high-to-low")}
                    className={`priceSortButton ${
                      priceSort === "high-to-low" ? "active" : ""
                    }`}
                  >
                    <span className="priceSortIndicator"></span>
                    <span>Cao → Thấp</span>
                  </button>
                </div>
              </div>
            </aside>

            {/* Phần nội dung chính */}
            <div className="menuContentArea">
              {/* Title và Subtitle */}
              <div className="mb-6">
                <h2 className="menuPageTitle">Menu của chúng mình</h2>
                <p className="menuPageSubtitle">
                  Mời bạn ghé xem và chọn cho mình một chiếc bánh thật ngon nhé!
                </p>
              </div>

              {/* Thanh search + dropdown chi nhánh */}
              <div className="flex flex-col lg:flex-row gap-4 mb-8 items-stretch">
                {/* Search bar giữ nguyên style của bạn */}
                <div className="relative flex-[4]">
                  <MagnifyingGlassIcon className="searchIcon" />
                  <input
                    type="text"
                    placeholder="Tìm kiếm sản phẩm..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="searchInput w-full"
                  />
                </div>

                {/* Dropdown chi nhánh - chỉ hiển thị tên, tooltip địa chỉ */}
                <div className="relative flex-[1] min-w-[240px]">
                  <select
                    value={selectedBranchId ?? ""}
                    onChange={(e) => {
                      setSelectedBranchId(
                        e.target.value ? Number(e.target.value) : null
                      );
                      setBranchId(
                        e.target.value ? Number(e.target.value) : null
                      );
                    }}
                    className="w-full px-4 py-3.5 pr-12 bg-white border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent cursor-pointer appearance-none transition-all hover:border-green-400"
                  >
                    <option value="">Không lọc theo chi nhánh</option>
                    {branches.map((branch: any) => (
                      <option key={branch.id} value={branch.id}>
                        {branch.name}
                      </option>
                    ))}
                  </select>

                  {/* Icon dropdown đẹp hơn */}
                  <ChevronDownIcon className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none transition-transform duration-200" />
                </div>
              </div>

              {/* Hiển thị thông tin chi nhánh đã chọn - kéo dài từ search tới cuối dropdown */}
              {selectedBranchId && (
                <div className="branchInfoDisplay mb-8">
                  <div className="branchInfoContent">
                    <MapPinIcon className="branchInfoIcon" />
                    <div className="branchInfoText">
                      <span className="branchInfoName">
                        {branches.find((b) => b.id === selectedBranchId)?.name}
                      </span>
                      <span className="branchInfoAddress">
                        {branches.find((b) => b.id === selectedBranchId)
                          ?.address?.fullAddress || "Chưa có địa chỉ"}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Loading & danh sách sản phẩm */}
              {loading || loadingBranches ? (
                <p className="text-center text-green-700 text-lg">
                  Đang tải...
                </p>
              ) : filteredAndSortedItems.length === 0 ? (
                <p className="text-center text-gray-600 text-lg py-8">
                  Không tìm thấy sản phẩm nào
                </p>
              ) : (
                <>
                  <div className="menuGrid">
                    {currentItems.map((item: any) => {
                      // Kiểm tra tồn kho chỉ khi đã chọn chi nhánh
                      const quantity =
                        selectedBranchId !== null
                          ? getItemQuantity(item.id, selectedBranchId)
                          : Infinity; // Không chọn chi nhánh → coi như luôn có hàng

                      const isOutOfStock = quantity === 0;
                      const isDisabled =
                        selectedBranchId !== null && isOutOfStock;

                      return (
                        <div
                          key={item.id}
                          className={`menuCard relative ${
                            isOutOfStock
                              ? "out-of-stock opacity-80"
                              : "hover:-translate-y-1"
                          }`}
                          onClick={() =>
                            !isDisabled && navigate(`/product/${item.id}`)
                          }
                        >
                          {/* Hình ảnh */}
                          <div className="menuImageWrapper">
                            {item.imageURL ? (
                              <img
                                src={item.imageURL}
                                alt={item.name}
                                className="menuImage"
                              />
                            ) : (
                              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                <span className="text-gray-400 text-sm">
                                  No image
                                </span>
                              </div>
                            )}
                          </div>

                          {/* Nội dung */}
                          <div className="menuCardContent">
                            <div>
                              <h3 className="menuTitle">{item.name}</h3>
                              <p className="menuPrice mt-3">
                                {item.price
                                  ? formatPrice(item.price)
                                  : "Liên hệ"}
                              </p>
                            </div>

                            {/* Nút Add to Cart - luôn hiển thị */}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                if (!isOutOfStock) handleAddToCart(item.id);
                              }}
                              disabled={isOutOfStock}
                              className="menuButton group"
                            >
                              <span className="flex items-center gap-2.5">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="menuButton-icon w-5 h-5 transition-transform duration-300"
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
                                {isOutOfStock
                                  ? "Hết hàng"
                                  : "Thêm vào giỏ hàng"}
                              </span>
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Pagination giữ nguyên */}
                  {totalPages > 1 && (
                    <div className="paginationContainer">
                      <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className={`paginationButton ${
                          currentPage === 1 ? "disabled" : "inactive"
                        }`}
                      >
                        <ChevronLeftIcon className="w-5 h-5" />
                      </button>
                      {[...Array(totalPages)].map((_, index) => {
                        const page = index + 1;
                        if (
                          page === 1 ||
                          page === totalPages ||
                          (page >= currentPage - 1 && page <= currentPage + 1)
                        ) {
                          return (
                            <button
                              key={page}
                              onClick={() => handlePageChange(page)}
                              className={`paginationButton ${
                                currentPage === page ? "active" : "inactive"
                              }`}
                            >
                              {page}
                            </button>
                          );
                        } else if (
                          page === currentPage - 2 ||
                          page === currentPage + 2
                        ) {
                          return (
                            <span key={page} className="text-gray-400">
                              ...
                            </span>
                          );
                        }
                        return null;
                      })}
                      <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className={`paginationButton ${
                          currentPage === totalPages ? "disabled" : "inactive"
                        }`}
                      >
                        <ChevronRightIcon className="w-5 h-5" />
                      </button>
                      <span className="paginationInfo">
                        Trang {currentPage} / {totalPages}
                      </span>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </section>
      </div>
      <RequireAuthModal
        open={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </>
  );
}
