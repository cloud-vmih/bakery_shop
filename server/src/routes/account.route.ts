import { Router } from "express";
import { register, login, getUserInfo, googleLogin, verifyOTP, sendOTP, resetPassword } from "../controllers/account.controller";
import {verifyEmail} from "../controllers/verifyEmail.controller";
import { verifyToken } from "../middleware/verifyToken";
import { refresh } from "../controllers/refreshToken";

const router = Router();

router.post("/register",register);
router.post("/login", login);
router.get("/user/:id", getUserInfo);
router.post("/google", googleLogin);
router.get("/verify-email", verifyEmail);
router.get("/token", verifyToken, (req, res) => {
  return res.json({
    user: (req as any).user,
    message: "Token valid",
  });
});// để tạm trong route nha, nữa suy nghĩ lại có nên bỏ qua controller hong hì
router.post("/refresh_token", refresh)
router.post("/sendOtp", sendOTP)
router.post("/verifyOtp", verifyOTP)
router.post("/resetPassword", resetPassword)

export default router;
