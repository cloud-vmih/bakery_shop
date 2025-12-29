import crypto from "crypto";

type VNPayCreateUrlInput = {
  orderId: number;
  amount: number; // VND
  orderInfo?: string;
  returnUrl: string;
  ipAddr: string;
  userId: number;
};

/**
 * Encode giống Java URLEncoder
 * - encodeURIComponent
 * - space => "+"
 */
const encodeVNPay = (value: string) =>
  encodeURIComponent(value).replace(/%20/g, "+");

export const createVNPayUrl = ({
  orderId,
  amount,
  orderInfo,
  returnUrl,
  ipAddr,
  userId
}: VNPayCreateUrlInput) => {
  const vnp_TmnCode = process.env.VNPAY_TMN_CODE!;
  const vnp_HashSecret = process.env.VNPAY_HASH_SECRET!;
  const vnp_Url = process.env.VNPAY_URL!;

  if (!vnp_TmnCode || !vnp_HashSecret || !vnp_Url) {
    throw new Error("VNPay config missing");
  }

  // ===== 1. TẠO THỜI GIAN (YYYYMMDDHHmmss) =====
  const createDate = formatDateVN(new Date());

  const txnRef = `${orderId}_${userId}_${Date.now()}`;

  // ===== 2. PARAMS GỐC (CHƯA KÝ) =====
  const vnp_Params: Record<string, string> = {
    vnp_Version: "2.1.0",
    vnp_Command: "pay",
    vnp_TmnCode: vnp_TmnCode,
    vnp_Locale: "vn",
    vnp_CurrCode: "VND",
    vnp_TxnRef: txnRef,
    vnp_OrderInfo: orderInfo || `Thanh toan don hang #${orderId}`,
    vnp_OrderType: "billpayment",
    vnp_Amount: (amount * 100).toString(), // VNPay yêu cầu *100
    vnp_ReturnUrl: returnUrl,
    vnp_IpAddr: ipAddr === "::1" ? "127.0.0.1" : ipAddr,
    vnp_CreateDate: createDate,

  };

  // ===== 3. SORT KEY A → Z (GIỐNG SERVLET) =====
  const sortedKeys = Object.keys(vnp_Params).sort();

  let hashData = "";
  let query = "";
  let first = true;

  for (const key of sortedKeys) {
    const value = vnp_Params[key];
    if (value !== undefined && value !== null && value !== "") {
      const encodedValue = encodeVNPay(value);

      if (!first) {
        hashData += "&";
        query += "&";
      }
      first = false;

      hashData += `${key}=${encodedValue}`;
      query += `${key}=${encodedValue}`;
    }
  }

  // ===== 4. KÝ HMAC SHA512 (GIỐNG SERVLET JAVA) =====
  const secureHash = crypto
    .createHmac("sha512", vnp_HashSecret)
    .update(hashData, "utf-8")
    .digest("hex");

  // ===== 5. URL THANH TOÁN CUỐI =====
  const paymentUrl = `${vnp_Url}?${query}&vnp_SecureHash=${secureHash}`;

  // ===== 6. DEBUG (NÊN GIỮ KHI TEST) =====
  console.log("VNPay hashData:", hashData);
  console.log("VNPay secureHash:", secureHash);
  console.log("VNPay paymentUrl:", paymentUrl);

  return paymentUrl;
};

/**
 * FORMAT DATE YYYYMMDDHHmmss
 * (Nếu server khác timezone VN thì vẫn OK với sandbox)
 */
const formatDateVN = (date: Date) => {
  const pad = (n: number) => (n < 10 ? "0" + n : n);

  return (
    date.getFullYear().toString() +
    pad(date.getMonth() + 1) +
    pad(date.getDate()) +
    pad(date.getHours()) +
    pad(date.getMinutes()) +
    pad(date.getSeconds())
  );
};
