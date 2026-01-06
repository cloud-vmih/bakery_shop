import { AppDataSource } from "../config/database";
import { Order } from "../entity/Orders";
import { OrderDetail } from "../entity/OrderDetails";
import { OrderInfo } from "../entity/OrderInfo";
import { Between, FindManyOptions } from "typeorm";

export const orderRepo = AppDataSource.getRepository(Order);
export const orderDetailRepo = AppDataSource.getRepository(OrderDetail);
export const orderInfoRepo = AppDataSource.getRepository(OrderInfo);

export const findOrdersWithFilter = async (queryBuilder: any) => {
  return await queryBuilder.getMany();
};


/* ================== CHI TIẾT ĐƠN HÀNG - DÙNG CHO IN HÓA ĐƠN ================== */
export const findOrderById = async (orderId: number) => {
  return await orderRepo.findOne({
    where: { id: orderId },
    relations: [
      "customer",
      "orderDetails",          // Join orderDetails
      "orderDetails.item",     // ← QUAN TRỌNG: Join sâu đến Item để lấy name, price
      "payment",               // Nếu có payment (phương thức, trạng thái thanh toán)
      "orderInfo",             // Để lấy note (lịch sử hủy, ghi chú)
    ],
  });
};

export const saveOrder = async (order: Order) => {
  return await orderRepo.save(order);
};

export const saveOrderInfo = async (info: OrderInfo) => {
  return await orderInfoRepo.save(info);
};

export const getNetRevenueInRange = async (from: Date, to: Date): Promise<number> => {
  const orders = await orderRepo.find({
    where: {
      createAt: Between(from, to),
    },
    relations: ["orderDetails", "orderDetails.item"],
    select: {
      id: true,
      orderDetails: {
        quantity: true,
        item: {
          price: true,
        },
      },
    },
  });

  let netRevenue = 0;

  for (const order of orders) {
    for (const detail of order.orderDetails || []) {
      const quantity = detail.quantity || 1;
      const price = detail.item?.price || 0;
      netRevenue += quantity * price;
    }
  }

  return netRevenue;
};

export const findOrdersInRangeWithDetails = async (
  from: Date,
  to: Date,
  options?: FindManyOptions<Order>
) => {
  return await orderRepo.find({
    where: {
      createAt: Between(from, to),
    },
    relations: ["customer", "orderDetails", "orderDetails.item"],
    order: { createAt: "ASC" },
    ...options,
  });
};
