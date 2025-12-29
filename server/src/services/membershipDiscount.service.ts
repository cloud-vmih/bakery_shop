import { MembershipDiscountDB } from "../db/membershipDiscount.db";

interface CreatePayload {
  title: string;
  discountAmount: number;
  minPoints: number;
  itemIds?: number[];   
  startAt?: string;
  endAt?: string;
  isActive?: boolean;
}

const normalizeDate = (value?: string) => {
  return value ? new Date(value) : undefined;
};

export const MembershipDiscountService = {
  async getAll() {
    return MembershipDiscountDB.findAll();
  },

  async create(payload: CreatePayload) {
    const { discountAmount, itemIds, startAt, endAt } = payload;

    if (discountAmount < 0 || discountAmount > 100) {
      throw new Error("INVALID_DISCOUNT_AMOUNT");
    }

    if (itemIds !== undefined && itemIds.length === 0) {
      throw new Error("ITEMS_NOT_FOUND");
    }

    if (startAt && endAt && new Date(endAt) <= new Date(startAt)) {
      throw new Error("INVALID_DATE");
    }

    return MembershipDiscountDB.create({
      title: payload.title,
      discountAmount: payload.discountAmount,
      minPoints: payload.minPoints,
      itemIds,
      startAt: normalizeDate(startAt),
      endAt: normalizeDate(endAt),
      isActive: payload.isActive ?? true,
    });
  },

  async update(id: number, payload: Partial<CreatePayload>) {
    const existed = await MembershipDiscountDB.findById(id);
    if (!existed) {
      throw new Error("DISCOUNT_NOT_FOUND");
    }

    if (
      payload.discountAmount !== undefined &&
      (payload.discountAmount < 0 || payload.discountAmount > 100)
    ) {
      throw new Error("INVALID_DISCOUNT_AMOUNT");
    }

    if (payload.itemIds !== undefined && payload.itemIds.length === 0) {
      throw new Error("ITEMS_NOT_FOUND");
    }

    if (
      payload.startAt &&
      payload.endAt &&
      new Date(payload.endAt) <= new Date(payload.startAt)
    ) {
      throw new Error("INVALID_DATE");
    }

    const dbPayload = {
      title: payload.title,
      discountAmount: payload.discountAmount,
      minPoints: payload.minPoints,
      startAt: normalizeDate(payload.startAt),
      endAt: normalizeDate(payload.endAt),
    };

    return MembershipDiscountDB.update(
      id,
      dbPayload,
      payload.itemIds 
    );
  },

  async remove(id: number) {
    const existed = await MembershipDiscountDB.findById(id);
    if (!existed) {
      throw new Error("DISCOUNT_NOT_FOUND");
    }

    return MembershipDiscountDB.remove(id);
  },
};
