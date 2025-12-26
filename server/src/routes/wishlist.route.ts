import { Router } from "express";
import { verifyToken } from "../middleware/verifyToken";
import * as wishlistController from "../controllers/wishlist.controller";

const router = Router();

router.get("/", verifyToken, wishlistController.getWishlist);
router.post("/:itemId", verifyToken, wishlistController.addToWishlist);
router.delete("/:itemId", verifyToken, wishlistController.removeFromWishlist);

export default router;
