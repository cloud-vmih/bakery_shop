<<<<<<< HEAD
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
router.get("/my", verifyToken, getMyAddressesController);

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
=======
import express from "express";
import {
  getMyAddressesController,
  addAddressController,
  editAddressController,
  setDefaultAddressController,
  deleteAddressController,
} from "../controller/address.controller";
import { verifyToken } from "../middleware/verifyToken";

const router = express.Router();

/**
 * GET /addresses
 * Lấy danh sách địa chỉ của customer hiện tại
 */
router.get("/address", verifyToken, getMyAddressesController);

/**
 * POST /addresses
 * Thêm địa chỉ mới
 */
router.post("/address", verifyToken, addAddressController);

/**
 * PUT /addresses/:id
 * Chỉnh sửa địa chỉ
 */
router.put("/address/:id", verifyToken, editAddressController);

/**
 * PUT /addresses/:id/default
 * Set địa chỉ mặc định
 */
router.put("/address/:id/default", verifyToken, setDefaultAddressController);

router.delete("/address/:id", verifyToken, deleteAddressController)
>>>>>>> feature/updateQuantity-v2

export default router;
