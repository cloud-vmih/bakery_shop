// server/src/db/repositories/order.repository.ts

import { AppDataSource } from "../config/database";
import { Order } from "../entity/Orders";

const orderRepository = AppDataSource.getRepository(Order);

export const orderRepo = {
  findByCustomerId: async (userId: number) => {
    return await orderRepository.find({
      where: { customer: { id: userId } },
      select: ["id", "createAt", "status"],
      order: { createAt: "DESC" },
    });
  },

  findOneByIdAndCustomer: async (orderId: number, userId: number) => {
    return await orderRepository.findOne({
      where: {
        id: orderId,
        customer: { id: userId },
      },
      relations: ["orderDetails"],
    });
  },
};