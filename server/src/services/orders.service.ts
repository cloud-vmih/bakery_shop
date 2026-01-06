import {
  createOrderDB,
  updateOrderStatusDB,
  findOrderFullByIdDB,
} from "../db/orders.db";
import { EOrderStatus } from "../entity/enum/enum";

export class OrdersService {
  /**
   * CREATE ORDER
   * - luôn tạo PENDING
   * - lưu branchId vào OrderInfo
   */
  async createOrder(userId: number, payload: any) {
    return createOrderDB({
      customerId: userId,

      branchId: payload.branchId,

      info: {
        cusName: payload.customer.fullName,
        cusPhone: payload.customer.phone,
        cusGmail: payload.customer.email || "",
        addressId: payload.address.addressId,
        note: payload.note,
      },

      items: payload.items.map((i: any) => ({
        itemId: i.item.id,
        quantity: i.quantity,
        note: i.note || null,
      })),
    });
  }

  /**
   * CONFIRM ORDER
   * - COD hoặc VNPAY success
   */
  async confirmOrder(orderId: number) {
    return updateOrderStatusDB(orderId, EOrderStatus.CONFIRMED);
  }

  /**
   * CANCEL ORDER
   * - VNPAY failed / canceled
   */
  async cancelOrder(orderId: number) {
    return updateOrderStatusDB(orderId, EOrderStatus.CANCELED);
  }

  /**
   * GET FULL ORDER
   * - Success page
   * - VNPay callback
   */
  async getOrderFull(orderId: number) {
    const order = await findOrderFullByIdDB(orderId);
    if (!order) {
      throw new Error("Order not found");
    }
    return order;
  }
}
