import { Router } from "express";
import { ItemsDiscountService } from "../servies/itemsDiscount.service";

const router = Router();

router.get("/", async (req, res) => {
  res.json(await ItemsDiscountService.getAll());
});

router.get("/:id", async (req, res) => {
  res.json(await ItemsDiscountService.getOne(Number(req.params.id)));
});

router.post("/", async (req, res) => {
  res.json(await ItemsDiscountService.create(req.body));
});

router.put("/:id", async (req, res) => {
  res.json(await ItemsDiscountService.update(Number(req.params.id), req.body));
});

router.delete("/:id", async (req, res) => {
  res.json(await ItemsDiscountService.remove(Number(req.params.id)));
});

export default router;
