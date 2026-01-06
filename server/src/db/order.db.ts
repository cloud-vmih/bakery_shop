// server/src/db/repositories/order.repository.ts

import { AppDataSource } from "../config/database";
import { Order } from "../entity/Orders";

const orderRepository = AppDataSource.getRepository(Order);

export const orderRepo = {
    findByCustomerId: async (userId: number) => {
      return await orderRepository.find({
        where: { customer: { id: userId } },
        relations: ["orderDetails", "orderDetails.item", "orderDetails.item.discount", "orderInfo", "orderInfo.address"],
        // Tùy chọn: chỉ lấy các field cần của orderDetails
        });
    },

  findOneByIdAndCustomer: async (orderId: number, userId: number) => {
    console.log(orderId, userId)
    return await orderRepository.findOne({
      where: {
        id: orderId,
        customer: { id: userId },
      },
      relations: ["orderDetails", "customer", "payment", "orderDetails.item", "orderInfo"],
    });
  },

  save: async (order: Order) => {
    return await orderRepository.save(order);
  }
};