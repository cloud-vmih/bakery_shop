"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ProductUpdate_controller_1 = require("../controller/ProductUpdate.controller");
const router = (0, express_1.Router)();
const productController = new ProductUpdate_controller_1.ProductController();
router.get('/products', productController.getProductList.bind(productController));
router.post('/products/update', productController.updateProductQuantity.bind(productController));
exports.default = router;
