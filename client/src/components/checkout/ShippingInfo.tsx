import AddressAutocomplete, { AddressResult } from "../AddressAutocomplete";

type Props = {
  addresses: any[];
  selectedAddressId: number | null;
  onSelectAddress: (id: number | null) => void;

  newAddress: string;
  onNewAddressChange: (v: string) => void;

  // 🔥 nhận full object từ autocomplete
  onSelectNewAddress: (addr: AddressResult) => void;
};

export default function ShippingInfo({
  addresses,
  selectedAddressId,
  onSelectAddress,
  newAddress,
  onNewAddressChange,
  onSelectNewAddress,
}: Props) {
  /* ================= HANDLERS ================= */

  const handleSelectExistingAddress = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const value = e.target.value ? Number(e.target.value) : null;
    onSelectAddress(value);

    // Nếu chọn địa chỉ có sẵn → clear địa chỉ mới
    if (value !== null) {
      onNewAddressChange("");
    }
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
            // Khi chọn địa chỉ mới → bỏ chọn address cũ
            onSelectAddress(null);
            onNewAddressChange(addr.fullAddress);
            onSelectNewAddress(addr);
          }}
        />
      </div>
    </section>
  );
}
