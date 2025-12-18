import { useState, useEffect } from 'react';
import { getReviews, replyReview, deleteReview, Review } from '../services/review.services';
import '../styles/review.css';

const ManageReviews: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [filter, setFilter] = useState({ productName: '', dateFrom: '', unhandled: false });
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchReviews();
  }, [filter]);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const data = await getReviews(filter);
      setReviews(data);
      setError('');
    } catch (err) {
      setError('Lỗi tải danh sách đánh giá!');
    } finally {
      setLoading(false);
    }
  };

  const handleReply = async () => {
    if (!selectedReview || !replyContent.trim()) {
      setError('Nội dung phản hồi không hợp lệ!');
      return;
    }
    try {
      await replyReview(selectedReview.id, replyContent);
      setReplyContent('');
      setSelectedReview(null);
      fetchReviews(); // Refresh
      alert('Phản hồi thành công!');
    } catch (err) {
      setError('Lỗi gửi phản hồi!');
    }
  };

  const handleDelete = async () => {
    if (!selectedReview) return;
    try {
      await deleteReview(selectedReview.id);
      setSelectedReview(null);
      fetchReviews();
      alert('Xóa thành công!');
    } catch (err) {
      setError('Lỗi xóa đánh giá!');
    }
  };

  return (
    <div className="manage-reviews">
      <h1>Quản lý Đánh giá</h1>
      
      {/* Filter Form */}
      <div className="filter-section">
        <input
          type="text"
          placeholder="Tên Sản phẩm"
          value={filter.productName}
          onChange={(e) => setFilter({ ...filter, productName: e.target.value })}
        />
        <input
          type="date"
          value={filter.dateFrom}
          onChange={(e) => setFilter({ ...filter, dateFrom: e.target.value })}
        />
        <label>
          <input
            type="checkbox"
            checked={filter.unhandled}
            onChange={(e) => setFilter({ ...filter, unhandled: e.target.checked })}
          />
          Chưa xử lý
        </label>
      </div>

      {/* Reviews Table */}
{loading ? <p>Đang tải...</p> : (
  <div className="table-wrapper">
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Nội dung</th>
          <th>Sản phẩm</th>
          <th>Ngày tạo</th>
          <th>Trạng thái</th>
          <th>Số phản hồi</th> {/* Thêm cột này */}
          <th>Hành động</th>
        </tr>
      </thead>
      <tbody>
        {reviews.map((review) => (
          <tr key={review.id}>
            <td>{review.id}</td>
            <td>{review.contents}</td>
            <td>{review.item?.name || 'N/A'}</td>
            <td>{new Date(review.createdAt).toLocaleDateString()}</td>
            <td>{review.hasResponse ? 'Đã phản hồi' : 'Chưa xử lý'}</td>
            <td>{review.responses.length}</td> {/* Hiển thị số lượng */}
            <td>
              <button onClick={() => setSelectedReview(review)}>Chi tiết</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)}

      {/* Modal for Reply/Delete */}
      {selectedReview && (
        <div className="modal">
          <h3>Đánh giá ID: {selectedReview.id}</h3>
          <p>{selectedReview.contents}</p>

          {/* Thêm phần Lịch sử */}
        <div className="history-section">
          <h4>Lịch sử phản hồi:</h4>
          {selectedReview.responses.length > 0 ? (
            <ul>
              {selectedReview.responses
                .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()) // Sort mới nhất đầu
                .map((res) => (
                  <li key={res.id}>
                    <strong>{res.repliedBy}</strong> ({new Date(res.createdAt).toLocaleString()}): {res.contents}
                  </li>
                ))}
            </ul>
          ) : (
            <p>Chưa có phản hồi nào.</p>
          )}
        </div>

          <div>
            <h4>Phản hồi mới:</h4>
            <textarea
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              placeholder="Nhập phản hồi..."
            />
            <button onClick={handleReply}>Gửi</button>
            <button onClick={handleDelete}>Xóa</button>
            <button onClick={() => setSelectedReview(null)}>Đóng</button>
          </div>
          {error && <p className="error">{error}</p>}
        </div>
      )}
    </div>
  );
};

export default ManageReviews;