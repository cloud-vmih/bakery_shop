import { useState } from "react";

const TIME_FRAMES = [
  { value: "", label: "Chọn khung giờ" },
  { value: "08:00-12:00", label: "08:00 – 12:00" },
  { value: "12:00-16:00", label: "12:00 – 16:00" },
  { value: "16:00-20:00", label: "16:00 – 20:00" },
  { value: "20:00-22:00", label: "20:00 – 22:00" },
];

export default function DeliveryTimeSelector(props: any) {
  const [open, setOpen] = useState(false);

  const selected =
    TIME_FRAMES.find((t) => t.value === props.timeFrame) || TIME_FRAMES[0];

  return (
    <section>
      <h3 className="checkout-title">Thời gian giao hàng</h3>

      <div className="checkout-grid-2">
        {/* DATE */}
        <input
          type="date"
          className="checkout-input"
          value={props.deliveryDate}
          onChange={(e) => props.setDeliveryDate(e.target.value)}
        />

        {/* CUSTOM DROPDOWN */}
        <div className="dropdown">
          <div
            className={`dropdown-control ${open ? "open" : ""}`}
            onClick={() => setOpen(!open)}
          >
            <span
              className={selected.value === "" ? "dropdown-placeholder" : ""}
            >
              {selected.label}
            </span>
            <span className="dropdown-arrow">▾</span>
          </div>

          {open && (
            <div className="dropdown-menu">
              {TIME_FRAMES.map((t) => (
                <div
                  key={t.value}
                  className={`dropdown-item ${
                    props.timeFrame === t.value ? "active" : ""
                  }`}
                  onClick={() => {
                    props.setTimeFrame(t.value);
                    setOpen(false);
                  }}
                >
                  {t.label}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <p className="checkout-note">
        <i>Nếu cần đặt bánh gấp trong ngày, xin liên hệ hotline: 1800 8287</i>
      </p>
    </section>
  );
}
