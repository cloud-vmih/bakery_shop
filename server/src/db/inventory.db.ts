import { AppDataSource } from "../config/database";
import { Item } from "../entity/Item";
import { Branch } from "../entity/Branch";
import { Inventory } from "../entity/Inventory";
import { LessThan, MoreThanOrEqual } from "typeorm";

export const getInventory = async () => {
  const repo = AppDataSource.getRepository(Inventory);
  const inventory = await repo.find({
    relations: {
      branch: true,
      item: true,
    },
  });
  return inventory;
};

export const updateMultipleQuantities = async (
  branchId: number,
  updates: Array<{ itemId: number; quantity: number }>
) => {
  const repo = AppDataSource.getRepository(Inventory);

  // Start transaction
  const queryRunner = AppDataSource.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction();

  try {
    const results = [];

    for (const update of updates) {
      // Find existing inventory
      let inventory = await repo.findOne({
        where: {
          item: { id: update.itemId },
          branch: { id: branchId },
        },
        relations: ["item", "branch"],
      });
      if (update.quantity === 0) continue;

      if (!inventory) {
        // Create new if not exists
        inventory = new Inventory();

        // Get related entities
        const item = await queryRunner.manager.findOne(Item, {
          where: { id: update.itemId },
        });
        const branch = await queryRunner.manager.findOne(Branch, {
          where: { id: branchId },
        });

        if (!item || !branch) {
          throw new Error(
            `Item ${update.itemId} or Branch ${branchId} not found`
          );
        }

        inventory.item = item;
        inventory.branch = branch;
        inventory.reservedQuantity = 0;
      }

      // Update quantity
      inventory.stockQuantity = update.quantity;

      // Save within transaction
      const saved = await queryRunner.manager.save(inventory);
      results.push(saved);
    }

    // Commit transaction
    await queryRunner.commitTransaction();

    return {
      message: `Updated ${results.length} items`,
    };
  } catch (error) {
    // Rollback on error
    await queryRunner.rollbackTransaction();
    throw error;
  } finally {
    // Release query runner
    await queryRunner.release();
  }
};

export const deletedInventory = async () => {
  const repo = AppDataSource.getRepository(Inventory);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const yesterdayStart = new Date(today);
  yesterdayStart.setDate(yesterdayStart.getDate() - 1);
  console.log(yesterdayStart);
  console.log(today);
  // Xóa cho tất cả branches
  const inventories = await repo
    .createQueryBuilder("inventory")
    .where("inventory.updatedAt >= :yesterdayStart", { yesterdayStart })
    .andWhere("inventory.updatedAt < :today", { today })
    .getMany();

  console.log(inventories);
  if (inventories.length === 0) {
    return { message: "No yesterday's inventory found for any branch" };
  }

  const result = await repo.remove(inventories);
  return {
    message: `Deleted ${result.length} inventory items from yesterday across all branches`,
  };
};

/* ======================================================
   ✅ 1. CHECK KHO (KHÔNG GIỮ HÀNG)
   Dùng cho CheckoutConfirm trước khi tạo Order
====================================================== */
export const checkInventoryAvailability = async (
  branchId: number,
  items: Array<{ itemId: number; quantity: number }>
) => {
  const repo = AppDataSource.getRepository(Inventory);

  const insufficient: Array<{
    itemId: number;
    available: number;
    requested: number;
  }> = [];

  for (const i of items) {
    const inventory = await repo.findOne({
      where: {
        item: { id: i.itemId },
        branch: { id: branchId },
      },
      relations: ["item", "branch"],
    });

    const available =
      (inventory?.stockQuantity ?? 0) - (inventory?.reservedQuantity ?? 0);

    if (available < i.quantity) {
      insufficient.push({
        itemId: i.itemId,
        available: Math.max(available, 0),
        requested: i.quantity,
      });
    }
  }

  return {
    ok: insufficient.length === 0,
    insufficient,
  };
};

/* ======================================================
   ✅ 2. GIỮ HÀNG (RESERVE)
   Dùng khi:
   - COD: giữ hàng → tạo order → trừ kho
   - VNPay: giữ hàng → redirect → chờ callback
====================================================== */
export const reserveInventory = async (
  branchId: number,
  items: Array<{ itemId: number; quantity: number }>
) => {
  const queryRunner = AppDataSource.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction();

  try {
    for (const i of items) {
      const inventory = await queryRunner.manager.findOne(Inventory, {
        where: {
          item: { id: i.itemId },
          branch: { id: branchId },
        },
        lock: { mode: "pessimistic_write" }, // 🔥 chặn race condition
      });

      if (!inventory) {
        throw new Error(`Inventory not found for item ${i.itemId}`);
      }

      const available = inventory.stockQuantity - inventory.reservedQuantity;

      if (available < i.quantity) {
        throw new Error(`Insufficient stock for item ${i.itemId}`);
      }

      inventory.reservedQuantity += i.quantity;
      await queryRunner.manager.save(inventory);
    }

    await queryRunner.commitTransaction();
    return { success: true };
  } catch (err) {
    await queryRunner.rollbackTransaction();
    throw err;
  } finally {
    await queryRunner.release();
  }
};

/* ======================================================
   ✅ 3. TRỪ KHO THẬT (COMMIT)
   Gọi khi:
   - COD tạo đơn thành công
   - VNPay callback SUCCESS
====================================================== */
export const commitInventory = async (
  branchId: number,
  items: Array<{ itemId: number; quantity: number }>
) => {
  const queryRunner = AppDataSource.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction();

  try {
    for (const i of items) {
      console.log("🔥 COMMIT ITEM INPUT:", i);

      const inventory = await queryRunner.manager.findOne(Inventory, {
        where: {
          item: { id: i.itemId },
          branch: { id: branchId },
        },
        lock: { mode: "pessimistic_write" },
      });

      console.log("🔥 INVENTORY FOUND:", inventory);

      if (!inventory) {
        console.error("❌ INVENTORY NOT FOUND", {
          branchId,
          itemId: i.itemId,
        });
        continue;
      }

      console.log("🔥 BEFORE COMMIT:", {
        stock: inventory.stockQuantity,
        reserved: inventory.reservedQuantity,
      });

      inventory.stockQuantity -= i.quantity;
      inventory.reservedQuantity -= i.quantity;

      console.log("🔥 AFTER COMMIT:", {
        stock: inventory.stockQuantity,
        reserved: inventory.reservedQuantity,
      });

      await queryRunner.manager.save(inventory);
    }

    await queryRunner.commitTransaction();
    return { success: true };
  } catch (err) {
    await queryRunner.rollbackTransaction();
    throw err;
  } finally {
    await queryRunner.release();
  }
};

/* ======================================================
   ✅ 4. TRẢ HÀNG (ROLLBACK RESERVE)
   Gọi khi:
   - VNPay FAIL / TIMEOUT
====================================================== */
export const rollbackInventory = async (
  branchId: number,
  items: Array<{ itemId: number; quantity: number }>
) => {
  const queryRunner = AppDataSource.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction();

  try {
    for (const i of items) {
      const inventory = await queryRunner.manager.findOne(Inventory, {
        where: {
          item: { id: i.itemId },
          branch: { id: branchId },
        },
        lock: { mode: "pessimistic_write" },
      });

      if (!inventory) continue;

      inventory.reservedQuantity = Math.max(
        inventory.reservedQuantity - i.quantity,
        0
      );

      await queryRunner.manager.save(inventory);
    }

    await queryRunner.commitTransaction();
    return { success: true };
  } catch (err) {
    await queryRunner.rollbackTransaction();
    throw err;
  } finally {
    await queryRunner.release();
  }
};
