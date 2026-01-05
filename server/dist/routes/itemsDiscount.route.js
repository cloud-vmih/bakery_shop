"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/itemsDiscount.routes.ts
const express_1 = require("express");
const itemsDiscount_controller_1 = require("../controllers/itemsDiscount.controller");
const router = (0, express_1.Router)();
router.get("/", itemsDiscount_controller_1.getAllItemsDiscountController);
// =============================
// GET ONE
// =============================
router.get("/:id", itemsDiscount_controller_1.getOneItemsDiscountController);
// =============================
// CREATE
// =============================
router.post("/", itemsDiscount_controller_1.createItemsDiscountController);
// =============================
// UPDATE
// =============================
router.put("/:id", itemsDiscount_controller_1.updateItemsDiscountController);
// =============================
// DELETE
// =============================
router.delete("/:id", itemsDiscount_controller_1.removeItemsDiscountController);
exports.default = router;
