import { AppDataSource } from "../config/database";
import { Order } from "../entity/Orders";
import { OrderDetail } from "../entity/OrderDetails";

export const orderRepo = AppDataSource.getRepository(Order);
export const orderDetailRepo = AppDataSource.getRepository(OrderDetail);

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

export const saveOrderDetail = async (detail: OrderDetail) => {
  return await orderDetailRepo.save(detail);
};
