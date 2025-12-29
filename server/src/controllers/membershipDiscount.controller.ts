import { Request, Response } from "express";
import { MembershipDiscountService } from "../services/membershipDiscount.service";
export const getAllMembershipDiscounts = async (
  req: Request,
  res: Response
) => {
  try {
    const data = await MembershipDiscountService.getAll();
    return res.json(data);
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

export const createMembershipDiscount = async (
  req: Request,
  res: Response
) => {
  try {
    const { itemIds } = req.body;
    if (itemIds !== undefined && (!Array.isArray(itemIds) || itemIds.length === 0)) { 
      return res.status(400).json({ message: "Phải chọn ít nhất 1 sản phẩm nếu áp dụng cho sản phẩm cụ thể" });
    }
    const data = await MembershipDiscountService.create(req.body);
    return res.status(201).json(data);
  } catch (error: any) {
    switch (error.message) {

      case "INVALID_DISCOUNT_AMOUNT":
        return res.status(400).json({ message: "% giảm phải từ 0-100" });
      case "INVALID_DATE":
        return res.status(400).json({ message: "Ngày không hợp lệ" });
      case "ITEMS_NOT_FOUND": 
        return res.status(400).json({ message: "Một số sản phẩm không tồn tại" });
      default:
        return res.status(500).json({ message: "Server error" });
    }
  }
};

export const updateMembershipDiscount = async (
  req: Request,
  res: Response
) => {
  try {
    const id = Number(req.params.id);
    const { itemIds } = req.body;
    if (itemIds !== undefined && (!Array.isArray(itemIds) || itemIds.length === 0)) {  // ← THÊM: Validation nếu update itemIds
      return res.status(400).json({ message: "Phải chọn ít nhất 1 sản phẩm nếu áp dụng cho sản phẩm cụ thể" });
    }
    const data = await MembershipDiscountService.update(id, req.body);
    return res.json(data);
  } catch (error: any) {
    if (error.message === "DISCOUNT_NOT_FOUND") {
      return res.status(404).json({ message: "Không tìm thấy chương trình" });
    }
    if (error.message === "ITEMS_NOT_FOUND" || error.message === "INVALID_DISCOUNT_AMOUNT" || error.message === "INVALID_DATE") {  // ← THÊM: ITEMS_NOT_FOUND và INVALID_DATE
      return res.status(400).json({ message: error.message });
    }
    return res.status(500).json({ message: "Server error" });
  }
};

export const removeMembershipDiscount = async (
  req: Request,
  res: Response
) => {
  try {
    const id = Number(req.params.id);
    await MembershipDiscountService.remove(id);
    return res.json({ message: "Deleted successfully" });
  } catch (error: any) {
    if (error.message === "DISCOUNT_NOT_FOUND") {
      return res.status(404).json({ message: "Không tìm thấy chương trình" });
    }
    return res.status(500).json({ message: "Server error" });
  }
};