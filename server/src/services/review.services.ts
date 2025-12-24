import { Rating } from '../entity/Rating';
import { ResponseRating } from '../entity/ResponseRating';
import { User } from '../entity/User'; // Giả sử User type cho Staff/Admin
import { reviewRepository } from '../db/db.review';
import { ratingRepository } from '../db/db.rating';

const BAD_WORDS_REGEX = /fuck|shit|damn/gi; // List từ khiếm nhã đơn giản

export const reviewService = {
  async getReviews(filters: { productName?: string; dateFrom?: string; unhandled?: boolean }) {
    const data = await ratingRepository.findFilteredRatings(filters);
    for (const item of data) {
      if (BAD_WORDS_REGEX.test(item.contents)) {
        item.contents = item.contents.replace(BAD_WORDS_REGEX, '***');
      }
    }
    return data;
  },

  async replyReview(ratingId: number, contents: string, user: User) {
    // Exception 5.1c: Validate
    if (!contents || contents.trim().length === 0) {
      throw new Error('Nội dung phản hồi không hợp lệ!');
    }
    if (BAD_WORDS_REGEX.test(contents)) {
      contents = contents.replace(BAD_WORDS_REGEX, '***'); // Thay * như Sequence 3.3
    }

    // Tạo ResponseRating
    const rating = await ratingRepository.findById(ratingId);
    if (!rating) throw new Error('Đánh giá không tồn tại!');

    const response = new ResponseRating();
    response.contents = contents;
    response.rating = rating;
    // Giả sử user là Staff hoặc Admin, set tương ứng (dựa entity cũ)
    if (user.type === 'staff') {
      response.staff = user as any; // Cast vì entity có staff/admin riêng
    } else {
      response.admin = user as any;
    }
    return (await reviewRepository.save(response) && await ratingRepository.update(ratingId, rating) );
  },

  async deleteReview(ratingId: number) {
    // Soft delete: Set flag hoặc xóa hard (dựa entity cũ, dùng update)
    return await ratingRepository.delete(ratingId);
  },
};