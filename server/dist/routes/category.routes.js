"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const category_controller_1 = require("../controller/category.controller");
const router = (0, express_1.Router)();
// GET /api/category  → lấy tất cả sản phẩm
router.get("/", category_controller_1.getAllItems);
// GET /api/category/:category → lấy theo category (để dùng sau)
router.get("/:category", category_controller_1.getAllByCategory);
// GET /api/category/item/:id
router.get("/item/:id", category_controller_1.getItemDetail);
exports.default = router;
