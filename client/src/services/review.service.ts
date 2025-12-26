import API from "../api/axois.config";
import toast from 'react-hot-toast';

export interface Review {
    id: number;
    contents: string;
    createdAt: string;
    item?: { name: string };
    hasResponse: boolean;
    responses: {
      id: Number,
      contents: string,
      createdAt: string,
      staff?: any,
      admin?: any,
    }[];
}

export const getReviews = async (filter: { productName?: string; dateFrom?: string; unhandled?: boolean }): Promise<Review[]> => {
  const params = new URLSearchParams();
  if (filter.productName) params.append('productName', filter.productName);
  if (filter.dateFrom) params.append('dateFrom', filter.dateFrom);
  if (filter.unhandled) params.append('unhandled', 'true');
 
  const response = await API.get('/reviews', { params });
  const reviews: Review[] = (response.data as any[]).map((rating: any) => ({
    id: rating.id,
    contents: rating.contents,
    createdAt: new Date(rating.createAt).toISOString(), // Giữ nguyên createAt theo mã gốc
    item: rating.item ? { name: rating.item.name } : undefined,
    hasResponse: !!rating.responses && rating.responses.length > 0,
    responses: rating.responses,
}))
  if (response.data.message) {
      throw new Error(response.data.message || 'Lỗi lấy đánh giá');
  }
  return reviews;
};

export const replyReview = async (ratingId: number, content: string): Promise<void> => {
  await API.post(`/reviews/${ratingId}/reply`, { contents: content });
};

export const deleteReview = async (ratingId: number): Promise<void> => {
  await API.delete(`/reviews/${ratingId}`);
};