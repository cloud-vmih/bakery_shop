interface PriceDisplayProps {
    item: {
        price?: number;
        discounts?: Array<{
            discountAmount: number;
            startAt: string | Date;
            endAt: string | Date;
        }>;
    };
    size?: 'sm' | 'md' | 'lg';
    menu?: boolean
}
const formatPrice = (price: number) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " VNĐ";
};

export const PriceDisplay = ({
                                 item,
                                 size = 'md',
                                 menu = true
                             }: PriceDisplayProps) => {
    const now = new Date();

    const activeDiscount = item.discounts?.find(discount => {
        const startDate = new Date(discount.startAt);
        const endDate = new Date(discount.endAt);
        return now >= startDate && now <= endDate;
    });

    if (!item.price) {
        return <span className="text-gray-600">Liên hệ</span>;
    }

    // Config kích thước theo size
    const sizeConfig = {
        sm: {
            original: 'text-xs',
            discountBadge: 'text-xs',
            final: 'text-sm',
            date: 'text-xs',
            gap: 'gap-1',
        },
        md: {
            original: 'text-sm',
            discountBadge: 'text-xs',
            final: 'text-lg',
            date: 'text-xs',
            gap: 'gap-2',
        },
        lg: {
            original: 'text-base',
            discountBadge: 'text-sm',
            final: 'text-2xl',
            date: 'text-sm',
            gap: 'gap-3',
        },
    };

    const config = sizeConfig[size];

    if (activeDiscount && !menu) {
        const discountedPrice = item.price - item.price * (activeDiscount.discountAmount/100);

        return (
            <div className={`flex flex-col ${config.gap}`}>
                <div className="flex items-center gap-2">
          <span className={`line-through text-gray-400 ${config.original}`}>
            {formatPrice(item.price)}
          </span>
                    <span className={`bg-red-100 text-red-800 font-bold px-2 py-1 rounded ${config.discountBadge}`}>
            -{activeDiscount.discountAmount}%
          </span>
                </div>
                <span className={`text-red-600 font-bold ${config.final}`}>
          {formatPrice(discountedPrice)}
        </span>
                <span className={`text-gray-500 ${config.date}`}>
          <i className="fas fa-clock mr-1"></i>
          Khuyến mãi đến {new Date(activeDiscount.endAt).toLocaleDateString('vi-VN')}
        </span>
            </div>
        );
    }
    if (activeDiscount && menu) {
        const discountedPrice = item.price - item.price * (activeDiscount.discountAmount/100);
        return(
        <div className={`flex items-center ${config.gap}`}>
          <span className={`line-through text-gray-400 ${config.original}`}>
            {formatPrice(item.price)}
          </span>
        <span className={`text-red-600 font-bold ${config.final}`}>
          {formatPrice(discountedPrice)}
        </span>
        </div>
        )
    }

    return <span className={`font-bold ${config.final}`}>
    {formatPrice(item.price)}
  </span>;
};