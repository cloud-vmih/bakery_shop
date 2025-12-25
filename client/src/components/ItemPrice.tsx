interface PriceDisplayProps {
    item: {
        price?: number;
        discounts?: Array<{
            discountAmount: number;
            startAt: string | Date;
            endAt: string | Date;
        }>;
    };
}

const formatPrice = (price: number) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " VNĐ";
};

export const PriceDisplay = ({ item }: PriceDisplayProps) => {
    const now = new Date();

    // Tìm discount active
    const activeDiscount = item.discounts?.find((discount: any) => {
        const startDate = new Date(discount.startAt);
        const endDate = new Date(discount.endAt);
        return now >= startDate && now <= endDate;
    });

    if (!item.price) {
        return <span className="text-gray-600">Liên hệ</span>;
    }

    if (activeDiscount) {
        const discountedPrice = item.price - item.price * (activeDiscount.discountAmount/100);

        return (
<>
          <span className="line-through text-gray-400 text-sm">
            {formatPrice(item.price)}
          </span>
                    <span className="bg-red-100 text-red-800 text-xs font-bold px-2 py-1 rounded">
            -{activeDiscount.discountAmount}%
          </span><br/>
                    <span className="text-red-600 font-bold text-lg">
            {formatPrice(discountedPrice)}
          </span><br/>
    <span className="text-xs text-gray-500">
          Khuyến mãi đến {new Date(activeDiscount.endAt).toLocaleDateString('vi-VN')}
        </span>

</>
        );
    }
    return <span className="font-medium">{formatPrice(item.price)}</span>;
};