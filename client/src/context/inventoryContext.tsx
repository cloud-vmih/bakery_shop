// context/InventoryContext.tsx
import { createContext, useState, useContext, ReactNode, useEffect, useCallback, useMemo } from "react";
import { getInventory } from "../services/inventory.services";
import toast from "react-hot-toast";

interface InventoryItem {
    id: number;
    itemId: number
    branchId: number;
    stockQuantity: number;
    reservedQuantity: number;
    updatedAt: string;
}

interface InventorySummary {
    totalItems: number;
    totalStock: number;
    totalReserved: number;
    totalAvailable: number;
    lastUpdated: string | null;
}

interface InventoryContextType {
    branchId: number | null;
    setBranchId: (branchId: number | null) => void;
    inventory: InventoryItem[];
    summary: InventorySummary;
    loadInventory: () => Promise<void>;
    getItemQuantity: (itemId: number, branchId: number) => number;
    clearInventory: () => void;
    refreshInventory: () => void;
}

const InventoryContext = createContext<InventoryContextType | undefined>(undefined);

export const InventoryProvider = ({ children }: { children: ReactNode }) => {
    const [inventory, setInventory] = useState<InventoryItem[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [branchId, setBranchId ] = useState<number | null>(null);

    // Calculate summary statistics
    const summary: InventorySummary = {
        totalItems: inventory.length,
        totalStock: inventory.reduce((sum, item) => sum + item.stockQuantity, 0),
        totalReserved: inventory.reduce((sum, item) => sum + item.reservedQuantity, 0),
        totalAvailable: inventory.reduce((sum, item) => sum + (item.stockQuantity - item.reservedQuantity), 0),
        lastUpdated: inventory.length > 0
            ? new Date(Math.max(...inventory.map(i => new Date(i.updatedAt).getTime()))).toLocaleString()
            : null
    };

    const loadInventory = useCallback(async () => {
        setLoading(true);
        try {
            const data = await getInventory();

            // Transform data to match our interface
            const transformedData: InventoryItem[] = data.map((item: any) => ({
                id: item.id,
                itemId: item.item?.id || 0,
                branchId: item.branch?.id || 0,
                stockQuantity: item.stockQuantity || 0,
                reservedQuantity: item.reservedQuantity || 0,
                availableQuantity: (item.stockQuantity || 0) - (item.reservedQuantity || 0),
                updatedAt: item.updatedAt,
            }));

            setInventory(transformedData);

        } catch (error: any) {
            console.error('Failed to load inventory:', error);
            toast.error('Không thể tải dữ liệu tồn kho');
            setInventory([]);
        } finally {
            setLoading(false);
        }
    }, []);

    // Get quantity for specific item in specific branch
    const getItemQuantity = useCallback((itemId: number, branchId: number): number => {
        const item = inventory.find(
            i => i.itemId === itemId && i.branchId === branchId
        );
        return item?.stockQuantity || 0;
    }, [inventory]);


    // Clear inventory data
    const clearInventory = useCallback(() => {
        setInventory([]);
    }, []);

    const refreshInventory = useCallback(async () => {
        await loadInventory();
    }, []);

    // Initial load on mount
    useEffect(() => {
        loadInventory();
    }, [loadInventory]);

    const value: InventoryContextType = {
        branchId,
        setBranchId,
        inventory,
        summary,
        loadInventory,
        getItemQuantity,
        clearInventory,
        refreshInventory,
    };

    return (
        <InventoryContext.Provider value={value}>
            {children}
        </InventoryContext.Provider>
    );
};

export const useInventory = () => {
    const context = useContext(InventoryContext);
    if (!context) {
        throw new Error("useInventory must be used within an InventoryProvider");
    }
    return context;
};