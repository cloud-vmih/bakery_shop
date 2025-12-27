import {
  getInventory,
  updateMultipleQuantities,

  // ✅ các hàm mới từ inventory.db
  checkInventoryAvailability,
  reserveInventory,
  commitInventory,
  rollbackInventory,
} from "../db/inventory.db";

/* ======================
   GIỮ NGUYÊN CODE CŨ
====================== */
export const getAll = async () => {
  return getInventory();
};

export const updateQuanities = async (
  branchId: number,
  updates: Array<{ itemId: number; quantity: number }>
) => {
  return updateMultipleQuantities(branchId, updates);
};

/* ======================
   🔥 CÁC HÀM MỚI – CHECKOUT FLOW
====================== */

/**
 * 1️⃣ Check kho trước khi tạo order
 * Dùng ở CheckoutConfirm
 */
export const checkInventoryForCheckout = async (
  branchId: number,
  items: Array<{ itemId: number; quantity: number }>
) => {
  return checkInventoryAvailability(branchId, items);
};

/**
 * 2️⃣ Giữ hàng (reserve)
 * Dùng khi:
 * - COD: trước khi tạo order
 * - VNPay: trước khi redirect
 */
export const reserveInventoryForOrder = async (
  branchId: number,
  items: Array<{ itemId: number; quantity: number }>
) => {
  return reserveInventory(branchId, items);
};

/**
 * 3️⃣ Trừ kho thật (commit)
 * Dùng khi:
 * - COD tạo đơn thành công
 * - VNPay callback SUCCESS
 */
export const commitInventoryForOrder = async (
  branchId: number,
  items: Array<{ itemId: number; quantity: number }>
) => {
  return commitInventory(branchId, items);
};

/**
 * 4️⃣ Trả hàng đã giữ (rollback)
 * Dùng khi:
 * - VNPay FAIL / CANCEL / TIMEOUT
 */
export const rollbackInventoryForOrder = async (
  branchId: number,
  items: Array<{ itemId: number; quantity: number }>
) => {
  return rollbackInventory(branchId, items);
};
