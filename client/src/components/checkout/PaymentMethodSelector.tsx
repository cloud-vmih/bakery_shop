export default function PaymentMethodSelector(props: any) {
  return (
    <section>
      <h3 className="checkout-title">Phương thức thanh toán</h3>

      <div className="payment-grid">
        {/* COD */}
        <div
          className={`payment-box ${
            props.paymentMethod === "COD" ? "active" : ""
          }`}
          onClick={() => props.setPaymentMethod("COD")}
        >
          <div className="payment-left">
            <img src="/icons/cod.png" alt="COD" className="payment-icon" />
            <div>
              <div className="payment-title">Thanh toán khi nhận hàng</div>
              <div className="payment-sub">COD</div>
            </div>
          </div>

          <div className="payment-check" />
        </div>

        {/* VNPAY */}
        <div
          className={`payment-box ${
            props.paymentMethod === "VNPAY" ? "active" : ""
          }`}
          onClick={() => props.setPaymentMethod("VNPAY")}
        >
          <div className="payment-left">
            <img
              src="/icons/atm-card.png"
              alt="VNPay"
              className="payment-icon"
            />
            <div>
              <div className="payment-title">Thanh toán online</div>
              <div className="payment-sub">VNPay</div>
            </div>
          </div>

          <div className="payment-check" />
        </div>
      </div>
    </section>
  );
}
