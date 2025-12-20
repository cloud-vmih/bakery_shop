// import { useEffect, useState } from "react";
// import "../styles/auth.css";
// import toast from "react-hot-toast";
// import { getMenu } from "../services/menu.services";
// import { addToCart } from "../services/cart.services";
// import { useNavigate } from "react-router-dom";
// import { useUser } from "../context/authContext";
// import RequireAuthModal from "../components/RequireAuthModal";

// export default function Menu() {
//   const [items, setItems] = useState<any[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [showAuthModal, setShowAuthModal] = useState(false);

//   const { user } = useUser();
//   const navigate = useNavigate();

//   useEffect(() => {
//     const loadMenu = async () => {
//       try {
//         const data = await getMenu();
//         setItems(data);
//       } catch (err: any) {
//         toast.error(err.message || "Không thể tải danh sách sản phẩm");
//       } finally {
//         setLoading(false);
//       }
//     };
//     loadMenu();
//   }, []);

//   const handleAddToCart = async (itemId: number) => {
//     try {
//       await addToCart(itemId);
//       toast.success("Đã thêm vào giỏ hàng!");
//     } catch (err: any) {
//       if (err?.message === "NEED_LOGIN") {
//         setShowAuthModal(true);
//         return; // ⛔ DỪNG LUỒNG – KHÔNG TOAST
//       }

//       // ❗ Chỉ toast với lỗi KHÁC login
//       toast.error("Thêm thất bại, vui lòng thử lại");
//       console.error("Lỗi thêm giỏ:", err);
//     }
//   };

//   const formatPrice = (price: number) => {
//     return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " VNĐ";
//   };

//   return (
//     <>
//       <div className="auth-container">
//         <div className="auth-card" style={{ maxWidth: "1200px" }}>
//           <h2 className="text-3xl font-bold text-cyan-800 mb-2 text-center">
//             Menu sản phẩm
//           </h2>
//           <p className="text-cyan-600 text-center mb-8 text-sm">
//             Tất cả bánh đang có tại cửa hàng
//           </p>

//           {loading ? (
//             <p className="text-center text-cyan-700">Đang tải...</p>
//           ) : (
//             <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
//               {items?.map((item: any) => (
//                 <div
//                   key={item.id}
//                   className="relative p-4 rounded-xl border shadow bg-white hover:shadow-xl transition-all duration-300 group"
//                 >
//                   <div className="absolute inset-0 bg-cyan-900 bg-opacity-0 group-hover:bg-opacity-70 rounded-xl transition-all duration-300 flex items-center justify-center z-10">
//                     <button
//                       onClick={() => handleAddToCart(item.id)}
//                       className="opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-300 bg-white text-cyan-800 font-bold py-3 px-8 rounded-full shadow-lg hover:bg-cyan-50 flex items-center gap-2"
//                     >
//                       Thêm vào giỏ
//                     </button>
//                   </div>

//                   <img
//                     src={item.imageURL}
//                     alt={item.name}
//                     loading="lazy"
//                     className="w-full h-48 object-cover rounded-lg mb-3"
//                   />

//                   <h3 className="font-bold text-lg text-cyan-800 mb-1">
//                     {item.name}
//                   </h3>

//                   <p className="text-sm text-cyan-700 mb-2 line-clamp-2">
//                     {item.description || "Bánh ngọt thơm ngon"}
//                   </p>

//                   <p className="font-bold text-xl text-cyan-900">
//                     {formatPrice(item.price)}
//                   </p>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       </div>

//       <RequireAuthModal
//         open={showAuthModal}
//         onClose={() => setShowAuthModal(false)}
//       />
//     </>
//   );
// }
import { useEffect, useState } from "react";
import "../styles/auth.css";
import toast from "react-hot-toast";
import { getMenu } from "../services/menu.service";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import RequireAuthModal from "../components/RequireAuthModal";

export default function Menu() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const { user } = useUser();
  const { addToCart } = useCart();
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

  const formatPrice = (price: number) =>
    price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " VNĐ";

  return (
    <>
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
                  {/* ADD TO CART */}
                  <div className="absolute inset-0 bg-cyan-900 bg-opacity-0 group-hover:bg-opacity-70 rounded-xl transition-all duration-300 flex items-center justify-center z-10">
                    <button
                      onClick={() => handleAddToCart(item.id)}
                      className="opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-300 bg-white text-cyan-800 font-bold py-3 px-8 rounded-full shadow-lg hover:bg-cyan-50"
                    >
                      Thêm vào giỏ
                    </button>
                  </div>

                  <img
                    src={item.imageURL}
                    alt={item.name}
                    loading="lazy"
                    className="w-full h-48 object-cover rounded-lg mb-3"
                  />

                  <h3 className="font-bold text-lg text-cyan-800 mb-1">
                    {item.name}
                  </h3>

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

      <RequireAuthModal
        open={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </>
  );
}
