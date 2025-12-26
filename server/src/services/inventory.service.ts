import { getInventory, updateMultipleQuantities} from "../db/inventory.db";

export const getAll = async () => {
    return getInventory();
}

export  const updateQuanities = async (branchId: number, updates: Array<{ itemId: number; quantity: number }>)=> {
    return updateMultipleQuantities(branchId, updates)
}