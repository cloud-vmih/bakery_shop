import { calculateOrderTotals } from "../../utils/orderCalculator";
import { formatVND } from "../../utils/formatCurrency";
import { getEffectivePrice } from "../../utils/pricing";

type Props = {
  items: any[];

  shippingFee?: number;
  membershipDiscount?: number;
  vatRate?: number;

  showDetails?: boolean;
};

export default function OrderSummary({
  items,
  shippingFee = 0,
  membershipDiscount = 0,
  vatRate = 0.1,
  showDetails = true,
}: Props) {
  const { subtotal, vat, total, discount } = calculateOrderTotals(items, {
    shippingFee,
    membershipDiscount,
    vatRate,
  });

  return (
    <section className="order-summary">
      <h3 className="order-title">Đơn hàng của bạn</h3>

      {/* ===== LIST ITEMS ===== */}
      {showDetails && (
        <div className="order-list">
          {items.map((ci: any) => {
            const price = getEffectivePrice(ci.item);

            return (
              <div key={ci.id} className="order-item">
                <div className="order-image">
                  <img src={ci.item.imageURL} alt={ci.item.name} />
                  <span className="order-qty">{ci.quantity}</span>
                </div>

                <div className="order-info">
                  <div className="order-name">{ci.item.name}</div>
                  <div className="order-desc">
                    {ci.item.itemDetail?.size}
                    {ci.item.itemDetail?.sugar
                      ? ` / ${ci.item.itemDetail.sugar}`
                      : ""}
                  </div>
                </div>

                <div className="order-price">
                  {formatVND(price * ci.quantity)}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="order-divider" />

      {/* ===== PRICE BREAKDOWN ===== */}
      <div className="order-row">
        <span>Tạm tính</span>
        <span>{formatVND(subtotal)}</span>
      </div>

      <div className="order-row">
        <span>VAT ({vatRate * 100}%)</span>
        <span>{formatVND(vat)}</span>
      </div>

      {shippingFee > 0 && (
        <div className="order-row">
          <span>Phí giao hàng</span>
          <span>{formatVND(shippingFee)}</span>
        </div>
      )}

      {/* ===== SAVINGS (DISPLAY ONLY) ===== */}
      {discount > 0 && (
        <div className="mt-2 rounded-lg bg-emerald-50 border border-emerald-200 px-4 py-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-emerald-700">
              Bạn đã tiết kiệm
            </span>
            <span className="font-bold text-emerald-800">
              {formatVND(discount)}
            </span>
          </div>
        </div>
      )}

      {/* ===== MEMBERSHIP DISCOUNT (REAL) ===== */}
      {membershipDiscount > 0 && (
        <div className="order-row text-emerald-600">
          <span>Ưu đãi thành viên</span>
          <span>-{formatVND(membershipDiscount)}</span>
        </div>
      )}

      <div className="order-total">
        <span>Tổng cộng</span>
        <span>{formatVND(total)}</span>
      </div>
    </section>
  );
}
