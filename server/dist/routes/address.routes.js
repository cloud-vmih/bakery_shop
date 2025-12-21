"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const address_controller_1 = require("../controller/address.controller");
const verifyToken_1 = require("../middleware/verifyToken");
const router = express_1.default.Router();
/**
 * GET /addresses
 * Lấy danh sách địa chỉ của customer hiện tại
 */
router.get("/address", verifyToken_1.verifyToken, address_controller_1.getMyAddressesController);
/**
 * POST /addresses
 * Thêm địa chỉ mới
 */
router.post("/address", verifyToken_1.verifyToken, address_controller_1.addAddressController);
/**
 * PUT /addresses/:id
 * Chỉnh sửa địa chỉ
 */
router.put("/address/:id", verifyToken_1.verifyToken, address_controller_1.editAddressController);
/**
 * PUT /addresses/:id/default
 * Set địa chỉ mặc định
 */
router.put("/address/:id/default", verifyToken_1.verifyToken, address_controller_1.setDefaultAddressController);
exports.default = router;
