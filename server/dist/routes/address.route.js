"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const verifyToken_1 = require("../middleware/verifyToken");
const address_controller_1 = require("../controllers/address.controller");
const router = (0, express_1.Router)();
/**
 * =======================
 * ADDRESS ROUTES
 * Base: /addresses
 * =======================
 */
// 🔁 BACKWARD COMPAT (route cũ)
// GET /addresses/my
// router.get("/my", verifyToken, getMyAddressesController);
// ✅ ROUTE CHUẨN
// GET /addresses
router.get("/", verifyToken_1.verifyToken, address_controller_1.getMyAddressesController);
// POST /addresses
router.post("/", verifyToken_1.verifyToken, address_controller_1.createAddressController);
// PUT /addresses/:id
router.put("/:id", verifyToken_1.verifyToken, address_controller_1.updateAddressController);
// PUT /addresses/:id/default
router.put("/:id/default", verifyToken_1.verifyToken, address_controller_1.setDefaultAddressController);
// DELETE /addresses/:id
router.delete("/:id", verifyToken_1.verifyToken, address_controller_1.deleteAddressController);
exports.default = router;
