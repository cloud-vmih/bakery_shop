import { useEffect, useState, useMemo } from "react";
import "../styles/menu.css";
import toast from "react-hot-toast";
import { getMenu } from "../services/menu.services";
import { addToCart } from "../services/cart.services";
import { useNavigate } from 'react-router-dom';
import { useUser } from "../context/authContext";
import { Header } from "../components/Header";
import { getWishlist, addToWishlist, removeFromWishlist, Item } from "../services/wishlist.service";
import { ChevronLeftIcon, ChevronRightIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import ChatBox from "../components/chat/ChatBox";

export default function MenuPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [priceSort, setPriceSort] = useState<"none" | "low-to-high" | "high-to-low">("none");
  const itemsPerPage = 9;
  const { user } = useUser();
  const [wishlist, setWishlist] = useState<number[]>([]);
  const navigate = useNavigate();

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
        if (!user) return;

        getWishlist().then(data => {
            setWishlist(
                data.map(i => i.id!).filter(Boolean)
            );
        });
    }, [user]);

  const handleAddToCart = async (itemId: number) => {
    try {
      await addToCart(itemId);
      toast.success("Đã thêm vào giỏ hàng!");
    } catch (err: any) {
      if (err?.message === "NEED_LOGIN") {
        navigate("/login")
        toast.error("Vui lòng đăng nhập để thêm vào giỏ");
        return;
      }
      toast.error("Thêm thất bại, vui lòng thử lại");
      console.error("Lỗi thêm giỏ:", err);
    }
  };
    const handleToggleWishlist = async (itemId?: number) => {
        if (!itemId) return;
        if (!user) {
            toast.error("Vui lòng đăng nhập để sử dụng wishlist");
            navigate("/login");
            return;
        }

        try {
            if (wishlist.includes(itemId)) {
                await removeFromWishlist(itemId);
                setWishlist(prev => prev.filter(id => id !== itemId));
                toast.success("Đã xóa khỏi wishlist");
            } else {
                await addToWishlist(itemId);
                setWishlist(prev => [...prev, itemId]);
                toast.success("Đã thêm vào wishlist");
            }
        } catch (err: any) {
            toast.error(err.message || "Có lỗi xảy ra");
        }
    };

  const formatPrice = (price: number) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " VNĐ";
  };

  // Lọc và sắp xếp sản phẩm
  const filteredAndSortedItems = useMemo(() => {
    let filtered = [...items];

    // Lọc theo tìm kiếm
    if (searchQuery.trim()) {
      filtered = filtered.filter(item =>
        item.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Lọc theo danh mục
    if (selectedCategory) {
      filtered = filtered.filter(item => item.category === selectedCategory);
    }

    // Sắp xếp theo giá
    if (priceSort === "low-to-high") {
      filtered.sort((a, b) => (a.price || 0) - (b.price || 0));
    } else if (priceSort === "high-to-low") {
      filtered.sort((a, b) => (b.price || 0) - (a.price || 0));
    }

    return filtered;
  }, [items, searchQuery, selectedCategory, priceSort]);

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
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
          <div className="sectionHeader">
            <h2 className="titleGreen">MENU</h2>
          </div>

          <div className="menuLayout">
            <aside className="categorySidebar">
              <div className="sidebarHeader">
                <h3 className="sidebarTitle">Danh mục</h3>
              </div>

              <div className="categoryList">
                <button
                  onClick={() => setSelectedCategory(null)}
                  className={`categoryItem ${selectedCategory === null ? 'active' : ''}`}
                >
                  <span className="categoryIndicator"></span>
                  <span className="categoryLabel">Tất cả</span>
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.value}
                    onClick={() => setSelectedCategory(cat.value)}
                    className={`categoryItem ${selectedCategory === cat.value ? 'active' : ''}`}
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
                    className={`priceSortButton ${priceSort === "none" ? 'active' : ''}`}
                  >
                    <span className="priceSortIndicator"></span>
                    <span>Mặc định</span>
                  </button>
                  <button
                    onClick={() => setPriceSort("low-to-high")}
                    className={`priceSortButton ${priceSort === "low-to-high" ? 'active' : ''}`}
                  >
                    <span className="priceSortIndicator"></span>
                    <span>Thấp → Cao</span>
                  </button>
                  <button
                    onClick={() => setPriceSort("high-to-low")}
                    className={`priceSortButton ${priceSort === "high-to-low" ? 'active' : ''}`}
                  >
                    <span className="priceSortIndicator"></span>
                    <span>Cao → Thấp</span>
                  </button>
                </div>
              </div>
            </aside>

            <div className="menuContentArea">
              <div className="searchBar">
                <MagnifyingGlassIcon className="searchIcon" />
                <input
                  type="text"
                  placeholder="Tìm kiếm sản phẩm..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="searchInput"
                />
              </div>

              {loading ? (
                <p className="text-center text-green-700 text-lg">Đang tải...</p>
              ) : (
                <>
                  {filteredAndSortedItems.length === 0 ? (
                    <p className="text-center text-gray-600 text-lg py-8">
                      Không tìm thấy sản phẩm nào
                    </p>
                  ) : (
                    <>
                      <div className="menuGrid">
                        {currentItems?.map((item: any) => (

                          <div
                            key={item.id}
                            className="menuCard"
                            onClick={() => navigate(`/product/${item.id}`)}
                          >
                              {/* Nút wishlist */}
                              <div className="absolute top-2 right-2 z-20">
                                  <button
                                      onClick={(e) => {
                                          e.stopPropagation(); //Ngăn gọi onClick vào product details
                                          handleToggleWishlist(item.id);
                                      }}
                                      className="text-2xl"
                                  >
                                      {item.id && wishlist.includes(item.id) ? (
                                          <span className="text-red-500">❤️</span>
                                      ) : (
                                          <span className="text-gray-400">🤍</span>
                                      )}
                                  </button>
                              </div>
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
                            <div className="menuCardContent">
                              <h3 className="menuTitle">{item.name}</h3>
                              <p className="menuPrice">
                                {item.price ? formatPrice(item.price) : "Liên hệ"}
                              </p>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleAddToCart(item.id);
                                }}
                                className="menuButton"
                              >
                                <span className="menuButton-content">
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="menuButton-icon"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                  >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                  </svg>
                                  Thêm vào giỏ
                                </span>
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>

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
                </>
              )}
            </div>
          </div>
        </section>
      </div>
      <ChatBox />
    </>
  );
}