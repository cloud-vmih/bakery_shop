// pages/Rating.tsx
import { useEffect, useState } from "react";
import { getRatingsByItem, addOrUpdateRating, deleteRating, Rating as RatingType } from "../services/rating.service";
import toast from "react-hot-toast";

interface Props {
  itemID: number;
  currentUserID: number; // user hiện tại từ context/auth
}

export default function RatingPage({ itemID, currentUserID }: Props) {
  const [ratings, setRatings] = useState<RatingType[]>([]);
  const [newContent, setNewContent] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRatings();
  }, [itemID]);

  const fetchRatings = async () => {
    try {
      setLoading(true);
      const data = await getRatingsByItem(itemID);
      setRatings(data);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!newContent.trim()) return toast.error("Nội dung không được trống");
    try {
      await addOrUpdateRating(itemID, newContent);
      toast.success("Đánh giá thành công");
      setNewContent("");
      fetchRatings();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleDelete = async (r: RatingType) => {
    try {
      await deleteRating(r.itemID);
      toast.success("Xóa đánh giá thành công");
      fetchRatings();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  return (
    <div className="p-4 border rounded shadow">
      <h3 className="text-xl font-bold mb-3">Đánh giá sản phẩm</h3>

      {/* Thêm hoặc sửa rating */}
      <div className="mb-4 flex flex-col">
        <textarea
          placeholder="Viết đánh giá của bạn..."
          value={newContent}
          onChange={(e) => setNewContent(e.target.value)}
          className="border p-2 rounded mb-2"
          rows={3}
        />
        <button
          className="bg-cyan-600 text-white px-3 py-1 rounded hover:bg-cyan-700"
          onClick={handleSubmit}
        >
          Gửi đánh giá
        </button>
      </div>

      {/* Danh sách rating */}
      {loading ? (
        <p>Đang tải đánh giá...</p>
      ) : ratings.length === 0 ? (
        <p>Chưa có đánh giá nào</p>
      ) : (
        <div className="space-y-3">
          {ratings.map((r) => (
            <div key={`${r.customerID}-${r.itemID}`} className="border-b pb-2 flex justify-between items-start">
              <div>
                <p className="font-semibold">{r.customer?.fullName || "Người dùng"}</p>
                <p className="text-gray-700">{r.contents}</p>
                <p className="text-gray-400 text-sm">{new Date(r.createAt).toLocaleString()}</p>
              </div>
              {r.customerID === currentUserID && (
                <button
                  className="text-red-500 hover:underline text-sm"
                  onClick={() => handleDelete(r)}
                >
                  Xóa
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
