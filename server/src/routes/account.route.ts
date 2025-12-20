import { Router } from "express";
import {
  register,
  login,
  getUserInfo,
  authController,
} from "../controllers/account.controller";
import { verifyEmail } from "../controllers/verifyEmail.controller";
import { verifyToken } from "../middleware/verifyToken";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.get("/user/:id", getUserInfo);
router.post("/google", authController.googleLogin);
router.get("/verify-email", verifyEmail);
router.get("/token", verifyToken, (req, res) => {
  return res.json({
    user: (req as any).user,
    message: "Token valid",
  });
}); // để tạm trong route nha, nữa suy nghĩ lại có nên bỏ qua controller hong hì

export default router;
