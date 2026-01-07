export type Discount = {
  discountAmount: number;
  startAt: string | Date;
  endAt: string | Date;
};

export type PricableItem = {
  price?: number;
  discounts?: Discount[];
};

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

export function getEffectivePrice(item: PricableItem): number {
  if (!item?.price) return 0;

  const discount = getActiveDiscount(item);
  if (!discount) return item.price;

  const discountedPrice = item.price * (1 - discount.discountAmount / 100);

  // Làm tròn để tránh số lẻ VNĐ
  return Math.round(discountedPrice);
}

export function getDiscountAmount(item: PricableItem): number {
  if (!item?.price) return 0;

  const effectivePrice = getEffectivePrice(item);
  return item.price - effectivePrice;
}

export function hasActiveDiscount(item: PricableItem): boolean {
  return getActiveDiscount(item) !== null;
}
