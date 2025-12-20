type Props = {
  addresses: any[];
  selectedAddressId: number | null;
  onSelectAddress: (id: number | null) => void;
  newAddress: string;
  onNewAddressChange: (v: string) => void;
  saveAddress: boolean;
  setSaveAddress: (v: boolean) => void;
  setDefault: boolean;
  setSetDefault: (v: boolean) => void;
};

export default function ShippingInfo(props: Props) {
  const usingNewAddress =
    !props.selectedAddressId && props.newAddress.trim() !== "";

  return (
    <section>
      <h3 className="checkout-title">Thông tin giao hàng</h3>

      {/* ===== ADDRESS BOOK ===== */}
      <select
        className="checkout-select"
        value={props.selectedAddressId ?? ""}
        onChange={(e) => {
          const val = e.target.value ? Number(e.target.value) : null;
          props.onSelectAddress(val);

          // nếu chọn address có sẵn → reset new address + option
          if (val) {
            props.onNewAddressChange("");
            props.setSaveAddress(false);
            props.setSetDefault(false);
          }
        }}
      >
        <option value="">Chọn địa chỉ từ sổ địa chỉ</option>
        {props.addresses.map((a) => (
          <option key={a.id} value={a.id}>
            {a.formattedAddress} {a.isDefault ? "(Mặc định)" : ""}
          </option>
        ))}
      </select>

      {/* ===== NEW ADDRESS ===== */}
      <input
        className="checkout-input mt-3"
        placeholder="Hoặc nhập / tìm địa chỉ của bạn"
        value={props.newAddress}
        onChange={(e) => {
          props.onSelectAddress(null);
          props.onNewAddressChange(e.target.value);
        }}
      />

      {/* ===== OPTIONS ===== */}
      <div className="checkout-row">
        {/* SAVE ADDRESS */}
        <label className={`toggle ${!usingNewAddress ? "disabled" : ""}`}>
          <input
            type="checkbox"
            checked={props.saveAddress}
            disabled={!usingNewAddress}
            onChange={(e) => {
              props.setSaveAddress(e.target.checked);
              if (!e.target.checked) {
                props.setSetDefault(false);
              }
            }}
          />
          <span className="slider" />
          <span className="toggle-label">Lưu địa chỉ cho lần mua kế tiếp</span>
        </label>

        {/* DEFAULT */}
        <label className={`toggle ${!usingNewAddress ? "disabled" : ""}`}>
          <input
            type="checkbox"
            checked={props.setDefault}
            disabled={!usingNewAddress}
            onChange={(e) => {
              props.setSetDefault(e.target.checked);
              if (e.target.checked) {
                props.setSaveAddress(true); // 🔥 default ⇒ phải save
              }
            }}
          />
          <span className="slider" />
          <span className="toggle-label">Địa chỉ mặc định</span>
        </label>
      </div>
    </section>
  );
}
