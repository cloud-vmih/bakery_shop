// src/utils/pricing.ts
import { getMyPoints } from "../services/memberpoint.service"
/**
 * Kiểu discount áp dụng cho sản phẩm
 */
export type Discount = {
  discountAmount: number; // % giảm giá (ví dụ: 10 = 10%)
  startAt: string | Date;
  endAt: string | Date;
};

export type MembershipDiscount = {
    discountAmount: number; // % giảm giá (ví dụ: 10 = 10%)
    startAt: string | Date;
    endAt: string | Date;
    minPoints: number;
};

/**
 * Kiểu item có thể tính giá
 */
export type PricableItem = {
  price?: number;
  discounts?: Discount[];
};

/**
 )* Lấy discount đang active (nếu có
 */
export function getActiveDiscount(item: any): Discount | null {
  if (!item?.discounts || item.discounts.length === 0) return null;

  const now = new Date();

  return (
    item.discounts.find((d: any) => {
      const start = new Date(d.startAt);
      const end = new Date(d.endAt);
      return now >= start && now <= end;
    }) || null
  );
}

export const getMembershipDiscount= async (item: any): Promise<MembershipDiscount | null> => {
    const points = await getMyPoints();
    const memberPoint = points.totalPoints
    if (!item?.membershipDiscounts || item.membershipDiscounts.length === 0) return null;

    const now = new Date();

    return (
        item.membershipDiscounts.find((d: any) => {
            const start = new Date(d.startAt);
            const end = new Date(d.endAt);
            return now >= start && now <= end && d.minPoints <= memberPoint;
        }) || null
    );
}

export const getTotalMembershipDiscount = async (items: any[]): Promise<number> => {
    const points = await getMyPoints();
    const memberPoint = points.totalPoints;
    const now = new Date();

    return items.reduce((total: number, it: any) => {
        if (!it?.item.membershipDiscounts?.length) return total;

        const totalPercent = it.item.membershipDiscounts
            .filter((d: any) => {
                const start = new Date(d.startAt);
                const end = new Date(d.endAt);
                return now >= start && now <= end && d.minPoints <= memberPoint;
            })
            .reduce((sum: number, d: any) => sum + d.discountAmount, 0);

        const itemDiscount = it.item.price * (totalPercent / 100);

        return total + itemDiscount;
    }, 0);
};

export const getTotalMembershipDiscountByOrder = async (order: any): Promise<number> => {
    if (!order?.items?.length) return 0;

    const points = await getMyPoints();
    const memberPoint = points.totalPoints;

    const orderDate = new Date(order.createdAt);

    return order.items.reduce((total: number, it: any) => {
        const discounts = it?.item?.membershipDiscounts;
        if (!discounts?.length) return total;

        const totalPercent = discounts
            .filter((d: any) => {
                const start = new Date(d.startAt);
                const end = new Date(d.endAt);

                return (
                    orderDate >= start &&
                    orderDate <= end &&
                    d.minPoints <= memberPoint
                );
            })
            .reduce((sum: number, d: any) => sum + d.discountAmount, 0);

        const itemDiscount = it.item.price  * (totalPercent / 100);

        return total + itemDiscount;
    }, 0);
};

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
