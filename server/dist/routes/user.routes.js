"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express")); // Hoặc require('express') nếu dùng CommonJS, nhưng khuyến nghị ES modules cho TS
const user_controller_1 = require("../controller/user.controller");
const verifyToken_1 = require("../middleware/verifyToken"); // Giả sử đã có, chuyển sang .ts nếu cần
const router = express_1.default.Router();
router.get('/profile', verifyToken_1.verifyToken, user_controller_1.getProfileController);
router.put('/update', verifyToken_1.verifyToken, user_controller_1.updateProfileController);
exports.default = router; // Hoặc module.exports = router; nếu CommonJS
