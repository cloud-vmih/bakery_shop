import { calculateOrderTotals } from "../../utils/orderCalculator";
import { formatVND } from "../../utils/formatCurrency";

type Props = {
  items: any[];

  // 🔥 MỞ RỘNG TỪ TỪ
  shippingFee?: number;
  discount?: number;
  vatRate?: number;
  membershipDiscount?: number;

  // Tuỳ chọn hiển thị
  showDetails?: boolean; // ẩn list sản phẩm nếu cần
};

export default function OrderSummary({
  items,
  shippingFee = 0,
  discount = 0,
  membershipDiscount = 0,
  vatRate = 0.1,
  showDetails = true,
}: Props) {
  const { subtotal, vat, total } = calculateOrderTotals(items, {
    shippingFee,
    discount,
    membershipDiscount,
    vatRate,
  });

  return (
    <section className="order-summary">
      <h3 className="order-title">Đơn hàng của bạn</h3>

      {/* ===== LIST ITEMS ===== */}
      {showDetails && (
        <div className="order-list">
          {items.map((ci: any) => (
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
                {formatVND(ci.item.price * ci.quantity)}
              </div>
            </div>
          ))}
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

      <div className="order-row">
        <span>Phí giao hàng</span>
        <span>{formatVND(shippingFee)}</span>
      </div>

      <div className="order-row text-green-600">
        <span>Giảm giá</span>
        <span>-{formatVND(discount)}</span>
      </div>

      {membershipDiscount >= 0 && (
        <div className="order-row text-green-600">
          <span>Giảm giá thành viên</span>
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
