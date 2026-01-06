import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { useUser } from "../context/AuthContext";
import {
  getRatingsByItem,
  addOrUpdateRating,
  deleteRating,
  Rating as RatingType,
} from "../services/rating.service";
import ChatBox from "../components/chat/ChatBox";
import { orderService } from "../services/order.service";

interface ItemInfo {
  id: number;
  name: string;
}

export default function RatingPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const { user } = useUser();
  const currentUserID = user?.id;

  const [items, setItems] = useState<ItemInfo[]>([]);
  const [ratingsMap, setRatingsMap] = useState<Record<number, RatingType[]>>({});
  const [newContents, setNewContents] = useState<Record<number, string>>({});
  const [editing, setEditing] = useState<Record<number, boolean>>({});
  const [loading, setLoading] = useState(true);

  // Lấy sản phẩm từ order
  useEffect(() => {
    if (!orderId) return;

    const fetchItems = async () => {
      try {
        setLoading(true);
        const res = await orderService.getOrderStatus(Number(orderId));
        const itemList: ItemInfo[] = res.items.map((i: any) => ({ id: i.item.id, name: i.item.name }));
        setItems(itemList);
      } catch (err) {
        toast.error("Không thể lấy sản phẩm trong đơn hàng");
      } finally {
        setLoading(false);
      }
    };
    fetchItems();
  }, [orderId]);

  // Lấy rating cho từng sản phẩm
  useEffect(() => {
    const fetchRatings = async () => {
      const map: Record<number, RatingType[]> = {};
      for (const item of items) {
        try {
          map[item.id] = await getRatingsByItem(item.id);
        } catch (err: any) {
          toast.error(err.message);
        }
      }
      setRatingsMap(map);
    };
    if (items.length > 0) fetchRatings();
  }, [items]);

  const handleSubmit = async (itemID: number) => {
    const content = newContents[itemID]?.trim();
    if (!content) return toast.error("Nội dung không được trống");

    try {
      await addOrUpdateRating(itemID, content);
      toast.success("Đánh giá thành công");
      setEditing(prev => ({ ...prev, [itemID]: false }));
      setNewContents(prev => ({ ...prev, [itemID]: "" }));

      const updated = await getRatingsByItem(itemID);
      setRatingsMap(prev => ({ ...prev, [itemID]: updated }));
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleDelete = async (itemID: number) => {
    const userRating = ratingsMap[itemID]?.find(r => r.customer?.id === currentUserID);
    if (!userRating) return;

    try {
      await deleteRating(userRating.id);
      toast.success("Xóa đánh giá thành công");

      const updated = await getRatingsByItem(itemID);
      setRatingsMap(prev => ({ ...prev, [itemID]: updated }));
      setEditing(prev => ({ ...prev, [itemID]: false }));
      setNewContents(prev => ({ ...prev, [itemID]: "" }));
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  if (loading) return <p className="text-center mt-6 text-gray-500">Đang tải sản phẩm...</p>;

  return (
    <div className="max-w-4xl mx-auto space-y-8 p-4">
      {items.map(item => {
        const userRating = ratingsMap[item.id]?.find(r => r.customer?.id === currentUserID);
        const isEditing = editing[item.id];

        return (
          <div key={item.id} className="p-6 border rounded-lg shadow hover:shadow-lg transition duration-200">
            <h3 className="text-2xl font-bold mb-4 text-cyan-700">Đánh giá sản phẩm: {item.name}</h3>

            {/* Form đánh giá */}
            {(!userRating || isEditing) && (
              <div className="mb-4 flex flex-col gap-2">
                <textarea
                  placeholder="Viết đánh giá của bạn..."
                  value={newContents[item.id] || userRating?.contents || ""}
                  onChange={e => setNewContents(prev => ({ ...prev, [item.id]: e.target.value }))}
                  className="border rounded-md p-3 resize-none focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                  rows={4}
                />
                <div className="flex gap-3">
                  <button
                    className="bg-cyan-600 text-white px-4 py-2 rounded-md hover:bg-cyan-700 transition"
                    onClick={() => handleSubmit(item.id)}
                  >
                    {userRating ? "Lưu chỉnh sửa" : "Gửi đánh giá"}
                  </button>
                  {userRating && (
                    <button
                      className="bg-gray-300 px-4 py-2 rounded-md hover:bg-gray-400 transition"
                      onClick={() => setEditing(prev => ({ ...prev, [item.id]: false }))}
                    >
                      Hủy
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Xem đánh giá */}
            {userRating && !isEditing && (
              <div className="space-y-3">
                <div className="border-l-4 border-cyan-500 pl-4 py-2 bg-gray-50 rounded-md flex justify-between items-start">
                  <div>
                    <p className="font-semibold text-cyan-800">{userRating.customer?.fullName || "Bạn"}</p>
                    <p className="text-gray-700 mt-1">{userRating.contents}</p>
                    <p className="text-gray-400 text-sm mt-1">{new Date(userRating.createAt).toLocaleString()}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition text-sm md:text-base"
                      onClick={() => setEditing(prev => ({ ...prev, [item.id]: true }))}
                    >
                      Chỉnh sửa
                    </button>
                    <button
                      className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition text-sm md:text-base"
                      onClick={() => handleDelete(item.id)}
                    >
                      Xóa
                    </button>
                  </div>
                </div>
              </div>
            )}

          </div>
        );
      })}
      <ChatBox />
    </div>
  );
}