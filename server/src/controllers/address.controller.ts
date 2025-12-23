import { Request, Response } from "express";
import { AddressService } from "../services/address.service";

const addressService = new AddressService();

/**
 * GET /addresses
 * Lấy danh sách địa chỉ của user hiện tại
 */
export async function getMyAddressesController(req: Request, res: Response) {
  try {
    const userId = (req as any).user?.id;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const addresses = await addressService.getAddressesByCustomer(userId);

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
 * - Dùng cho profile + checkout + google autocomplete
 */
export async function createAddressController(req: Request, res: Response) {
  try {
    const userId = (req as any).user?.id;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const address = await addressService.createAddress(userId, req.body);

    /**
     * Giữ response gọn cho FE checkout
     * (nếu muốn full object thì đổi sau)
     */
    return res.status(201).json({
      success: true,
      data: {
        addressId: address.id,
        fullAddress: address.fullAddress,
      },
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
 * Cập nhật địa chỉ
 */
export async function updateAddressController(req: Request, res: Response) {
  try {
    const userId = (req as any).user?.id;
    const addressId = Number(req.params.id);

    if (!userId || !addressId) {
      return res.status(400).json({ message: "Thiếu thông tin" });
    }

    const address = await addressService.updateAddress(
      userId,
      addressId,
      req.body
    );

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
 * Đặt địa chỉ mặc định
 */
export async function setDefaultAddressController(req: Request, res: Response) {
  try {
    const userId = (req as any).user?.id;
    const addressId = Number(req.params.id);

    if (!userId || !addressId) {
      return res.status(400).json({ message: "Thiếu thông tin" });
    }

    const address = await addressService.setDefaultAddress(userId, addressId);

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

/**
 * DELETE /addresses/:id
 * Xóa địa chỉ
 */
export async function deleteAddressController(req: Request, res: Response) {
  try {
    const userId = (req as any).user?.id;
    const addressId = Number(req.params.id);

    if (!userId || !addressId) {
      return res.status(400).json({ message: "Thiếu thông tin" });
    }

    await addressService.deleteAddress(userId, addressId);

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
