// utils/orderCalculator.ts
type CalculateOptions = {
    shippingFee?: number;
    discount?: number;
    vatRate?: number; // mặc định 10%
};

export function calculateOrderTotals(items: any[], options?: CalculateOptions) {
    const vatRate = options?.vatRate ?? 0.1;
    const shippingFee = options?.shippingFee ?? 0;
    const discount = options?.discount ?? 0;

    const subtotal = items.reduce((sum, i) => sum + i.item.price * i.quantity, 0);

    const vat = subtotal * vatRate;

    const total = subtotal + vat + shippingFee - discount;

    return {
        subtotal,
        vat,
        shippingFee,
        discount,
        total,
    };
}