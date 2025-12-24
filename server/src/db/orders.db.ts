// import { AppDataSource } from "../config/database";
// import { Order } from "../entity/Orders";
// import { OrderInfo } from "../entity/OrderInfo";
// import { OrderDetail } from "../entity/OrderDetails";
// import { EOrderStatus } from "../entity/enum/enum";
// import { User } from "../entity/User";
// import { Address } from "../entity/Address";
// import { Item } from "../entity/Item";

// type CreateOrderPayload = {
//   customerId: number;
//   info: {
//     cusName: string;
//     cusPhone: string;
//     cusGmail: string;
//     addressId: number;
//     note?: string;
//   };
//   items: Array<{ itemId: number; quantity: number }>;
// };

// export const createOrderDB = async (payload: CreateOrderPayload) => {
//   return AppDataSource.transaction(async (manager) => {
//     const orderRepo = manager.getRepository(Order);

//     const order = orderRepo.create({
//       customer: { id: payload.customerId } as User,
//       status: EOrderStatus.PENDING,
//       createAt: new Date(),
//     });
//     const savedOrder = await orderRepo.save(order);

//     const infoRepo = manager.getRepository(OrderInfo);
//     await infoRepo.save(
//       infoRepo.create({
//         order: savedOrder,
//         cusName: payload.info.cusName,
//         cusPhone: payload.info.cusPhone,
//         cusGmail: payload.info.cusGmail,
//         address: { id: payload.info.addressId } as Address,
//         note: payload.info.note,
//       })
//     );

//     const detailRepo = manager.getRepository(OrderDetail);
//     await detailRepo.save(
//       payload.items.map((i) =>
//         detailRepo.create({
//           order: savedOrder,
//           item: { id: i.itemId } as Item,
//           quantity: i.quantity,
//         })
//       )
//     );

//     return savedOrder;
//   });
// };

// export const updateOrderStatusDB = async (
//   orderId: number,
//   status: EOrderStatus
// ) => {
//   const repo = AppDataSource.getRepository(Order);
//   const result = await repo.update({ id: orderId }, { status });
//   if (!result.affected) throw new Error("Order not found");
//   return repo.findOneBy({ id: orderId });
// };

// export const findOrderFullByIdDB = async (orderId: number) => {
//   return AppDataSource.getRepository(Order).findOne({
//     where: { id: orderId },
//     relations: {
//       orderDetails: { item: true },
//     },
//   });
// };
import { AppDataSource } from "../config/database";
import { Order } from "../entity/Orders";
import { OrderInfo } from "../entity/OrderInfo";
import { OrderDetail } from "../entity/OrderDetails";
import { EOrderStatus } from "../entity/enum/enum";
import { User } from "../entity/User";
import { Address } from "../entity/Address";
import { Item } from "../entity/Item";

/* =========================
   TYPES
========================= */
type CreateOrderPayload = {
  customerId: number;

  // ✅ THÊM branchId
  branchId: number;

  info: {
    cusName: string;
    cusPhone: string;
    cusGmail: string;
    addressId: number;
    note?: string;
  };

  items: Array<{ itemId: number; quantity: number }>;
};

/* =========================
   CREATE ORDER (TRANSACTION)
========================= */
export const createOrderDB = async (payload: CreateOrderPayload) => {
  return AppDataSource.transaction(async (manager) => {
    /* ---------- ORDER ---------- */
    const orderRepo = manager.getRepository(Order);

    const order = orderRepo.create({
      customer: { id: payload.customerId } as User,
      status: EOrderStatus.PENDING,
      createAt: new Date(),
    });

    const savedOrder = await orderRepo.save(order);

    /* ---------- ORDER INFO ---------- */
    const infoRepo = manager.getRepository(OrderInfo);

    await infoRepo.save(
      infoRepo.create({
        order: savedOrder,
        cusName: payload.info.cusName,
        cusPhone: payload.info.cusPhone,
        cusGmail: payload.info.cusGmail,
        address: { id: payload.info.addressId } as Address,
        note: payload.info.note,

        // ✅ LƯU BRANCH ID Ở ĐÂY
        branchId: payload.branchId,
      })
    );

    /* ---------- ORDER DETAILS ---------- */
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

/* =========================
   UPDATE STATUS
========================= */
export const updateOrderStatusDB = async (
  orderId: number,
  status: EOrderStatus
) => {
  const repo = AppDataSource.getRepository(Order);
  const result = await repo.update({ id: orderId }, { status });

  if (!result.affected) {
    throw new Error("Order not found");
  }

  return repo.findOneBy({ id: orderId });
};

/* =========================
   FIND FULL ORDER (FOR SUCCESS / VNPAY)
========================= */
export const findOrderFullByIdDB = async (orderId: number) => {
  return AppDataSource.getRepository(Order).findOne({
    where: { id: orderId },
    relations: {
      orderInfo: true, // ✅ THÊM
      orderDetails: { item: true },
    },
  });
};
