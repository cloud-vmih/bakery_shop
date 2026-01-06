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
