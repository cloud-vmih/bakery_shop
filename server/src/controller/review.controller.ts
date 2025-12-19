import { Request, Response } from 'express';
import { reviewService } from '../services/review.services';
import { Rating } from '../entity/Rating'; 

export const getReviewsController = async (req: Request, res: Response) => {
  try {
    const { productName, dateFrom, unhandled } = req.query;

    const filters = {
      productName: productName as string,
      dateFrom: dateFrom as string,
      unhandled: unhandled === 'true',
    };

    const reviews = await reviewService.getReviews(filters);
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi tải danh sách đánh giá!' });
  }
};

export const replyReviewController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { contents } = req.body;
    await reviewService.replyReview(parseInt(id), contents, (req as any).user);
    res.json({ message: 'Phản hồi thành công!' });
  } catch (error: any) {
    if (error.message === 'Nội dung phản hồi không hợp lệ!') {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: 'Lỗi gửi phản hồi!' });
  }
};

export const deleteReviewController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await reviewService.deleteReview(parseInt(id));
    res.json({ message: 'Xóa thành công!' });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi xóa đánh giá!' });
  }
};