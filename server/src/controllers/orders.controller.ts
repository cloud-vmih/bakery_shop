import { Request, Response } from "express";
import { OrdersService } from "../services/orders.service";
import { PaymentService } from "../services/payment.service";
import {
  reserveInventoryForOrder,
  commitInventoryForOrder,
} from "../services/inventory.service";
import { EPayment,ENotiType } from "../entity/enum/enum";
import { getAdminAndStaffIds } from "../services/user.service";
import { sendNotification } from "../services/notification.service";

const ordersService = new OrdersService();
const paymentService = new PaymentService();

/**
 * CREATE ORDER
 * - Luôn giữ hàng trước
 * - COD: giữ → tạo order → tạo payment → trừ kho → confirm
 * - VNPAY: giữ → tạo order → tạo payment → chờ callback
 */
export const createOrder = async (req: any, res: Response) => {
  try {
    const userId = req.user.id;

    const {
      paymentMethod,
      branchId,
      items, // [{ itemId, quantity }]
    } = req.body;

    console.log(`branch id : ${branchId}`)

    const inventoryItems = items.map((i: any) => ({
      itemId: i.item?.id, // 👈 LẤY ĐÚNG
      quantity: i.quantity,
    }));

    /* =========================
       1️⃣ GIỮ HÀNG
    ========================= */
    await reserveInventoryForOrder(branchId, inventoryItems);

    /* =========================
       2️⃣ TẠO ORDER (PENDING)
    ========================= */
    const order = await ordersService.createOrder(userId, req.body);
  
    /* =========================
       3️⃣ COD FLOW
    ========================= */
    if (paymentMethod === EPayment.COD) {
      // tạo payment COD
      await paymentService.createPayment(order.id!, EPayment.COD);

      // trừ kho thật
      await commitInventoryForOrder(branchId, inventoryItems);

      // confirm order
      await ordersService.confirmOrder(order.id!);

      await sendNotification(
        [userId],
        "Đặt hàng thành công",
        `Đơn hàng #${order.id} của bạn đã được xác nhận`,
        ENotiType.ORDER,
        `/orderDetails/${order.id}`
      );

      const adminStaffIds = await getAdminAndStaffIds();

      await sendNotification(
        adminStaffIds,
        "Đơn hàng mới",
        `Có đơn hàng mới #${order.id} cần xử lý`,
        ENotiType.ORDER,
        `/admin/manage-orders`
      );

      return res.status(201).json({
        success: true,
        orderId: order.id,
        orderStatus: "CONFIRMED",
        paymentMethod: "COD",
      });
    }

    /* =========================
       4️⃣ VNPAY FLOW
       - chỉ giữ hàng
       - chờ callback xử lý tiếp
    ========================= */
    await paymentService.createPayment(order.id!, EPayment.VNPAY);

    //

    return res.status(201).json({
      success: true,
      orderId: order.id,
      orderStatus: "PENDING",
      paymentMethod: "VNPAY",
    });
  } catch (e: any) {
    return res.status(400).json({
      success: false,
      message: e.message,
    });
  }
};

/**
 * GET ORDER DETAIL
 */
export const getOrderById = async (req: Request, res: Response) => {
  try {
    const orderId = Number(req.params.orderId);

    const order = await ordersService.getOrderFull(orderId);

    return res.status(200).json({
      success: true,
      data: order,
    });
  } catch (e: any) {
    return res.status(404).json({
      success: false,
      message: e.message,
    });
  }
};



