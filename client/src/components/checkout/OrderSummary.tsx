// src/components/checkout/OrderSummary.tsx

type Props = {
  items: any[];
};

export default function OrderSummary({ items }: Props) {
  const subtotal = items.reduce(
    (sum: number, ci: any) => sum + ci.item.price * ci.quantity,
    0
  );

  const vat = subtotal * 0.1;
  const total = subtotal + vat;

  return (
    <section className="order-summary">
      <h3 className="order-title">Đơn hàng của bạn</h3>

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
              {(ci.item.price * ci.quantity).toLocaleString()}đ
            </div>
          </div>
        ))}
      </div>

      <div className="order-divider" />

      <div className="order-row">
        <span>Tạm tính</span>
        <span>{subtotal.toLocaleString()}đ</span>
      </div>

      <div className="order-row">
        <span>VAT (10%)</span>
        <span>{vat.toLocaleString()}đ</span>
      </div>

      <div className="order-total">
        <span>Tổng cộng</span>
        <span>{total.toLocaleString()}đ</span>
      </div>
    </section>
  );
}
