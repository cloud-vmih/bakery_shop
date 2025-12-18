import API  from "../api/axois.config";
import toast from 'react-hot-toast';

export interface Review { 
    id: number;
    contents: string;
    createdAt: string;
    item?: { name: string };
    hasResponse: boolean;
    responses: { // Thêm array này
    id: number;
    contents: string;
    createdAt: string;
    repliedBy: string; // Tên staff/admin hoặc 'Unknown'
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
    createdAt: new Date(rating.createAt).toISOString(),  // Convert Date → ISO string
    item: rating.item ? { name: rating.item.name } : undefined,
    hasResponse: !!(rating.responses.length > 0),  // Boolean: true nếu response tồn tại
    responses: rating.responses?.map((res: any) => ({
      id: res.id,
      contents: res.contents,
      createdAt: new Date(res.createdAt).toISOString(),
      repliedBy: res.staff?.name || res.admin?.name || 'Unknown' // Giả sử entity Staff/Admin có field 'name'
    })) || []
  }));

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