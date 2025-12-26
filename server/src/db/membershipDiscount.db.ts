import { AppDataSource } from "../config/database";
import { MembershipDiscount } from "../entity/MembershipDiscount";
import { Item } from "../entity/Item";

const repo = AppDataSource.getRepository(MembershipDiscount);
const itemRepo = AppDataSource.getRepository(Item);

export const MembershipDiscountDB = {
  async findAll() {
    return await repo.find({
      relations: ["item"], // Load relation
      order: { createdAt: "DESC" },
    });
  },

  async findById(id: number) {
    return await repo.findOne({
      where: { id },
      relations: ["item"],
    });
  },

  async create(data: {
    title: string;
    discountAmount: number;
    minPoints: number;
    itemId?: number;
    startAt?: Date | null;
    endAt?: Date | null;
    isActive?: boolean;
  }) {
    let item: Item | undefined = undefined; // FIX: undefined thay vì null
    if (data.itemId) {
      item = await itemRepo.findOne({ where: { id: data.itemId } }) ?? undefined;
      if (!item) return null;
    }

    const discount = repo.create({
      item, // TS ok vì field item optional
      title: data.title,
      discountAmount: data.discountAmount,
      minPoints: data.minPoints,
      startAt: data.startAt ?? undefined,
      endAt: data.endAt ?? undefined,
      isActive: data.isActive ?? true,
    });

    return await repo.save(discount);
  },

  async update(id: number, data: Partial<MembershipDiscount>) {
    const existed = await repo.findOne({ where: { id } });
    if (!existed) {
      throw new Error("DISCOUNT_NOT_FOUND");
    }

    if (data.itemId !== undefined) {
      const item = data.itemId ? await itemRepo.findOne({ where: { id: data.itemId } }) ?? undefined : undefined;
      if (data.itemId && !item) return null;
      data.item = item; // TS ok: Item | undefined
    }

    return await repo.update(id, data);
  },

  async remove(id: number) {
    return await repo.delete(id);
  },
};
