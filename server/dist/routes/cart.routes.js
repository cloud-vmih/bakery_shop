"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// server/src/routes/cart.routes.ts
const express_1 = require("express");
const cart_controller_1 = require("../controller/cart.controller");
const verifyToken_1 = require("../middleware/verifyToken");
const router = (0, express_1.Router)();
// Yêu cầu đăng nhập để bảo đảm có userId cho logic giỏ hàng
<<<<<<< HEAD
router.post("/cart", verifyToken_1.verifyToken, cart_controller_1.addToCart);
router.get("/cart", verifyToken_1.verifyToken, cart_controller_1.getCart);
=======
router.post("/", verifyToken_1.verifyToken, cart_controller_1.addToCart);
router.get("/", verifyToken_1.verifyToken, cart_controller_1.getCart);
>>>>>>> origin/master
exports.default = router;
