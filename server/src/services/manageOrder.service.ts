import {
  orderRepo,
  findOrderById,
  saveOrder,
  saveOrderInfo,
} from "../db/manageOrder.db";
import { updatePaymentStatusDB } from "../db/payment.db";
import { EOrderStatus, ECancelStatus, EPayStatus, EPayment } from "../entity/enum/enum";
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
  cancelNote: string,
  handledBy: string = "ADMIN_OR_STAFF"
) => {
  const order = await findOrderById(orderId);
  if (!order) throw new Error("Đơn hàng không tồn tại");

  if (
    [EOrderStatus.DELIVERING, EOrderStatus.COMPLETED].includes(order.status!)
  ) {
    throw new Error("Không thể hủy khi đơn đang giao hoặc đã hoàn thành");
  }

  if (!cancelNote?.trim()) {
    throw new Error("Vui lòng nhập lý do hủy");
  }

  order.status = EOrderStatus.CANCELED;
  order.cancelStatus = ECancelStatus.APPROVED;
  order.cancelNote = cancelNote.trim();
  order.cancelHandledBy = handledBy;


  // Ghi lịch sử vào orderInfo.note (nếu cần)
  if (order.orderInfo) {
    const historyNote = `Admin hủy đơn: ${cancelNote.trim()}`;
    if (order.orderInfo.note) {
      order.orderInfo.note += ` | ${historyNote}`;
    } else {
      order.orderInfo.note = historyNote;
    }
    await saveOrderInfo(order.orderInfo);
  }

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
  handledById?: string | null,  // Optional: ID người xử lý (nếu có)
  note?: string
) => {
  const order = await findOrderById(orderId);
  if (!order) throw new Error("Đơn hàng không tồn tại");

  if (order.cancelStatus !== ECancelStatus.REQUESTED) {
    throw new Error("Không có yêu cầu hủy nào đang chờ xử lý");
  }

  // Ghi người xử lý: dùng ID thật nếu có, không thì fallback chung
  const processor = handledById?.trim() ? handledById.trim() : "ADMIN_OR_STAFF";
  order.cancelHandledBy = processor;

  // Chuẩn bị text mô tả người xử lý cho lịch sử note
  const processorText = handledById?.trim()
    ? `Nhân viên (ID: ${handledById.trim()})`
    : "Nhân viên";

  if (action === "approve") {
    if ([EOrderStatus.DELIVERING, EOrderStatus.COMPLETED].includes(order.status!)) {
      throw new Error("Không thể duyệt hủy khi đơn đang giao hoặc đã hoàn thành");
    }

    order.status = EOrderStatus.CANCELED;
    order.cancelStatus = ECancelStatus.APPROVED;
    order.cancelNote = note?.trim() || "Duyệt hủy theo yêu cầu khách hàng";

    // Ghi lịch sử duyệt
    const historyNote = note?.trim()
      ? ` | ${processorText} duyệt hủy: ${note.trim()}`
      : ` | ${processorText} duyệt hủy đơn`;

    if (order.orderInfo) {
      order.orderInfo.note = (order.orderInfo.note || "") + historyNote;
      await saveOrderInfo(order.orderInfo);
    }
  } else {
    // action === "reject"
    order.cancelStatus = ECancelStatus.REJECTED;
    order.cancelNote = note?.trim() ? `Từ chối: ${note.trim()}` : "Từ chối yêu cầu hủy";

    // Ghi lịch sử từ chối
    const historyNote = note?.trim()
      ? ` | ${processorText} từ chối hủy: ${note.trim()}`
      : " | ${processorText} từ chối yêu cầu hủy";

    if (order.orderInfo) {
      order.orderInfo.note = (order.orderInfo.note || "") + historyNote;
      await saveOrderInfo(order.orderInfo);
    }
  }
  
  return await saveOrder(order);
};

/* ================== GET LIST ================== */
export const getOrderList = async (filters: any) => {
  let query = orderRepo
    .createQueryBuilder("order")
    .leftJoinAndSelect("order.customer", "customer")
    .leftJoinAndSelect("order.orderDetails", "orderDetail")
    .leftJoinAndSelect("orderDetail.item", "item")
    .leftJoinAndSelect("order.payment", "payment")
    .leftJoinAndSelect("order.orderInfo", "orderInfo")
    .orderBy("order.createAt", "DESC");

  // 1. Trạng thái đơn hàng
  if (filters.status) {
    query.andWhere("order.status = :status", { status: filters.status });
  }

  // 2. Tên khách hàng (LIKE, không phân biệt hoa thường)
  if (filters.customerName) {
    query.andWhere("LOWER(customer.fullName) LIKE LOWER(:name)", {
      name: `%${filters.customerName}%`,
    });
  }

  // 3. Số điện thoại
  if (filters.phone) {
    query.andWhere("customer.phoneNumber LIKE :phone", {
      phone: `%${filters.phone}%`,
    });
  }

  // 4. ID đơn hàng
  if (filters.orderId) {
    query.andWhere("order.id = :orderId", { orderId: Number(filters.orderId) });
  }

  // 5. Phương thức thanh toán
  if (filters.paymentMethod) {
    query.andWhere("payment.paymentMethod = :paymentMethod", {
      paymentMethod: filters.paymentMethod,
    });
  }

  // 6. Trạng thái thanh toán
  if (filters.payStatus) {
    query.andWhere("payment.status = :payStatus", { payStatus: filters.payStatus });
  }

  // 7. Trạng thái hủy đơn
  if (filters.cancelStatus) {
    query.andWhere("order.cancelStatus = :cancelStatus", {
      cancelStatus: filters.cancelStatus,
    });
  }

  // 8. Khoảng thời gian (có xử lý startOf/endOf ngày để chính xác)
  if (filters.fromDate && filters.toDate) {
    const from = dayjs(filters.fromDate, "DD/MM/YYYY").startOf("day").toDate();
    const to = dayjs(filters.toDate, "DD/MM/YYYY").endOf("day").toDate();
    query.andWhere("order.createAt >= :from", { from });
    query.andWhere("order.createAt <= :to", { to });
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

  if (newStatus === EOrderStatus.COMPLETED) {
    if (
      order.payment &&
      order.payment.paymentMethod === EPayment.COD
    ) {
      order.payment.status = EPayStatus.PAID;
    }
  }
  order.status = newStatus;
  await updatePaymentStatusDB(order.payment?.id || 0, order.payment?.status || EPayStatus.PENDING);
  return await saveOrder(order);
};

/* ================== INVOICE ================== */
export const generateInvoiceHTML = (order: Order) => {
  const templatePath = path.join(__dirname, "../templates/invoice.html");
  let html = fs.readFileSync(templatePath, "utf-8");

  const note = order.orderInfo?.note || "";

  // Tính subtotal và tạo bảng sản phẩm với căn chỉnh đẹp
  let subtotal = 0;
  let productRows = "";

  if (order.orderDetails && order.orderDetails.length > 0) {
    order.orderDetails.forEach((detail) => {
      const item = detail.item;
      const name = item?.name || "Sản phẩm không xác định";
      const quantity = detail.quantity || 0;
      const price = item?.price || 0;
      const lineTotal = price * quantity;
      subtotal += lineTotal;

      productRows += `
        <tr style="font-size: 15px;">
          <td style="padding: 12px 8px; border-bottom: 1px solid #eee;">${name}</td>
          <td align="center" style="padding: 12px 8px; border-bottom: 1px solid #eee; width: 15%;">${quantity}</td>
          <td align="right" style="padding: 12px 8px; border-bottom: 1px solid #eee; width: 20%;">${price.toLocaleString("vi-VN")} VND</td>
          <td align="right" style="padding: 12px 8px; border-bottom: 1px solid #eee; width: 20%; font-weight: bold;">${lineTotal.toLocaleString("vi-VN")} VND</td>
        </tr>
      `;
    });
  } else {
    productRows = `<tr><td colspan="4" align="center" style="padding: 20px; color: #999;">Không có sản phẩm</td></tr>`;
  }

  // Các khoản thanh toán
  const vatAmount = subtotal * 0.1;
  const shippingFee = 30000;
  const discountAmount = -50000;
  const total = subtotal + vatAmount + shippingFee + discountAmount;

  const formatVND = (amount: number) => Math.abs(amount).toLocaleString("vi-VN");

  return html
    .replace(/{{orderId}}/g, String(order.id || ""))
    .replace(/{{customerName}}/g, order.customer?.fullName || "Khách lẻ")
    .replace(/{{phone}}/g, order.customer?.phoneNumber || "-")
    .replace(/{{date}}/g, new Date(order.createAt!).toLocaleDateString("vi-VN"))
    .replace(/{{status}}/g, String(order.status ?? ""))

    .replace(/{{productRows}}/g, productRows)

    .replace(/{{subtotal}}/g, formatVND(subtotal))
    .replace(/{{vatAmount}}/g, formatVND(vatAmount))
    .replace(/{{shippingFee}}/g, formatVND(shippingFee))
    .replace(/{{discountAmount}}/g, formatVND(discountAmount))
    .replace(/{{total}}/g, formatVND(total))

    .replace(/{{note}}/g, note ? `<p style="margin-top: 30px; font-style: italic; color: #555;"><strong>Ghi chú:</strong> ${note}</p>` : "");
};