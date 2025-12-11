import { Router } from "express";
import { getAllItems, getAllByCategory, getItemDetail } from "../controller/category.controller";

const router = Router();

// GET /api/category  → lấy tất cả sản phẩm
router.get("/", getAllItems);

// GET /api/category/:category → lấy theo category (để dùng sau)
router.get("/:category", getAllByCategory);

// GET /api/category/item/:id
router.get("/item/:id", getItemDetail);

export default router;
