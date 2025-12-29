import { AppDataSource } from "../config/database";
import { MembershipDiscount } from "../entity/MembershipDiscount";
import { Item } from "../entity/Item";

const repo = AppDataSource.getRepository(MembershipDiscount);

export const MembershipDiscountDB = {
  async findAll() {
    return repo.find({
      relations: ["items"],
      order: { createdAt: "DESC" },
    });
  },

  async findById(id: number) {
    return repo.findOne({
      where: { id },
      relations: ["items"],
    });
  },

  async create(data: {
    title: string;
    discountAmount: number;
    minPoints: number;
    itemIds?: number[];
    startAt?: Date;
    endAt?: Date;
    isActive?: boolean;
  }) {
    const discount = repo.create({
      title: data.title,
      discountAmount: data.discountAmount,
      minPoints: data.minPoints,
      startAt: data.startAt,
      endAt: data.endAt,
      isActive: data.isActive ?? true,
      items: data.itemIds
        ? data.itemIds.map(id => ({ id } as Item))
        : [],
    });

    return repo.save(discount);
  },

  async update(
    id: number,
    data: Partial<MembershipDiscount>,
    itemIds?: number[]
  ) {
    const existed = await repo.findOne({
      where: { id },
      relations: ["items"],
    });

    if (!existed) {
      throw new Error("DISCOUNT_NOT_FOUND");
    }

    Object.assign(existed, data);

    if (itemIds !== undefined) {
      existed.items = itemIds.map(id => ({ id } as Item));
    }

    return repo.save(existed);
  },

  async remove(id: number) {
    return repo.delete(id);
  },
};
