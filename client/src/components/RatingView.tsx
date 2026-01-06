import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { getRatingsByItem, Rating } from "../services/rating.service";

interface RatingViewProps {
  itemID: number;
}

const RatingView = ({ itemID }: RatingViewProps) => {
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRatings = async () => {
      try {
        setLoading(true);
        const data = await getRatingsByItem(itemID);
        setRatings(data);
      } catch (err: any) {
        toast.error(err.message || "Không tải được đánh giá");
      } finally {
        setLoading(false);
      }
    };
    fetchRatings();
  }, [itemID]);

  if (loading) return <p className="text-gray-500 mt-4 text-center">Đang tải đánh giá...</p>;
  if (ratings.length === 0) return <p className="text-gray-500 mt-4 text-center">Chưa có đánh giá nào.</p>;

  return (
    <div className="ratingsContainer mt-8 max-w-4xl mx-auto space-y-4">
      <h2 className="text-2xl font-bold mb-4 text-center text-cyan-700">Đánh giá của khách hàng</h2>
      {ratings.map(r => (
        <div
          key={r.id}
          className="flex flex-col md:flex-row p-4 md:p-5 border rounded-xl shadow-md bg-white hover:shadow-lg transition"
        >
          <div className="flex-shrink-0">
            <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-cyan-100 flex items-center justify-center text-cyan-600 font-semibold text-lg">
              {r.customer?.fullName?.[0] || "U"}
            </div>
          </div>
          <div className="mt-2 md:mt-0 md:ml-4 flex-1">
            <p className="font-semibold text-cyan-800">{r.customer?.fullName || "Người dùng"}</p>
            <p className="text-gray-700 mt-1 leading-relaxed">{r.contents}</p>
            <p className="text-gray-400 text-sm mt-2">{new Date(r.createAt).toLocaleString()}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RatingView;