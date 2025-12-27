import { AppDataSource } from "../config/database";
import { Order } from "../entity/Orders";
import { OrderDetail } from "../entity/OrderDetails";
import { OrderInfo } from "../entity/OrderInfo";

export const orderRepo = AppDataSource.getRepository(Order);
export const orderDetailRepo = AppDataSource.getRepository(OrderDetail);
export const orderInfoRepo = AppDataSource.getRepository(OrderInfo);

export const findOrdersWithFilter = async (queryBuilder: any) => {
  return await queryBuilder.getMany();
};

export const findOrderById = async (orderId: number) => {
  return await orderRepo.findOne({
    where: { id: orderId },
    relations: ["customer", "orderDetails"],
  });
};

export const saveOrder = async (order: Order) => {
  return await orderRepo.save(order);
};

export const saveOrderInfo = async (info: OrderInfo) => {
  return await orderInfoRepo.save(info);
};
