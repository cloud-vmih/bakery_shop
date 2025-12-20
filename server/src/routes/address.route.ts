import { Router } from "express";
import { verifyToken } from "../middleware/verifyToken";
import { getMyAddresses } from "../controllers/address.controller";

const router = Router();

router.get("/my", verifyToken, getMyAddresses);

export default router;
