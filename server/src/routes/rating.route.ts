import { Router } from "express";
import {
  addOrUpdateRatingController,
  getItemRatingsController,
  getCustomerRatingsController,
  deleteRatingController,
} from "../controllers/rating.controller";
import { verifyToken } from "../middleware/verifyToken";

const router = Router();

router.get("/item/:itemID", getItemRatingsController);
router.get("/customer/:customerID", getCustomerRatingsController);
router.post("/", verifyToken, addOrUpdateRatingController);
router.delete("/:itemID", verifyToken, deleteRatingController);

export default router;
