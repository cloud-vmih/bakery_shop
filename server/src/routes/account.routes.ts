import { Router } from "express";
import { register, login, getUserInfo, authController } from "../controller/account.controller";
import {verifyEmail} from "../controller/verifyEmail.controller";

const router = Router();

router.post("/register",register);
router.post("/login", login);
router.get("/user/:id", getUserInfo);
router.post("/google", authController.googleLogin);
router.get("/verify-email", verifyEmail);

export default router;
