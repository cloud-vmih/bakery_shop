console.log(">>> membershipDiscount.routes LOADED");

import { Router } from "express";
import {
  getAllMembershipDiscounts,
  createMembershipDiscount,
  updateMembershipDiscount,
  removeMembershipDiscount,
} from "../controller/membershipDiscount.controller";

const router = Router();

router.get("/member-discounts", getAllMembershipDiscounts);
router.post("/member-discounts", createMembershipDiscount);
router.put("/member-discounts/:id", updateMembershipDiscount);
router.delete("/member-discounts/:id", removeMembershipDiscount);


export default router;
