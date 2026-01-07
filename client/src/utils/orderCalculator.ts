import { getEffectivePrice, getDiscountAmount } from "./pricing";

type CalculateOptions = {
  shippingFee?: number;
  vatRate?: number;
  membershipDiscount?: number;
};

export function calculateOrderTotals(items: any[], options?: CalculateOptions) {
  const vatRate = options?.vatRate ?? 0.1;
  const shippingFee = options?.shippingFee ?? 0;
  const membershipDiscount = options?.membershipDiscount ?? 0;

  const subtotal = items.reduce((sum, i) => {
    const price = getEffectivePrice(i.item);
    return sum + price * i.quantity;
  }, 0);

  const discount = items.reduce((sum, i) => {
    const savedPerItem = getDiscountAmount(i.item);
    return sum + savedPerItem * i.quantity;
  }, 0);

  const vat = Math.round(subtotal * vatRate);

  const total = Math.max(0, subtotal + vat + shippingFee - membershipDiscount);

  return {
    subtotal,
    discount,
    vat,
    shippingFee,
    membershipDiscount,
    total,
  };
}
