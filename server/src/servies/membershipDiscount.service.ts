import { MembershipDiscountDB } from "../db/db.membershipDiscount";

interface CreatePayload {
  // code: string;  // ← XÓA: Bỏ code hoàn toàn
  title: string;
  discountAmount: number;
  minPoints: number;
  itemId?: number;  // ← THÊM: Optional cho sản phẩm cụ thể
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
    const {
      discountAmount,
      startAt,
      endAt,
    } = payload;

    if (discountAmount < 0 || discountAmount > 100) {
      throw new Error("INVALID_DISCOUNT_AMOUNT");
    }

    if (startAt && endAt && new Date(endAt) <= new Date(startAt)) {
      throw new Error("INVALID_DATE");
    }

    // const existed = await MembershipDiscountDB.findByCode(code);  // ← XÓA: Bỏ check code existed
    // if (existed) {
    //   throw new Error("CODE_EXISTED");
    // }

    return MembershipDiscountDB.create({
      ...payload,
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

    if (
      payload.startAt &&
      payload.endAt &&
      new Date(payload.endAt) <= new Date(payload.startAt)
    ) {
      throw new Error("INVALID_DATE");
    }

    return MembershipDiscountDB.update(id, {
      ...payload,
      startAt: normalizeDate(payload.startAt),
      endAt: normalizeDate(payload.endAt),
    });
  },

  async remove(id: number) {
    const existed = await MembershipDiscountDB.findById(id);
    if (!existed) {
      throw new Error("DISCOUNT_NOT_FOUND");
    }

    return MembershipDiscountDB.remove(id);
  },
};