import { EPayment, EOrderStatus } from "../entity/enum/enum";
import { createFullOrderDB, updateOrderStatusDB } from "../db/orders.db";
import { createPaymentDB } from "../db/payment.db";

export class OrdersService {
  async createOrder(userId: number, payload: any) {
    const { customer, address, delivery, items, paymentMethod } = payload;

    if (!customer?.fullName) throw new Error("Thiếu tên khách hàng");
    if (!customer?.phone) throw new Error("Thiếu số điện thoại");
    if (!address?.addressId) throw new Error("Thiếu địa chỉ giao hàng");
    if (!delivery?.deliveryDate) throw new Error("Thiếu ngày giao");
    if (!delivery?.timeFrame) throw new Error("Thiếu khung giờ giao");
    if (!items || items.length === 0) throw new Error("Đơn hàng trống");
    if (!paymentMethod) throw new Error("Thiếu phương thức thanh toán");

    /** 1️⃣ CREATE ORDER + INFO + DETAILS */
    const order = await createFullOrderDB({
      customerId: userId,
      info: {
        cusName: customer.fullName,
        cusPhone: customer.phone,
        cusGmail: customer.email || "",
        addressId: address.addressId,
        deliveryDate: delivery.deliveryDate,
        timeFrame: delivery.timeFrame,
        note: payload.note,
      },
      items: items.map((i: any) => ({
        itemId: i.item.id,
        quantity: i.quantity,
      })),
    });

    /** 2️⃣ CREATE PAYMENT */
    await createPaymentDB(order, paymentMethod as EPayment);

    /** 3️⃣ COD AUTO CONFIRM */
    if (paymentMethod === EPayment.COD) {
      await updateOrderStatusDB(order.id!, EOrderStatus.CONFIRMED);
      order.status = EOrderStatus.CONFIRMED;
    }

    return {
      orderId: order.id,
      orderStatus: order.status,
      paymentMethod,
    };
  }
}
