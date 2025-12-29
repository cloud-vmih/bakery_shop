"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rollbackInventoryForOrder = exports.commitInventoryForOrder = exports.reserveInventoryForOrder = exports.checkInventoryForCheckout = exports.updateQuanities = exports.getAll = void 0;
const inventory_db_1 = require("../db/inventory.db");
/* ======================
   GIỮ NGUYÊN CODE CŨ
====================== */
const getAll = async () => {
    return (0, inventory_db_1.getInventory)();
};
exports.getAll = getAll;
const updateQuanities = async (branchId, updates) => {
    return (0, inventory_db_1.updateMultipleQuantities)(branchId, updates);
};
exports.updateQuanities = updateQuanities;
/* ======================
   🔥 CÁC HÀM MỚI – CHECKOUT FLOW
====================== */
/**
 * 1️⃣ Check kho trước khi tạo order
 * Dùng ở CheckoutConfirm
 */
const checkInventoryForCheckout = async (branchId, items) => {
    return (0, inventory_db_1.checkInventoryAvailability)(branchId, items);
};
exports.checkInventoryForCheckout = checkInventoryForCheckout;
/**
 * 2️⃣ Giữ hàng (reserve)
 * Dùng khi:
 * - COD: trước khi tạo order
 * - VNPay: trước khi redirect
 */
const reserveInventoryForOrder = async (branchId, items) => {
    return (0, inventory_db_1.reserveInventory)(branchId, items);
};
exports.reserveInventoryForOrder = reserveInventoryForOrder;
/**
 * 3️⃣ Trừ kho thật (commit)
 * Dùng khi:
 * - COD tạo đơn thành công
 * - VNPay callback SUCCESS
 */
const commitInventoryForOrder = async (branchId, items) => {
    return (0, inventory_db_1.commitInventory)(branchId, items);
};
exports.commitInventoryForOrder = commitInventoryForOrder;
/**
 * 4️⃣ Trả hàng đã giữ (rollback)
 * Dùng khi:
 * - VNPay FAIL / CANCEL / TIMEOUT
 */
const rollbackInventoryForOrder = async (branchId, items) => {
    return (0, inventory_db_1.rollbackInventory)(branchId, items);
};
exports.rollbackInventoryForOrder = rollbackInventoryForOrder;
