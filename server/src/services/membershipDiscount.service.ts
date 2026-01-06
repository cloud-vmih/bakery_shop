import { MembershipDiscountDB } from "../db/membershipDiscount.db";
import { AppDataSource } from "../config/database";  // ← GIỮ: Cho repo query eligible discounts
import { MembershipDiscount } from "../entity/MembershipDiscount";  // ← GIỮ: Cho query
import { Customer } from "../entity/Customer";  // ← THÊM: Import Customer entity (để lấy membershipPoints)
import { Item } from "../entity/Item";  // ← GIỮ: Cho match cart items (nếu cần)

const discountRepo = AppDataSource.getRepository(MembershipDiscount);  // ← GIỮ: Repo cho query discounts
const customerRepo = AppDataSource.getRepository(Customer);  // ← THÊM: Repo cho Customer

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

  // ← THÊM: Hàm auto-apply discount dựa trên points (từ Customer.membershipPoints)
  async calculateDiscountWithPoints(customerId: number, totalAmount: number, cartItems: any[]) {  // cartItems: [{ itemId, price, quantity }, ...]
    // Lấy membershipPoints trực tiếp từ Customer entity (tích hợp flow points sẵn)
    const customer = await customerRepo.findOne({ where: { id: customerId }, select: ["membershipPoints"] });
    if (!customer) throw new Error("User not found");
    const totalPoints = customer.membershipPoints || 0;  // Từ field membershipPoints trong Customer

    const now = new Date();

    // Query eligible discounts (active, points đủ, date ok)
    const qb = discountRepo.createQueryBuilder("discount");
    qb.where("discount.isActive = true")
      .andWhere("discount.minPoints <= :totalPoints", { totalPoints })  // totalPoints >= minPoints
      .andWhere("(discount.startAt IS NULL OR discount.startAt <= :now)", { now })
      .andWhere("(discount.endAt IS NULL OR discount.endAt >= :now)", { now });
    const eligibleDiscounts = await qb.leftJoinAndSelect("discount.items", "items").getMany();  // Load items relation

    let totalDiscount = 0;
    let appliedDiscounts = [];  // Chi tiết discounts apply

    for (const discount of eligibleDiscounts) {
      let applyAmount = totalAmount;  // Default toàn bộ đơn

      // Nếu có items, chỉ apply cho matching cart items
      if (discount.items && discount.items.length > 0) {
        const matchingItemsTotal = cartItems
          .filter(item => discount.items!.some((dItem: Item) => dItem.id === item.itemId))
          .reduce((sum, item) => sum + (item.price * item.quantity), 0);
        if (matchingItemsTotal === 0) continue;  // Skip nếu không match
        applyAmount = matchingItemsTotal;
      }

      const discountValue = applyAmount * (discount.discountAmount / 100);
      totalDiscount += discountValue;
      appliedDiscounts.push({
        discountId: discount.id,
        title: discount.title,
        amount: discountValue,
        appliedOn: discount.items ? 'specific_items' : 'total_order',
      });
    }

    return {
      totalDiscount,  // Tổng giảm VNĐ
      appliedDiscounts,  // Chi tiết
      finalAmount: totalAmount - totalDiscount,
      usedPoints: totalPoints,  // Info points dùng để qualify
    };
  },
};