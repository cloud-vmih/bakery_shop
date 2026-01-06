import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { MagnifyingGlassIcon, ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

import "../styles/menu.css";
import { useUser } from "../context/AuthContext";
import { getWishlist, removeFromWishlist } from "../services/wishlist.service";
import { PriceDisplay } from "../components/ItemPrice";
import { useInventory } from "../context/InventoryContext"
import WishlistIcon from "../components/WishlistIcon";

export default function WishlistPage() {
  const navigate = useNavigate();
  const { user } = useUser();

  const [wishlistItems, setWishlistItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [priceSort, setPriceSort] = useState<"none" | "low-to-high" | "high-to-low">("none");
  const [currentPage, setCurrentPage] = useState(1);
  const { branchId, findStockBranch } = useInventory();
  const itemsPerPage = 12;

  const categories = [
    { value: "CAKE", label: "Bánh ngọt" },
    { value: "BREAD", label: "Bánh mì" },
    { value: "COOKIE", label: "Bánh quy" },
    { value: "OTHER", label: "Khác" },
  ];

  useEffect(() => {
    if (!user) return;

    const loadWishlist = async () => {
      try {
        const data = await getWishlist();
        setWishlistItems(data);
      } catch (err: any) {
        toast.error("Không thể tải wishlist");
      } finally {
        setLoading(false);
      }
    };

    loadWishlist();
  }, [user]);

  const handleRemoveWishlist = async (itemId: number) => {
    try {
      await removeFromWishlist(itemId);
      setWishlistItems(prev => prev.filter(i => i.id !== itemId));
      toast.success("Đã xóa khỏi wishlist");
    } catch {
      toast.error("Xóa thất bại");
    }
  };

  // Lọc + Sắp xếp
  const filteredItems = useMemo(() => {
    let filtered = [...wishlistItems];

    // Search
    if (searchQuery.trim()) {
      filtered = filtered.filter(item =>
        item.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Category
    if (selectedCategory) {
      filtered = filtered.filter(item => item.category === selectedCategory);
    }

    // Price sort
    if (priceSort === "low-to-high") {
      filtered.sort((a, b) => (a.price || 0) - (b.price || 0));
    } else if (priceSort === "high-to-low") {
      filtered.sort((a, b) => (b.price || 0) - (a.price || 0));
    }

    return filtered;
  }, [wishlistItems, searchQuery, selectedCategory, priceSort]);

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = filteredItems.slice(startIndex, endIndex);

  // Reset page khi filter thay đổi
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory, priceSort]);

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
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
                className={`categoryItem ${selectedCategory === null ? "active" : ""}`}
              >
                <span className="categoryIndicator"></span>
                <span className="categoryLabel">Tất cả</span>
              </button>

              {categories.map(cat => (
                <button
                  key={cat.value}
                  onClick={() => setSelectedCategory(cat.value)}
                  className={`categoryItem ${selectedCategory === cat.value ? "active" : ""}`}
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
                  className={`priceSortButton ${priceSort === "none" ? "active" : ""}`}
                >
                  <span className="priceSortIndicator"></span>
                  <span>Mặc định</span>
                </button>

                <button
                  onClick={() => setPriceSort("low-to-high")}
                  className={`priceSortButton ${priceSort === "low-to-high" ? "active" : ""}`}
                >
                  <span className="priceSortIndicator"></span>
                  <span>Thấp → Cao</span>
                </button>

                <button
                  onClick={() => setPriceSort("high-to-low")}
                  className={`priceSortButton ${priceSort === "high-to-low" ? "active" : ""}`}
                >
                  <span className="priceSortIndicator"></span>
                  <span>Cao → Thấp</span>
                </button>
              </div>
            </div>
          </aside>

          {/* Content */}
          <div className="menuContentArea">
            {/* Title */}
            <div className="mb-6">
              <h2 className="menuPageTitle">Wishlist của bạn ❤️</h2>
              <p className="menuPageSubtitle">Những sản phẩm bạn đã yêu thích</p>
            </div>

            {/* Search */}
            <div className="mb-8 relative">
              <MagnifyingGlassIcon className="searchIcon" />
              <input
                type="text"
                placeholder="Tìm kiếm trong wishlist..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="searchInput w-full"
              />
            </div>

            {/* Content Grid */}
            {loading ? (
              <p className="text-center text-green-700 text-lg">Đang tải...</p>
            ) : filteredItems.length === 0 ? (
              <p className="text-center text-gray-600 text-lg py-8">
                Wishlist của bạn đang trống 💔
              </p>
            ) : (
              <>
                <div className="menuGrid">
                  {currentItems.map(item => (
                    <div
                      key={item.id}
                      className="menuCard relative hover:-translate-y-1"
                      onClick={() => {
                          const branchQuery = findStockBranch(item.id) ? `?branch=${findStockBranch(item.id)}` : branchId;
                          navigate(`/product/${item.id}/${branchQuery}`)}}
                    >
                      {/* Wishlist icon */}
                      <div className="absolute top-3 right-3 z-20">
                        <WishlistIcon
                        liked={true}
                        onToggle={() => handleRemoveWishlist(item.id)}
                        size={24}
                      />
                      </div>

                      {/* Image */}
                      <div className="menuImageWrapper">
                        {item.imageURL ? (
                          <img
                            src={item.imageURL}
                            alt={item.name}
                            className="menuImage"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                            <span className="text-gray-400 text-sm">No image</span>
                          </div>
                        )}
                      </div>

                      {/* Info */}
                      <div className="menuCardContent">
                        <div>
                          <h3 className="menuTitle">{item.name}</h3>
                          <p className="menuPrice mt-3">
                            <PriceDisplay item={item} />
                          </p>
                        </div>

                        <button
                          className="menuButton"
                          onClick={e => {
                            e.stopPropagation();
                            const branchQuery = findStockBranch(item.id) ? `?branch=${findStockBranch(item.id)}` : branchId;
                            navigate(`/product/${item.id}/${branchQuery}`);
                          }}
                        >
                          Xem chi tiết
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="paginationContainer">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className={`paginationButton ${currentPage === 1 ? 'disabled' : 'inactive'}`}
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
                            className={`paginationButton ${currentPage === page ? 'active' : 'inactive'}`}
                          >
                            {page}
                          </button>
                        );
                      } else if (page === currentPage - 2 || page === currentPage + 2) {
                        return <span key={page} className="text-gray-400">...</span>;
                      }
                      return null;
                    })}

                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className={`paginationButton ${currentPage === totalPages ? 'disabled' : 'inactive'}`}
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
  );
}
