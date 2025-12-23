import API from "../api/axois.config";
export interface InventoryUpdateItem {
    itemId: number;
    quantity: number;
}

export const getInventory = async () => {
    try {
        const res = await API.get("/inventory");
        return res.data
    } catch (error) {
        console.error('getInventory error:', error);
        throw error;
    }
};

export const updateMultipleQuantities = async (branchId: number, update: InventoryUpdateItem[]) => {
    try {
        // Convert inventory object to format: { inventory: { itemId1: qty1, itemId2: qty2, ... } }
        const payload = {payload: update} ;
        console.warn(payload)
        console.warn(branchId)

        const res = await API.put(`/inventory/${branchId}`, payload);
        return res.data;
    } catch (error: any) {
        throw new Error("Update failed!");
    }
};
