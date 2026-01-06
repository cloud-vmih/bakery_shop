// src/routes/itemsDiscount.routes.ts
import { Router } from "express";
import {
  getAllItemsDiscountController,
  getOneItemsDiscountController,
  createItemsDiscountController,
  updateItemsDiscountController,
  removeItemsDiscountController,
} from "../controllers/itemsDiscount.controller";

const router = Router();

router.get("/", getAllItemsDiscountController);

// =============================
// GET ONE
// =============================
router.get("/:id", getOneItemsDiscountController);

// =============================
// CREATE
// =============================
router.post("/", createItemsDiscountController);

// =============================
// UPDATE
// =============================
router.put("/:id", updateItemsDiscountController);

// =============================
// DELETE
// =============================
router.delete("/:id", removeItemsDiscountController);

export default router;
