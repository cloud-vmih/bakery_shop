"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const cart_controller_1 = require("../controllers/cart.controller");
const verifyToken_1 = require("../middleware/verifyToken");
const router = (0, express_1.Router)();
// ===== CART =====
router.post("/", verifyToken_1.verifyToken, cart_controller_1.addToCart);
router.get("/", verifyToken_1.verifyToken, cart_controller_1.getCart);
router.delete("/", verifyToken_1.verifyToken, cart_controller_1.clearCart);
// ===== CART ITEM =====
router.put("/item/:id", verifyToken_1.verifyToken, cart_controller_1.updateCartItem); // + / -
router.delete("/item/:id", verifyToken_1.verifyToken, cart_controller_1.removeCartItem); // xoá item
exports.default = router;
