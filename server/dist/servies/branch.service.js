"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteBranchService = exports.updateBranch = exports.getAllBranchService = exports.createBranch = void 0;
const Branch_1 = require("../entity/Branch");
const Address_1 = require("../entity/Address");
const branchRepo = __importStar(require("../db/db.branch"));
const createBranch = async (name, placeId, formattedAddress, latitude, longitude) => {
    try {
        const branch = new Branch_1.Branch();
        branch.name = name;
        const address = new Address_1.Address();
        address.placeId = placeId;
        address.fullAddress = formattedAddress;
        address.lat = latitude;
        address.lng = longitude;
        address.branch = branch;
        return await branchRepo.createBranchWithAddress(branch, address);
    }
    catch (err) {
        throw err;
    }
};
exports.createBranch = createBranch;
const getAllBranchService = async () => {
    return await branchRepo.getAllBranch();
};
exports.getAllBranchService = getAllBranchService;
const updateBranch = async (branchId, payload) => {
    if (!branchId)
        throw new Error("Branch id is required");
    return await branchRepo.updateBranchWithAddress(branchId, payload);
};
exports.updateBranch = updateBranch;
const deleteBranchService = async (branchId) => {
    if (!branchId)
        throw new Error("Branch id is required");
    return await branchRepo.deleteBranch(branchId);
};
exports.deleteBranchService = deleteBranchService;
