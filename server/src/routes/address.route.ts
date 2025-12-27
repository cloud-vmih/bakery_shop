import { Router } from "express";
import { verifyToken } from "../middleware/verifyToken";
import {
  getMyAddressesController,
  createAddressController,
  updateAddressController,
  setDefaultAddressController,
  deleteAddressController,
} from "../controllers/address.controller";

const router = Router();

/**
 * =======================
 * ADDRESS ROUTES
 * Base: /addresses
 * =======================
 */

// 🔁 BACKWARD COMPAT (route cũ)
// GET /addresses/my
// router.get("/my", verifyToken, getMyAddressesController);

// ✅ ROUTE CHUẨN
// GET /addresses
router.get("/", verifyToken, getMyAddressesController);

// POST /addresses
router.post("/", verifyToken, createAddressController);

// PUT /addresses/:id
router.put("/:id", verifyToken, updateAddressController);

// PUT /addresses/:id/default
router.put("/:id/default", verifyToken, setDefaultAddressController);

// DELETE /addresses/:id
router.delete("/:id", verifyToken, deleteAddressController);

export default router;
