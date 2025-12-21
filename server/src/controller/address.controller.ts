import { Request, Response } from "express";
import {
  getMyAddresses,
  addAddress,
  editAddress,
  setDefaultAddress,
  removeAddress,
} from "../servies/address.service";

/**
 * GET /addresses
 * Lấy danh sách địa chỉ của customer hiện tại
 */
export async function getMyAddressesController(
  req: Request,
  res: Response
) {
  try {
    const userId = (req as any).user.id;
    const addresses = await getMyAddresses(userId);

    return res.status(200).json({
      success: true,
      data: addresses,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message || "Không thể lấy danh sách địa chỉ",
    });
  }
}

/**
 * POST /addresses
 * Thêm địa chỉ mới
 */
export async function addAddressController(
  req: Request,
  res: Response
) {
  try {
    const userId = (req as any).user.id;
    const payload = req.body;

    const address = await addAddress(userId, payload);

    return res.status(201).json({
      success: true,
      data: address,
      message: "Thêm địa chỉ thành công",
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message || "Không thể thêm địa chỉ",
    });
  }
}

/**
 * PUT /addresses/:id
 * Chỉnh sửa địa chỉ
 */
export async function editAddressController(
  req: Request,
  res: Response
) {
  try {
    const userId = (req as any).user.id;
    const addressId = Number(req.params.id);
    const payload = req.body;

    const address = await editAddress(userId, addressId, payload);

    return res.status(200).json({
      success: true,
      data: address,
      message: "Cập nhật địa chỉ thành công",
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message || "Không thể cập nhật địa chỉ",
    });
  }
}

/**
 * PUT /addresses/:id/default
 * Set địa chỉ mặc định
 */
export async function setDefaultAddressController(
  req: Request,
  res: Response
) {
  try {
    const userId = (req as any).user.id;
    const addressId = Number(req.params.id);

    const address = await setDefaultAddress(userId, addressId);

    return res.status(200).json({
      success: true,
      data: address,
      message: "Đã đặt địa chỉ mặc định",
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message || "Không thể đặt địa chỉ mặc định",
    });
  }
}
export async function deleteAddressController(req: Request, res: Response) {
  try {
    const userId = (req as any).user.id;
    const addressId = Number(req.params.id);

    await removeAddress(userId, addressId);

    return res.status(200).json({
      success: true,
      message: "Xóa địa chỉ thành công",
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message || "Không thể xóa địa chỉ",
    });
  }
}