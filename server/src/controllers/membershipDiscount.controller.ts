import { Request, Response } from "express";
import { MembershipDiscountService } from "../services/membershipDiscount.service";

// GET ALL
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

// CREATE
export const createMembershipDiscount = async (
  req: Request,
  res: Response
) => {
  try {
    const data = await MembershipDiscountService.create(req.body);
    return res.status(201).json(data);
  } catch (error: any) {
    switch (error.message) {
      // case "CODE_EXISTED":  // ← XÓA: Bỏ xử lý code existed
      //   return res.status(400).json({ message: "Code đã tồn tại" });
      case "INVALID_DISCOUNT_AMOUNT":
        return res.status(400).json({ message: "% giảm phải từ 0-100" });
      case "INVALID_DATE":
        return res.status(400).json({ message: "Ngày không hợp lệ" });
      default:
        return res.status(500).json({ message: "Server error" });
    }
  }
};

// UPDATE
export const updateMembershipDiscount = async (
  req: Request,
  res: Response
) => {
  try {
    const id = Number(req.params.id);
    const data = await MembershipDiscountService.update(id, req.body);
    return res.json(data);
  } catch (error: any) {
    if (error.message === "DISCOUNT_NOT_FOUND") {
      return res.status(404).json({ message: "Không tìm thấy chương trình" });
    }
    return res.status(500).json({ message: "Server error" });
  }
};

// DELETE
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