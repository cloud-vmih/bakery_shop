import { AppDataSource } from "../config/database";
import { Order } from "../entity/Orders";
import { OrderInfo } from "../entity/OrderInfo";
import { OrderDetail } from "../entity/OrderDetails";
import { EOrderStatus } from "../entity/enum/enum";
import { Address } from "../entity/Address";
import { Item } from "../entity/Item";
import { User } from "../entity/User";

type CreateOrderPayload = {
  customerId: number;
  info: {
    cusName: string;
    cusPhone: string;
    cusGmail: string;
    addressId: number;
    deliveryDate: string;
    timeFrame: string;
    note?: string;
  };
  items: Array<{ itemId: number; quantity: number }>;
};

export const createFullOrderDB = async (payload: CreateOrderPayload) => {
  return await AppDataSource.transaction(async (manager) => {
    /** 1️⃣ CREATE ORDER */
    const orderRepo = manager.getRepository(Order);
    const order = orderRepo.create({
      customer: { id: payload.customerId } as User,
      status: EOrderStatus.PENDING,
      createAt: new Date(),
    });
    const savedOrder = await orderRepo.save(order);

    /** 2️⃣ CREATE ORDER INFO */
    const orderInfoRepo = manager.getRepository(OrderInfo);
    const orderInfo = orderInfoRepo.create({
      orderID: savedOrder.id!,
      order: savedOrder,
      cusName: payload.info.cusName,
      cusPhone: payload.info.cusPhone,
      cusGmail: payload.info.cusGmail,
      address: { id: payload.info.addressId } as Address,
      deliveryDate: payload.info.deliveryDate,
      timeFrame: payload.info.timeFrame,
      note: payload.info.note,
    });
    await orderInfoRepo.save(orderInfo);

    /** 3️⃣ CREATE ORDER DETAILS */
    const orderDetailRepo = manager.getRepository(OrderDetail);

    for (const it of payload.items) {
      const od = orderDetailRepo.create({
        orderID: savedOrder.id!,
        itemID: it.itemId,
        order: savedOrder,
        item: { id: it.itemId } as Item,
        quantity: it.quantity,
      });
      await orderDetailRepo.save(od);
    }

    return savedOrder;
  });
};

export const updateOrderStatusDB = async (
  orderId: number,
  status: EOrderStatus
) => {
  const repo = AppDataSource.getRepository(Order);
  const order = await repo.findOne({ where: { id: orderId } });

  if (!order) throw new Error("Đơn hàng không tồn tại");

  order.status = status;
  return await repo.save(order);
};

export const findOrderByIdDB = async (orderId: number) => {
  const repo = AppDataSource.getRepository(Order);
  return await repo.findOne({
    where: { id: orderId },
    relations: {
      orderDetails: { item: true },
    },
  });
};
