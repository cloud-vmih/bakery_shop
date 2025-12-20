type Props = { onSubmit: () => void };

export default function ConfirmOrderButton({ onSubmit }: Props) {
  return (
    <button type="button" className="confirm-btn" onClick={onSubmit}>
      Hoàn tất đơn hàng
    </button>
  );
}
