"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reviewService = void 0;
const ResponseRating_1 = require("../entity/ResponseRating");
const review_db_1 = require("../db/review.db");
const rating_db_1 = require("../db/rating.db");
const BAD_WORDS_REGEX = /fuck|shit|damn/gi; // List từ khiếm nhã đơn giản
exports.reviewService = {
    async getReviews(filters) {
        const data = await rating_db_1.ratingRepository.findFilteredRatings(filters);
        for (const item of data) {
            if (BAD_WORDS_REGEX.test(item.contents)) {
                item.contents = item.contents.replace(BAD_WORDS_REGEX, '***');
            }
        }
        return data;
    },
    async replyReview(ratingId, contents, user) {
        // Exception 5.1c: Validate
        if (!contents || contents.trim().length === 0) {
            throw new Error('Nội dung phản hồi không hợp lệ!');
        }
        if (BAD_WORDS_REGEX.test(contents)) {
            contents = contents.replace(BAD_WORDS_REGEX, '***'); // Thay * như Sequence 3.3
        }
        // Tạo ResponseRating
        const rating = await rating_db_1.ratingRepository.findById(ratingId);
        if (!rating)
            throw new Error('Đánh giá không tồn tại!');
        const response = new ResponseRating_1.ResponseRating();
        response.contents = contents;
        response.rating = rating;
        // Giả sử user là Staff hoặc Admin, set tương ứng (dựa entity cũ)
        if (user.type === 'staff') {
            response.staff = user; // Cast vì entity có staff/admin riêng
        }
        else {
            response.admin = user;
        }
        return (await review_db_1.reviewRepository.save(response) && await rating_db_1.ratingRepository.update(ratingId, rating));
    },
    async deleteReview(ratingId) {
        // Soft delete: Set flag hoặc xóa hard (dựa entity cũ, dùng update)
        return await rating_db_1.ratingRepository.delete(ratingId);
    },
};
