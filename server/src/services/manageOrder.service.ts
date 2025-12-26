import {
  orderRepo,
  findOrderById,
  saveOrder,
  saveOrderInfo,
} from "../db/manageOrder.db";
import { EOrderStatus, ECancelStatus } from "../entity/enum/enum";
import { Order } from "../entity/Orders";
import dayjs from "dayjs";
import fs from "fs";
import path from "path";

/* ================== STATUS FLOW ================== */
const allowedTransitions: Record<EOrderStatus, EOrderStatus[]> = {
  [EOrderStatus.PENDING]: [EOrderStatus.CONFIRMED],
  [EOrderStatus.CONFIRMED]: [EOrderStatus.PREPARING],
  [EOrderStatus.PREPARING]: [EOrderStatus.DELIVERING],
  [EOrderStatus.DELIVERING]: [EOrderStatus.COMPLETED],
  [EOrderStatus.COMPLETED]: [],
  [EOrderStatus.CANCELED]: [],
};

/* ================== ADMIN / STAFF CANCEL ================== */
// Admin / Staff hủy trực tiếp (mọi trạng thái trừ đang giao & hoàn thành)
export const cancelOrder = async (
  orderId: number,
  cancelReason: string,
  handledBy: string = "ADMIN_OR_STAFF"
) => {
  const order = await findOrderById(orderId);
  if (!order) throw new Error("Đơn hàng không tồn tại");

  if (
    [EOrderStatus.DELIVERING, EOrderStatus.COMPLETED].includes(order.status!)
  ) {
    throw new Error("Không thể hủy khi đơn đang giao hoặc đã hoàn thành");
  }

  if (!cancelReason?.trim()) {
    throw new Error("Vui lòng nhập lý do hủy");
  }

  order.status = EOrderStatus.CANCELED;
  order.cancelStatus = ECancelStatus.APPROVED;
  order.cancelReason = cancelReason;
  order.cancelHandledBy = handledBy;

  // if (order.orderDetails?.[0]) {
  //   order.orderDetails[0].note = `Admin/Staff hủy: ${cancelReason}`;
  //   await saveOrderDetail(order.orderDetails[0]);
  // }

  return await saveOrder(order);
};

/* ================== CUSTOMER REQUEST CANCEL ================== */
// Khách hàng chỉ gửi yêu cầu hủy
export const requestCancelOrder = async (
  orderId: number,
  userId: number,
  reason: string
) => {
  const order = await findOrderById(orderId);
  if (!order) throw new Error("Đơn hàng không tồn tại");

  if (order.customer?.id !== userId) {
    throw new Error("Không phải đơn của bạn");
  }

  if (
    [EOrderStatus.DELIVERING, EOrderStatus.COMPLETED].includes(order.status!)
  ) {
    throw new Error("Không thể yêu cầu hủy ở trạng thái này");
  }

  if (order.cancelStatus !== ECancelStatus.NONE) {
    throw new Error("Đã có yêu cầu hủy đang xử lý");
  }

  if (!reason?.trim()) {
    throw new Error("Vui lòng nhập lý do hủy");
  }

  order.cancelStatus = ECancelStatus.REQUESTED;
  order.cancelReason = reason;

  if (order.orderInfo) {
    order.orderInfo.note = `Khách yêu cầu hủy: ${reason}`;
    await saveOrderInfo(order.orderInfo);
  }

  return await saveOrder(order);
};

/* ================== ADMIN / STAFF HANDLE REQUEST ================== */
export const handleCancelRequest = async (
  orderId: number,
  action: "approve" | "reject",
  staffId: string,
  note?: string
) => {
  const order = await findOrderById(orderId);
  if (!order) throw new Error("Đơn hàng không tồn tại");

  if (order.cancelStatus !== ECancelStatus.REQUESTED) {
    throw new Error("Không có yêu cầu hủy nào đang chờ");
  }

  if (action === "approve") {
    if (
      [EOrderStatus.DELIVERING, EOrderStatus.COMPLETED].includes(order.status!)
    ) {
      throw new Error("Không thể duyệt hủy ở trạng thái này");
    }

    order.status = EOrderStatus.CANCELED;
    order.cancelStatus = ECancelStatus.APPROVED;
    order.cancelHandledBy = staffId;
    order.cancelNote = note;

    if (order.orderInfo) {
      order.orderInfo.note += ` | Đã duyệt hủy${
        note ? `: ${note}` : ""
      }`;
      await saveOrderInfo(order.orderInfo);
    }
  } else {
    order.cancelStatus = ECancelStatus.REJECTED;
    order.cancelNote = note;
  }

  return await saveOrder(order);
};

/* ================== GET LIST ================== */
export const getOrderList = async (filters: any) => {
  let query = orderRepo
    .createQueryBuilder("order")
    .leftJoinAndSelect("order.customer", "customer")
    .leftJoinAndSelect("order.orderDetails", "orderDetail")
    .orderBy("order.createAt", "DESC");

  if (filters.status) {
    query.andWhere("order.status = :status", { status: filters.status });
  }

  if (filters.customerName) {
    query.andWhere("LOWER(customer.fullName) LIKE LOWER(:name)", {
      name: `%${filters.customerName}%`,
    });
  }

  if (filters.fromDate) {
    query.andWhere("order.createAt >= :fromDate", {
      fromDate: dayjs(filters.fromDate, "DD/MM/YYYY").toDate(),
    });
  }

  if (filters.toDate) {
    query.andWhere("order.createAt <= :toDate", {
      toDate: dayjs(filters.toDate, "DD/MM/YYYY").toDate(),
    });
  }

  return await query.getMany();
};

/* ================== DETAIL ================== */
export const getOrderDetail = async (orderId: number) => {
  const order = await findOrderById(orderId);
  if (!order) throw new Error("Đơn hàng không tồn tại");
  return order;
};

/* ================== UPDATE STATUS ================== */
export const updateOrderStatus = async (
  orderId: number,
  newStatus: EOrderStatus
) => {
  const order = await findOrderById(orderId);
  if (!order) throw new Error("Đơn hàng không tồn tại");

  if (order.status === EOrderStatus.CANCELED) {
    throw new Error("Đơn đã hủy, không thể cập nhật trạng thái");
  }

  if (!allowedTransitions[order.status!].includes(newStatus)) {
    throw new Error("Không thể chuyển sang trạng thái này");
  }

  order.status = newStatus;
  return await saveOrder(order);
};

/* ================== INVOICE ================== */
export const generateInvoiceHTML = (order: Order) => {
  const templatePath = path.join(__dirname, "../templates/invoice.html");
  let html = fs.readFileSync(templatePath, "utf-8");

  const itemInfo = order.orderDetails?.[0]?.item;
  const note = order.orderInfo?.note || "";
  const subtotal = (order.orderDetails?.[0]?.quantity || 1) * (itemInfo?.price || 0);

  return html
    .replace(/{{orderId}}/g, String(order.id))
    .replace(/{{customerName}}/g, order.customer?.fullName || "Khách lẻ")
    .replace(/{{phone}}/g, order.customer?.phoneNumber || "-")
    .replace(
      /{{date}}/g,
      new Date(order.createAt!).toLocaleDateString("vi-VN")
    )
    .replace(/{{status}}/g, String(order.status ?? ""))
    .replace(/{{itemName}}/g, itemInfo?.name || "Sản phẩm")
    .replace(/{{quantity}}/g, String(order.orderDetails?.[0]?.quantity || 1))
    .replace(/{{price}}/g, String(itemInfo?.price || 0))
    .replace(/{{subtotal}}/g, subtotal.toLocaleString())
    .replace(/{{note}}/g, note);
};
