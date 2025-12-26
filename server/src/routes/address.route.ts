import express from "express";
import {
  getMyAddressesController,
  addAddressController,
  editAddressController,
  setDefaultAddressController,
  deleteAddressController,
} from "../controllers/address.controller";
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

export default router;
