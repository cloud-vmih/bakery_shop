<<<<<<< HEAD
import { AppDataSource } from "../config/database";
import { Order } from "../entity/Orders";
import { OrderInfo } from "../entity/OrderInfo";
import { OrderDetail } from "../entity/OrderDetails";
import { EOrderStatus } from "../entity/enum/enum";
import { User } from "../entity/User";
import { Address } from "../entity/Address";
import { Item } from "../entity/Item";

type CreateOrderPayload = {
  customerId: number;
  info: {
    cusName: string;
    cusPhone: string;
    cusGmail: string;
    addressId: number;
    // deliveryDate: string;
    // timeFrame: string;
    note?: string;
  };
  items: Array<{ itemId: number; quantity: number }>;
};

export const createOrderDB = async (payload: CreateOrderPayload) => {
  return AppDataSource.transaction(async (manager) => {
    const orderRepo = manager.getRepository(Order);

    const order = orderRepo.create({
      customer: { id: payload.customerId } as User,
      status: EOrderStatus.PENDING,
      createAt: new Date(),
    });
    const savedOrder = await orderRepo.save(order);

    const infoRepo = manager.getRepository(OrderInfo);
    await infoRepo.save(
      infoRepo.create({
        order: savedOrder,
        cusName: payload.info.cusName,
        cusPhone: payload.info.cusPhone,
        cusGmail: payload.info.cusGmail,
        address: { id: payload.info.addressId } as Address,
        // deliveryDate: payload.info.deliveryDate,
        // timeFrame: payload.info.timeFrame,
        note: payload.info.note,
      })
    );

    const detailRepo = manager.getRepository(OrderDetail);
    await detailRepo.save(
      payload.items.map((i) =>
        detailRepo.create({
          order: savedOrder,
          item: { id: i.itemId } as Item,
          quantity: i.quantity,
        })
      )
    );

    return savedOrder;
  });
};

export const updateOrderStatusDB = async (
  orderId: number,
  status: EOrderStatus
) => {
  const repo = AppDataSource.getRepository(Order);
  const result = await repo.update({ id: orderId }, { status });
  if (!result.affected) throw new Error("Order not found");
  return repo.findOneBy({ id: orderId });
};

export const findOrderFullByIdDB = async (orderId: number) => {
  return AppDataSource.getRepository(Order).findOne({
    where: { id: orderId },
    relations: {
      orderDetails: { item: true },
    },
  });
};
=======
// server/src/db/repositories/order.repository.ts

import { AppDataSource } from "../config/database";
import { Order } from "../entity/Orders";

const orderRepository = AppDataSource.getRepository(Order);

export const orderRepo = {
    findByCustomerId: async (userId: number) => {
      return await orderRepository.find({
        where: { customer: { id: userId } },
        relations: ["orderDetails"],
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
      relations: ["orderDetails", "customer", "payment"],
    });
  },

  save: async (order: Order) => {
    return await orderRepository.save(order);
  }
};
>>>>>>> feature/updateQuantity-v2
