// pages/Wishlist.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getWishlist, removeFromWishlist, Item } from "../services/wishlist.service";
import toast from "react-hot-toast";
import ChatBox from "../components/chat/ChatBox";
// import "../styles/wishlist.css";

export default function WishlistPage() {
  const [wishlist, setWishlist] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    try {
      setLoading(true);
      const items = await getWishlist();
      setWishlist(items);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (itemId?: number) => {
    try {
      if (!itemId) return;
      await removeFromWishlist(itemId);
      toast.success("Đã xóa sản phẩm khỏi wishlist");
      setWishlist(prev => prev.filter(item => item.id !== itemId));
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const goToProductDetail = (itemId?: number) => {
    toast.error(`Chức năng đang được phát triển!, ${ itemId }`);
    if (!itemId) return;
    navigate(`/product/${itemId}`);
  };

  if (loading) return <p className="text-center mt-6">Đang tải danh sách yêu thích...</p>;

  return (
    <div className="wishlist-container px-4 py-6">
      <h2 className="text-3xl font-bold text-cyan-800 mb-6 text-center">Danh sách yêu thích</h2>

      {wishlist.length === 0 ? (
        <p className="text-center text-gray-500">Bạn chưa thêm sản phẩm nào vào wishlist.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {wishlist.map(item => (
            <div
              key={item.id}
              className="relative border rounded-lg shadow p-4 flex flex-col hover:shadow-lg transition"
            >
              {/* ❤️ Icon wishlist */}
              <button
                onClick={() => handleRemove(item.id)}
                className="absolute top-2 right-2 text-2xl z-10"
                title="Xóa khỏi wishlist"
              >
                <span className="text-red-500 hover:scale-110 transition">
                  ❤️
                </span>
              </button>

              <img
                src={item.imageURL}
                alt={item.name}
                className="w-full h-48 object-cover cursor-pointer mb-3 rounded"
                onClick={() => goToProductDetail(item.id)}
              />

              <div className="flex-1 flex flex-col justify-between">
                <h3 className="font-semibold text-lg mb-1">{item.name}</h3>

                <p className="font-bold text-cyan-700 mb-3">
                  {item.price?.toLocaleString()} VND
                </p>

                <button
                  className="bg-cyan-600 text-white px-3 py-2 rounded hover:bg-cyan-700"
                  onClick={() => goToProductDetail(item.id)}
                >
                  Xem chi tiết
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      <ChatBox />
    </div>
  );
}
