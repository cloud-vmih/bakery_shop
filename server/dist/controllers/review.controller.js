"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteReviewController = exports.replyReviewController = exports.getReviewsController = void 0;
const review_service_1 = require("../services/review.service");
const getReviewsController = async (req, res) => {
    try {
        const { productName, dateFrom, unhandled } = req.query;
        const filters = {
            productName: productName,
            dateFrom: dateFrom,
            unhandled: unhandled === 'true',
        };
        const reviews = await review_service_1.reviewService.getReviews(filters);
        res.json(reviews);
    }
    catch (error) {
        res.status(500).json({ message: 'Lỗi tải danh sách đánh giá!' });
    }
};
exports.getReviewsController = getReviewsController;
const replyReviewController = async (req, res) => {
    try {
        const { id } = req.params;
        const { contents } = req.body;
        await review_service_1.reviewService.replyReview(parseInt(id), contents, req.user);
        res.json({ message: 'Phản hồi thành công!' });
    }
    catch (error) {
        if (error.message === 'Nội dung phản hồi không hợp lệ!') {
            return res.status(400).json({ message: error.message });
        }
        res.status(500).json({ message: 'Lỗi gửi phản hồi!' });
    }
};
exports.replyReviewController = replyReviewController;
const deleteReviewController = async (req, res) => {
    try {
        const { id } = req.params;
        await review_service_1.reviewService.deleteReview(parseInt(id));
        res.json({ message: 'Xóa thành công!' });
    }
    catch (error) {
        res.status(500).json({ message: 'Lỗi xóa đánh giá!' });
    }
};
exports.deleteReviewController = deleteReviewController;
