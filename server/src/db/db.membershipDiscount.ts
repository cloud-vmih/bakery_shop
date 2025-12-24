import { AppDataSource } from "../config/database";
import { MembershipDiscount } from "../entity/MembershipDiscount";

export const MembershipDiscountDB = {
  findAll() {
    return AppDataSource.getRepository(MembershipDiscount).find({
      order: { createdAt: "DESC" },
    });
  },

  findById(id: number) {
    return AppDataSource.getRepository(MembershipDiscount).findOne({
      where: { id },
    });
  },
findByCode(code: string) {
  return AppDataSource.getRepository(MembershipDiscount).findOne({
    where: { code },
  });
},

  create(data: Partial<MembershipDiscount>) {
    return AppDataSource.getRepository(MembershipDiscount).save(data);
  },

  update(id: number, data: Partial<MembershipDiscount>) {
    return AppDataSource.getRepository(MembershipDiscount).update(id, data);
  },

  remove(id: number) {
    return AppDataSource.getRepository(MembershipDiscount).delete(id);
  },
};
