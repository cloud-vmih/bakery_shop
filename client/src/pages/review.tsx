import { useState, useEffect } from 'react';
import { getReviews, replyReview, deleteReview, Review } from '../services/review.service';
import '../styles/review.css';
import toast from 'react-hot-toast';

const ManageReviews: React.FC = () => {
  const [fullReviews, setFullReviews] = useState<Review[]>([]);
  const [productName, setProductName] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [unhandled, setUnhandled] = useState(false);
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showConfirm, setShowConfirm] = useState(false);
  const pageSize = 5; // Số lượng đánh giá mỗi trang, có thể điều chỉnh

  const filter = { productName, dateFrom, unhandled };

  useEffect(() => {
    setCurrentPage(1);
  }, [productName, dateFrom, unhandled]);

  useEffect(() => {
    fetchReviews();
  }, [productName, dateFrom, unhandled, currentPage]);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const data = await getReviews(filter);
      setFullReviews(data);
      setError('');
    } catch (err) {
      toast.error('Lỗi tải danh sách đánh giá!');
    } finally {
      setLoading(false);
    }
  };

  const displayedReviews = fullReviews.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const totalItems = fullReviews.length;
  const totalPages = Math.ceil(totalItems / pageSize);

  const handleReply = async () => {
    if (!selectedReview || !replyContent.trim()) {
      toast.error('Nội dung phản hồi không hợp lệ!');
      return;
    }
    try {
      await replyReview(selectedReview.id, replyContent);
      setReplyContent('');
      setSelectedReview(null);
      fetchReviews(); // Refresh
      toast.success('Phản hồi thành công!');
    } catch (err) {
      toast.error('Lỗi gửi phản hồi!');
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedReview) return;
    try {
      await deleteReview(selectedReview.id);
      setSelectedReview(null);
      fetchReviews();
      toast.success('Xóa thành công!');
    } catch (err) {
      toast.error('Lỗi xóa đánh giá!');
    } finally {
      setShowConfirm(false);
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
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
        />
        <input
          type="date"
          value={dateFrom}
          onChange={(e) => setDateFrom(e.target.value)}
        />
        <label>
          <input
            type="checkbox"
            checked={unhandled}
            onChange={(e) => setUnhandled(e.target.checked)}
          />
          Chưa xử lý
        </label>
      </div>
      {/* Reviews Table */}
      {loading ? <p>Đang tải...</p> : (
        <>
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nội dung</th>
                  <th>Sản phẩm</th>
                  <th>Ngày tạo</th>
                  <th>Trạng thái</th>
                  <th>Số phản hồi</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {displayedReviews.map((review) => (
                  <tr key={review.id}>
                    <td>{review.id}</td>
                    <td>{review.contents}</td>
                    <td>{review.item?.name || 'N/A'}</td>
                    <td>{new Date(review.createdAt).toLocaleDateString()}</td>
                    <td>{review.hasResponse ? 'Đã phản hồi' : 'Chưa xử lý'}</td>
                    <td>{review.responses.length}</td>
                    <td>
                      <button onClick={() => setSelectedReview(review)}>Chi tiết</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Pagination */}
          <div className="pagination">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => prev - 1)}
            >
              Trước
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={page === currentPage ? 'active' : ''}
              >
                {page}
              </button>
            ))}
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(prev => prev + 1)}
            >
              Sau
            </button>
          </div>
        </>
      )}
      {/* Modal for Reply/Delete */}
      {selectedReview && (
        <div className="modal">
          <h3>Đánh giá ID: {selectedReview.id}</h3>
          <p>{selectedReview.contents}</p>
          {/* Thêm phần Lịch sử */}
          <div className="history-section">
            <h4>Lịch sử phản hồi:</h4>

            {selectedReview.responses && selectedReview.responses.length > 0 ? (
              <ul>
                {selectedReview.responses
                  .map((res: any) => ({
                    id: res.id,
                    contents: res.contents,
                    createdAt: res.createAt,
                    repliedBy: res.staff?.fullName || res.admin?.fullName || 'Unknown'
                  }))
                  .sort(
                    (a: any, b: any) =>
                      new Date(b.createdAt).getTime() -
                      new Date(a.createdAt).getTime()
                  )
                  .map((res: any) => (
                    <li key={res.id}>
                      <strong>{res.repliedBy}</strong>{' '}
                      ({new Date(res.createdAt).toLocaleString()}):{' '}
                      {res.contents}
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
            <button onClick={() => setShowConfirm(true)}>Xóa</button>
            <button onClick={() => setSelectedReview(null)}>Đóng</button>
          </div>
          {error && <p className="error">{error}</p>}
        </div>
      )}
      {/* Confirm Delete Modal */}
      {showConfirm && (
        <div className="modal">
          <div>
            <h3>Xác nhận xóa</h3>
            <p>Bạn có chắc chắn muốn xóa không?</p>
            <button onClick={handleConfirmDelete}>Có</button>
            <button onClick={() => setShowConfirm(false)}>Hủy</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageReviews;