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
   */
  async createOrder(userId: number, payload: any) {
    return createOrderDB({
      customerId: userId,
      info: {
        cusName: payload.customer.fullName,
        cusPhone: payload.customer.phone,
        cusGmail: payload.customer.email || "",
        addressId: payload.address.addressId,
        deliveryDate: payload.delivery.deliveryDate,
        timeFrame: payload.delivery.timeFrame,
        note: payload.note,
      },
      items: payload.items.map((i: any) => ({
        itemId: i.item.id,
        quantity: i.quantity,
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
   */
  async getOrderFull(orderId: number) {
    const order = await findOrderFullByIdDB(orderId);
    if (!order) {
      throw new Error("Order not found");
    }
    return order;
  }
}
