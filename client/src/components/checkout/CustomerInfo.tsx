type Props = {
  value: {
    fullName: string;
    email: string;
    phone: string;
  };
  onChange: (v: any) => void;
};

export default function CustomerInfo({ value, onChange }: Props) {
  return (
    <section>
      <h3 className="checkout-title">Thông tin khách hàng</h3>

      <input
        className="checkout-input"
        placeholder="Họ và tên"
        value={value.fullName}
        onChange={(e) => onChange({ ...value, fullName: e.target.value })}
      />

      {/* ✅ SỬA CLASS Ở ĐÂY */}
      <div className="checkout-grid-2 mt-3">
        <input
          className="checkout-input"
          placeholder="Email"
          value={value.email}
          onChange={(e) => onChange({ ...value, email: e.target.value })}
        />

        <input
          className="checkout-input"
          placeholder="Số điện thoại"
          value={value.phone}
          onChange={(e) => onChange({ ...value, phone: e.target.value })}
        />
      </div>
    </section>
  );
}
