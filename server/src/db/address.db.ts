import { AppDataSource } from "../config/database";
import { Address } from "../entity/Address";

export const findAddressesByCustomerId = async (customerId: number) => {
  return await AppDataSource.getRepository(Address).find({
    where: {
      customer: { id: customerId },
    },
    order: {
      isDefault: "DESC",
    },
  });
};
