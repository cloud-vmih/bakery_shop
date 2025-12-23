import AddressAutocomplete, { AddressResult } from "../AddressAutocomplete";

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

  // 🔥 THÊM: nhận full object từ autocomplete
  onSelectNewAddress: (addr: AddressResult) => void;
};

export default function ShippingInfo({
  addresses,
  selectedAddressId,
  onSelectAddress,
  newAddress,
  onNewAddressChange,
  saveAddress,
  setSaveAddress,
  setDefault,
  setSetDefault,
  onSelectNewAddress,
}: Props) {
  const usingNewAddress =
    selectedAddressId === null && newAddress.trim() !== "";

  /* ================= HANDLERS ================= */

  const handleSelectExistingAddress = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const value = e.target.value ? Number(e.target.value) : null;
    onSelectAddress(value);

    if (value !== null) {
      onNewAddressChange("");
      setSaveAddress(false);
      setSetDefault(false);
    }
  };

  const handleSaveToggle = (checked: boolean) => {
    setSaveAddress(checked);
    if (!checked) setSetDefault(false);
  };

  const handleDefaultToggle = (checked: boolean) => {
    setSetDefault(checked);
    if (checked) setSaveAddress(true);
  };

  /* ================= RENDER ================= */

  return (
    <section>
      <h3 className="checkout-title">Thông tin giao hàng</h3>

      {/* ===== ADDRESS BOOK ===== */}
      <select
        className="checkout-select"
        value={selectedAddressId ?? ""}
        onChange={handleSelectExistingAddress}
      >
        <option value="">Chọn địa chỉ từ sổ địa chỉ</option>
        {addresses.map((a) => (
          <option key={a.id} value={a.id}>
            {a.fullAddress} {a.isDefault ? "(Mặc định)" : ""}
          </option>
        ))}
      </select>

      {/* ===== NEW ADDRESS (GOOGLE AUTOCOMPLETE) ===== */}
      <div className="mt-3">
        <AddressAutocomplete
          placeholder="Hoặc nhập / tìm địa chỉ của bạn"
          disabled={selectedAddressId !== null}
          onSelect={(addr) => {
            onSelectAddress(null); // bỏ chọn address cũ
            onNewAddressChange(addr.fullAddress);
            onSelectNewAddress(addr);
          }}
        />
      </div>

      {/* ===== OPTIONS ===== */}
      <div className="checkout-row">
        <label className={`toggle ${!usingNewAddress ? "disabled" : ""}`}>
          <input
            type="checkbox"
            checked={saveAddress}
            disabled={!usingNewAddress}
            onChange={(e) => handleSaveToggle(e.target.checked)}
          />
          <span className="slider" />
          <span className="toggle-label">Lưu địa chỉ cho lần mua kế tiếp</span>
        </label>

        <label className={`toggle ${!usingNewAddress ? "disabled" : ""}`}>
          <input
            type="checkbox"
            checked={setDefault}
            disabled={!usingNewAddress}
            onChange={(e) => handleDefaultToggle(e.target.checked)}
          />
          <span className="slider" />
          <span className="toggle-label">Địa chỉ mặc định</span>
        </label>
      </div>
    </section>
  );
}
