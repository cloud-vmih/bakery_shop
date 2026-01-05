"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkInventory = exports.updateBranchInventory = exports.getAllItems = void 0;
const inventory_service_1 = require("../services/inventory.service");
const node_cron_1 = __importDefault(require("node-cron"));
const inventory_db_1 = require("../db/inventory.db");
const getAllItems = async (req, res) => {
    try {
        const result = await (0, inventory_service_1.getAll)();
        res.json(result);
    }
    catch (err) {
        res.status(400).json({ message: err.message });
    }
};
exports.getAllItems = getAllItems;
const updateBranchInventory = async (req, res) => {
    try {
        const { branchId } = req.params;
        const { payload } = req.body;
        const result = await (0, inventory_service_1.updateQuanities)(Number(branchId), payload);
        res.status(200).json({
            success: true,
            ...result,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: error.message,
        });
    }
};
exports.updateBranchInventory = updateBranchInventory;
node_cron_1.default.schedule("*/1 * * * *", async () => {
    console.log("Running daily inventory cleanup...");
    try {
        await (0, inventory_db_1.deletedInventory)();
        console.log("Daily inventory cleanup completed");
    }
    catch (error) {
        console.error("Error in daily cleanup:", error);
    }
});
const checkInventory = async (req, res) => {
    try {
        const { branchId, items } = req.body;
        /**
         * items = [{ itemId, quantity }]
         */
        const result = await (0, inventory_service_1.checkInventoryForCheckout)(branchId, items);
        res.status(200).json({
            success: true,
            result,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
            details: error.details,
        });
    }
};
exports.checkInventory = checkInventory;
