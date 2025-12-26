import { useEffect, useState } from "react";
import {getMyPoints} from "../services/memberpoint.service";
import { toast } from "react-toastify";
//import { useNavigate } from "react-router-dom";

interface PointRecord {
  id: number;
  orderAmount: number;
  earnedPoints: number;
  note: string;
  createdAt: string;
}

export default function MembershipPoints() {
  const [totalPoints, setTotalPoints] = useState(0);
  const [history, setHistory] = useState<PointRecord[]>([]);
  const [loading, setLoading] = useState(true);
  //const navigate = useNavigate();

  useEffect(() => {
    const loadPoints = async () => {
      try {
        const data = await getMyPoints();
        setTotalPoints(data.totalPoints);
        setHistory(data.history);
      } catch {
        toast.error("Không tải được thông tin điểm thành viên");
      } finally {
        setLoading(false);
      }
    };
    loadPoints();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8 text-emerald-800">Điểm Thành Viên</h1>

      <div className="bg-gradient-to-r from-emerald-50 to-green-50 p-8 rounded-2xl text-center shadow-lg mb-10">
        <p className="text-xl text-gray-700">Tổng điểm hiện tại</p>
        <p className="text-6xl font-extrabold text-emerald-600 mt-4">{totalPoints.toLocaleString()}</p>
        <p className="text-sm text-gray-500 mt-2">điểm</p>
      </div>

      <h2 className="text-2xl font-semibold mb-6">Lịch sử tích điểm</h2>

      {loading ? (
        <p className="text-center py-10">Đang tải...</p>
      ) : history.length === 0 ? (
        <p className="text-center text-gray-500 py-10">Chưa có lịch sử tích điểm</p>
      ) : (
        <div className="space-y-4">
          {history.map((record) => (
            <div key={record.id} className="bg-white p-5 rounded-xl shadow border hover:shadow-md transition">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium text-gray-800">{record.note}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    Đơn hàng: {Number(record.orderAmount).toLocaleString()}đ •{" "}
                    {new Date(record.createdAt).toLocaleDateString("vi-VN")}
                  </p>
                </div>
                <span className={`text-3xl font-bold ${record.earnedPoints > 0 ? "text-green-600" : "text-gray-400"}`}>
                  {record.earnedPoints > 0 ? "+" : ""}{record.earnedPoints}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}