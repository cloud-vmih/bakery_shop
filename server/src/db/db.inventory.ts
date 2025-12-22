import { AppDataSource } from "../config/database";
import { Item } from "../entity/Item";
import { Branch} from "../entity/Branch";
import  { Inventory} from "../entity/Inventory";

export const getInventory = async () => {
    const repo = AppDataSource.getRepository(Inventory);
    const inventory = await repo.find({
        relations: {
            branch: true,
            item: true
        }}
    );
    return inventory
}

export const updateQuantity = async (itemId: number, branchId: number, quantity: number) => {
    const repo = AppDataSource.getRepository(Inventory);
    const inventory = await repo.findOne({
        where: { item: {id: itemId}, branch: {id: branchId}},
        relations: ["item", "branch"]
    })

    inventory!.stockQuantity = quantity;
    return await repo.save(inventory!);
}

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
                    branch: { id: branchId }
                },
                relations: ["item", "branch"]
            });
            if (update.quantity === 0) continue;

            if (!inventory) {
                // Create new if not exists
                inventory = new Inventory();

                // Get related entities
                const item = await queryRunner.manager.findOne(Item, { where: { id: update.itemId } });
                const branch = await queryRunner.manager.findOne(Branch, { where: { id: branchId } });

                if (!item || !branch) {
                    throw new Error(`Item ${update.itemId} or Branch ${branchId} not found`);
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
            message: `Updated ${results.length} items`
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