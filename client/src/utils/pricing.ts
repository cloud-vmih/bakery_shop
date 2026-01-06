// src/utils/pricing.ts

/**
 * Kiểu discount áp dụng cho sản phẩm
 */
export type Discount = {
  discountAmount: number; // % giảm giá (ví dụ: 10 = 10%)
  startAt: string | Date;
  endAt: string | Date;
};

/**
 * Kiểu item có thể tính giá
 */
export type PricableItem = {
  price?: number;
  discounts?: Discount[];
};

/**
 * Lấy discount đang active (nếu có)
 */
export function getActiveDiscount(item: PricableItem): Discount | null {
  if (!item?.discounts || item.discounts.length === 0) return null;

  const now = new Date();

  return (
    item.discounts.find((d) => {
      const start = new Date(d.startAt);
      const end = new Date(d.endAt);
      return now >= start && now <= end;
    }) || null
  );
}

/**
 * Giá thực tế dùng để TÍNH TIỀN
 * - Có khuyến mãi → giá sau giảm
 * - Không có → giá gốc
 *
 * ⚠️ Đây là hàm DUY NHẤT được dùng để tính subtotal / total
 */
export function getEffectivePrice(item: PricableItem): number {
  if (!item?.price) return 0;

  const discount = getActiveDiscount(item);
  if (!discount) return item.price;

  const discountedPrice = item.price * (1 - discount.discountAmount / 100);

  // Làm tròn để tránh số lẻ VNĐ
  return Math.round(discountedPrice);
}

/**
 * Số tiền TIẾT KIỆM được trên 1 sản phẩm
 * - Chỉ dùng để HIỂN THỊ (UI)
 * - KHÔNG dùng để trừ vào total
 */
export function getDiscountAmount(item: PricableItem): number {
  if (!item?.price) return 0;

  const effectivePrice = getEffectivePrice(item);
  return item.price - effectivePrice;
}

/**
 * Kiểm tra sản phẩm có đang được giảm giá hay không
 * (tiện cho UI)
 */
export function hasActiveDiscount(item: PricableItem): boolean {
  return getActiveDiscount(item) !== null;
}
