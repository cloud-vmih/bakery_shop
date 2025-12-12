"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const account_controller_1 = require("../controller/account.controller");
const verifyEmail_controller_1 = require("../controller/verifyEmail.controller");
const verifyToken_1 = require("../middleware/verifyToken");
const router = (0, express_1.Router)();
router.post("/register", account_controller_1.register);
router.post("/login", account_controller_1.login);
router.get("/user/:id", account_controller_1.getUserInfo);
router.post("/google", account_controller_1.authController.googleLogin);
router.get("/verify-email", verifyEmail_controller_1.verifyEmail);
router.get("/token", verifyToken_1.verifyToken, (req, res) => {
    return res.json({
        user: req.user,
        message: "Token valid",
    });
}); // để tạm trong route nha, nữa suy nghĩ lại có nên bỏ qua controller hong hì
exports.default = router;
