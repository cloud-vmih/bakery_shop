type Props = {
    onSubmit: () => void | Promise<void>;
    disabled?: boolean;
};

export default function ConfirmOrderButton({ onSubmit }: Props) {
    return (
        <button
            type="button"
            className="mt-6 w-full rounded-xl bg-emerald-600 py-3 text-white font-semibold hover:bg-emerald-700"
            onClick={onSubmit}
        >
            Hoàn tất đơn hàng
        </button>
    );
}