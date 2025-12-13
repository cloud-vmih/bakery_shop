import { useEffect, useState } from "react";
import "../styles/auth.css";
import toast from "react-hot-toast";
import { getMenu } from "../services/menu.services";
import { addToCart } from "../services/cart.services";
import { useNavigate } from 'react-router-dom';
import { useUser } from "../context/authContext";
import { getWishlist, addToWishlist, removeFromWishlist, Item } from "../services/wishlist.service";

export default function Menu() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useUser();
  const navigate = useNavigate();
  const [wishlist, setWishlist] = useState<number[]>([]);

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

  // Load wishlist nếu user đăng nhập
  useEffect(() => {
    if (!user) return;

    getWishlist().then(data => {
      setWishlist(
        data.map(i => i.id!).filter(Boolean)
      );
    });
  }, [user]);

  const handleAddToCart = async (itemId?: number) => {
    if (!itemId) return;
    try {
      await addToCart(itemId);
      toast.success("Đã thêm vào giỏ");
    } catch (err: any) {
      if (err?.message === "NEED_LOGIN") {
        toast.error("Vui lòng đăng nhập để thêm vào giỏ");
        navigate("/login");
        return;
      }
      toast.error("Thêm thất bại, vui lòng thử lại");
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

  const formatPrice = (price?: number) =>
    price ? price.toLocaleString("vi-VN") + " VNĐ" : "Liên hệ";

  return (
    <div className="auth-container">
      <div className="auth-card" style={{ maxWidth: "1200px" }}>
        <h2 className="text-3xl font-bold text-cyan-800 mb-2 text-center">
          Menu sản phẩm
        </h2>
        <p className="text-cyan-600 text-center mb-8 text-sm">
          Tất cả bánh đang có tại cửa hàng
        </p>

        {loading ? (
          <p className="text-center text-cyan-700">Đang tải...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
            {items.map((item) => (
              <div
                key={item.id}
                className="relative p-4 rounded-xl border shadow bg-white hover:shadow-xl transition-all duration-300 group"
              >
                {/* Nút wishlist */}
                <div className="absolute top-2 right-2 z-20">
                  <button
                    onClick={() => handleToggleWishlist(item.id)}
                    className="text-2xl"
                  >
                    {item.id && wishlist.includes(item.id) ? (
                      <span className="text-red-500">❤️</span>
                    ) : (
                      <span className="text-gray-400">🤍</span>
                    )}
                  </button>
                </div>

                {/* Nút thêm giỏ */}
                <div className="absolute inset-0 bg-cyan-900 bg-opacity-0 group-hover:bg-opacity-70 rounded-xl transition-all duration-300 flex items-center justify-center z-10">
                  <button
                    onClick={() => handleAddToCart(item.id)}
                    className="opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-300 bg-white text-cyan-800 font-bold py-3 px-8 rounded-full shadow-lg hover:bg-cyan-50 flex items-center gap-2"
                  >
                    Thêm vào giỏ
                  </button>
                </div>

                {/* Hình ảnh */}
                {item.imageURL ? (
                  <img
                    src={item.imageURL}
                    alt={item.name}
                    className="w-full h-48 object-cover rounded-lg mb-3"
                  />
                ) : (
                  <div className="bg-gray-200 border-2 border-dashed rounded-lg w-full h-48 mb-3 flex items-center justify-center">
                    <span className="text-gray-400">No image</span>
                  </div>
                )}

                <h3 className="font-bold text-lg text-cyan-800 mb-1">{item.name}</h3>
                <p className="text-sm text-cyan-700 mb-2 line-clamp-2">
                  {item.description || "Bánh ngọt thơm ngon"}
                </p>
                <p className="font-bold text-xl text-cyan-900">
                  {formatPrice(item.price)}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}