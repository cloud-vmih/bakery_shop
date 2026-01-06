// utils/orderCalculator.ts
import { getEffectivePrice, getDiscountAmount } from "./pricing";

type CalculateOptions = {
  shippingFee?: number;
  vatRate?: number; // mặc định 10%
  membershipDiscount?: number; // ✅ TRỪ THẬT
};

export function calculateOrderTotals(items: any[], options?: CalculateOptions) {
  const vatRate = options?.vatRate ?? 0.1;
  const shippingFee = options?.shippingFee ?? 0;
  const membershipDiscount = options?.membershipDiscount ?? 0;

  /**
   * =========================
   * SUBTOTAL
   * =========================
   * ✅ Tổng GIÁ ĐÃ GIẢM
   * ❌ TUYỆT ĐỐI không dùng giá gốc
   */
  const subtotal = items.reduce((sum, i) => {
    const price = getEffectivePrice(i.item);
    return sum + price * i.quantity;
  }, 0);

  /**
   * =========================
   * DISCOUNT (SAVINGS)
   * =========================
   * 🔎 Tổng tiền TIẾT KIỆM
   * ⚠️ CHỈ DÙNG ĐỂ HIỂN THỊ – KHÔNG TRỪ
   */
  const discount = items.reduce((sum, i) => {
    const savedPerItem = getDiscountAmount(i.item);
    return sum + savedPerItem * i.quantity;
  }, 0);

  /**
   * =========================
   * VAT
   * =========================
   * ✅ VAT tính trên GIÁ ĐÃ GIẢM
   */
  const vat = Math.round(subtotal * vatRate);

  /**
   * =========================
   * TOTAL
   * =========================
   * subtotal + VAT + ship − membershipDiscount
   */
  const total = Math.max(0, subtotal + vat + shippingFee - membershipDiscount);

  return {
    subtotal, // ✅ đã giảm
    discount, // 🔎 chỉ hiển thị "Tiết kiệm"
    vat,
    shippingFee,
    membershipDiscount, // 🔻 trừ thật
    total,
  };
}
