import { Router } from "express";
import { ItemController } from "../controllers/item.controller";
import { verifyToken } from "../middleware/verifyToken";
import  { verifyAdmin} from "../middleware/verifyToken";

const router = Router();

router.get("/", ItemController.getAll);
router.post("/", verifyToken, verifyAdmin, ItemController.create);
router.put("/:id", verifyToken, verifyAdmin,ItemController.update);
router.delete("/:id",verifyToken, verifyAdmin, ItemController.delete);

export default router;
