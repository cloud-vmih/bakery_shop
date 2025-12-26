// import { Request, Response } from "express";
// import crypto from "crypto";
// import { createVNPayUrl } from "../helpers/vnpay.helper";
// import { PaymentService } from "../services/payment.service";
// import { OrdersService } from "../services/orders.service";
// import { EOrderStatus } from "../entity/enum/enum";

// const paymentService = new PaymentService();
// const ordersService = new OrdersService();

// /**
//  * =========================================
//  * CREATE VNPAY PAYMENT URL
//  * POST /api/payment/vnpay/create
//  * =========================================
//  */
// export const createVNPayPayment = async (req: Request, res: Response) => {
//   try {
//     const { orderId, amount } = req.body;

//     if (!orderId || !amount) {
//       return res.status(400).json({ message: "Thiếu orderId hoặc amount" });
//     }

//     const ipAddr =
//       (req.headers["x-forwarded-for"] as string) ||
//       req.socket.remoteAddress ||
//       "127.0.0.1";

//     const vnpayUrl = createVNPayUrl({
//       orderId,
//       amount,
//       returnUrl: process.env.VNPAY_RETURN_URL!,
//       ipAddr,
//     });

//     return res.json({ vnpayUrl });
//   } catch (error: any) {
//     console.error("❌ CREATE VNPAY URL ERROR", error);
//     return res.status(500).json({
//       message: error.message || "Không tạo được VNPay URL",
//     });
//   }
// };

// /**
//  * =========================================
//  * VNPAY RETURN CALLBACK
//  * GET /api/payment/vnpay/return
//  * =========================================
//  */
// export const vnpayReturn = async (req: Request, res: Response) => {
//   console.log("🔥 VNPAY CALLBACK HIT", req.query);

//   try {
//     const vnp_Params: Record<string, string> = { ...(req.query as any) };

//     const secureHash = vnp_Params["vnp_SecureHash"];
//     delete vnp_Params["vnp_SecureHash"];
//     delete vnp_Params["vnp_SecureHashType"];

//     /**
//      * Encode giống Java URLEncoder
//      */
//     const encodeVNPay = (value: string) =>
//       encodeURIComponent(value).replace(/%20/g, "+");

//     /**
//      * SORT PARAMS A → Z (BẮT BUỘC)
//      */
//     const sortedKeys = Object.keys(vnp_Params).sort();

//     let hashData = "";
//     let first = true;

//     for (const key of sortedKeys) {
//       const value = vnp_Params[key];
//       if (value !== undefined && value !== null && value !== "") {
//         const encodedValue = encodeVNPay(value);

//         if (!first) hashData += "&";
//         first = false;

//         hashData += `${key}=${encodedValue}`;
//       }
//     }

//     /**
//      * VERIFY HASH
//      */
//     const signed = crypto
//       .createHmac("sha512", process.env.VNPAY_HASH_SECRET!)
//       .update(hashData, "utf-8")
//       .digest("hex");

//     console.log("VNPay hashData:", hashData);
//     console.log("VNPay secureHash:", secureHash);
//     console.log("VNPay signed:", signed);

//     if (secureHash !== signed) {
//       console.error("❌ INVALID VNPAY SIGNATURE");
//       return res.redirect(
//         `${process.env.CLIENT_URL}/payment/vnpay/return?reason=invalid_hash`
//       );
//     }

//     /**
//      * EXTRACT ORDER ID
//      * vnp_TxnRef = orderId[_timestamp]
//      */
//     const txnRef = vnp_Params["vnp_TxnRef"];
//     const orderId = Number(txnRef.split("_")[0]);
//     const responseCode = vnp_Params["vnp_ResponseCode"];

//     /**
//      * =========================
//      * PAYMENT SUCCESS
//      * =========================
//      */
//     if (responseCode === "00") {
//       // 1️⃣ update payment
//       await paymentService.markPaid(orderId);

//       // 2️⃣ confirm order
//       await ordersService.confirmOrder(orderId);

//       return res.redirect(
//         `${process.env.CLIENT_URL}/payment/vnpay/return?` +
//           `vnp_ResponseCode=00&vnp_TxnRef=${orderId}`
//       );
//     }

//     /**
//      * =========================
//      * PAYMENT FAILED / CANCELED
//      * =========================
//      */
//     await paymentService.markFailed(orderId);
//     await ordersService.cancelOrder(orderId);

//     return res.redirect(
//       `${process.env.CLIENT_URL}/payment/vnpay/return?` +
//         `vnp_ResponseCode=${responseCode}&vnp_TxnRef=${orderId}`
//     );
//   } catch (error) {
//     console.error("❌ VNPAY CALLBACK ERROR", error);
//     return res.redirect(
//       `${process.env.CLIENT_URL}/payment/vnpay/return?reason=exception`
//     );
//   }
// };
import { Request, Response } from "express";
import crypto from "crypto";
import { createVNPayUrl } from "../helpers/vnpay.helper";
import { PaymentService } from "../services/payment.service";
import { OrdersService } from "../services/orders.service";
import {
  commitInventoryForOrder,
  rollbackInventoryForOrder,
} from "../services/inventory.service";

const paymentService = new PaymentService();
const ordersService = new OrdersService();

/* =====================================================
   CREATE VNPAY PAYMENT URL
   POST /api/payment/vnpay/create
===================================================== */
export const createVNPayPayment = async (req: Request, res: Response) => {
  try {
    const { orderId, amount } = req.body;

    if (!orderId || !amount) {
      return res.status(400).json({
        success: false,
        message: "Thiếu orderId hoặc amount",
      });
    }

    const ipAddr =
      (req.headers["x-forwarded-for"] as string) ||
      req.socket.remoteAddress ||
      "127.0.0.1";

    const vnpayUrl = createVNPayUrl({
      orderId,
      amount,
      returnUrl: process.env.VNPAY_RETURN_URL!,
      ipAddr,
    });

    return res.status(200).json({
      success: true,
      vnpayUrl,
    });
  } catch (error: any) {
    console.error("❌ CREATE VNPAY URL ERROR", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Không tạo được VNPay URL",
    });
  }
};

/* =====================================================
   VNPAY RETURN CALLBACK
   GET /api/payment/vnpay/return
===================================================== */
export const vnpayReturn = async (req: Request, res: Response) => {
  console.log("🔥 VNPAY CALLBACK HIT", req.query);

  try {
    /* =========================
       1️⃣ VERIFY SIGNATURE
    ========================= */
    const vnp_Params: Record<string, string> = { ...(req.query as any) };

    const secureHash = vnp_Params["vnp_SecureHash"];
    delete vnp_Params["vnp_SecureHash"];
    delete vnp_Params["vnp_SecureHashType"];

    const encodeVNPay = (value: string) =>
      encodeURIComponent(value).replace(/%20/g, "+");

    const sortedKeys = Object.keys(vnp_Params).sort();

    let hashData = "";
    let first = true;

    for (const key of sortedKeys) {
      const value = vnp_Params[key];
      if (value !== undefined && value !== null && value !== "") {
        if (!first) hashData += "&";
        first = false;
        hashData += `${key}=${encodeVNPay(value)}`;
      }
    }

    const signed = crypto
      .createHmac("sha512", process.env.VNPAY_HASH_SECRET!)
      .update(hashData, "utf-8")
      .digest("hex");

    if (secureHash !== signed) {
      console.error("❌ INVALID VNPAY SIGNATURE");
      return res.redirect(
        `${process.env.CLIENT_URL}/payment/vnpay/return?reason=invalid_hash`
      );
    }

    /* =========================
       2️⃣ EXTRACT DATA
    ========================= */
    const txnRef = vnp_Params["vnp_TxnRef"];
    const responseCode = vnp_Params["vnp_ResponseCode"];

    // vnp_TxnRef = orderId[_timestamp]
    const orderId = Number(txnRef.split("_")[0]);

    /* =========================
       3️⃣ LOAD ORDER + INVENTORY DATA
    ========================= */
    const order = await ordersService.getOrderFull(orderId);

    if (!order || !order.orderInfo) {
      throw new Error("Order or OrderInfo not found");
    }

    const branchId = order.orderInfo.branchId;

    if (!order.orderDetails || order.orderDetails.length === 0) {
      throw new Error("Order has no order details");
    }

    const inventoryItems = order.orderDetails.map((od) => ({
      itemId: od.item.id as number,
      quantity: od.quantity,
    }));

    /* =========================
       4️⃣ PAYMENT SUCCESS
    ========================= */
    if (responseCode === "00") {
      // 1️⃣ update payment
      await paymentService.markPaid(orderId);

      // 2️⃣ trừ kho thật
      await commitInventoryForOrder(branchId, inventoryItems);

      // 3️⃣ confirm order
      await ordersService.confirmOrder(orderId);

      return res.redirect(
        `${process.env.CLIENT_URL}/payment/vnpay/return?` +
          `vnp_ResponseCode=00&orderId=${orderId}`
      );
    }

    /* =========================
       5️⃣ PAYMENT FAILED / CANCELED
    ========================= */
    await paymentService.markFailed(orderId);

    // trả hàng đã giữ
    await rollbackInventoryForOrder(branchId, inventoryItems);

    // hủy order
    await ordersService.cancelOrder(orderId);

    return res.redirect(
      `${process.env.CLIENT_URL}/payment/vnpay/return?` +
        `vnp_ResponseCode=${responseCode}&orderId=${orderId}`
    );
  } catch (error) {
    console.error("❌ VNPAY CALLBACK ERROR", error);
    return res.redirect(
      `${process.env.CLIENT_URL}/payment/vnpay/return?reason=exception`
    );
  }
};
