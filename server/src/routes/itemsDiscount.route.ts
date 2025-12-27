import { Router } from "express";
import * as promotionController from "../controllers/itemsDiscount.controller";
import { verifyToken, verifyAdminOrStaff } from "../middleware/verifyToken";

const router = Router();

router.get(
  "/",
  verifyToken,
  verifyAdminOrStaff,
  promotionController.getAllItemsDiscount
);

router.get(
  "/:id",
  verifyToken,
  verifyAdminOrStaff,
  promotionController.getOneItemsDiscount
);

router.post(
  "/",
  verifyToken,
  verifyAdminOrStaff,
  promotionController.createItemsDiscount
);

router.put(
  "/:id",
  verifyToken,
  verifyAdminOrStaff,
  promotionController.updateItemsDiscount
);

router.delete(
  "/:id",
  verifyToken,
  verifyAdminOrStaff,
  promotionController.removeItemsDiscount
);

export default router;
