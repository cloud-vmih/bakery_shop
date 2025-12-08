import { useEffect, useState } from "react";
import "../styles/auth.css";
import toast from "react-hot-toast";
import { getMenu } from "../services/menu.services";
import { addToCart } from "../services/cart.services";

export default function Menu() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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

  const handleAddToCart = async (itemId: number) => {
    try {
      await addToCart(itemId);
    } catch (err: any) {
      if (err?.message === "NEED_LOGIN") {
        toast.error("Vui lòng đăng nhập để thêm vào giỏ");
        return;
      }
      toast.error("Thêm thất bại, vui lòng thử lại");
      console.error("Lỗi thêm giỏ:", err);
    }
  };

  const formatPrice = (price: number) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " VNĐ";
  };

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
            {/* DÙNG ?. ĐỂ TRÁNH LỖI UNDEFINED */}
            {items?.map((item: any) => (
              <div
                key={item.id}
                className="relative p-4 rounded-xl border shadow bg-white hover:shadow-xl transition-all duration-300 group"
              >
                {/* Nút thêm giỏ hiện khi hover */}
                <div className="absolute inset-0 bg-cyan-900 bg-opacity-0 group-hover:bg-opacity-70 rounded-xl transition-all duration-300 flex items-center justify-center z-10">
                  <button
                    onClick={() => handleAddToCart(item.id)}
                    className="opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-300 bg-white text-cyan-800 font-bold py-3 px-8 rounded-full shadow-lg hover:bg-cyan-50 flex items-center gap-2"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-6 h-6"
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

                <h3 className="font-bold text-lg text-cyan-800 mb-1">
                  {item.name}
                </h3>

                <p className="text-sm text-cyan-700 mb-2 line-clamp-2">
                  {item.description || "Bánh ngọt thơm ngon"}
                </p>

                <p className="font-bold text-xl text-cyan-900">
                  {item.price ? formatPrice(item.price) : "Liên hệ"}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}