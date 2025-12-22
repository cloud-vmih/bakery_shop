"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteBranch = exports.updateBranchWithAddress = exports.getAllBranch = exports.createBranchWithAddress = void 0;
const Branch_1 = require("../entity/Branch");
const Address_1 = require("../entity/Address");
const database_1 = require("../config/database");
// export const createAddress = async (address: Address) => {
//   const repoAddress = AppDataSource.getRepository(Address);
//   const add = await repoAddress.create(address);
//   await repoAddress.save(add)
//   return add
// }
// export const createBranch = async (branch: Branch) => {
//   const repoBranch = AppDataSource.getRepository(Branch);
//   const b = await repoBranch.create(branch);
//   await repoBranch.save(b)
//   return b
// }
const createBranchWithAddress = async (branchData, addressData) => {
    return await database_1.AppDataSource.transaction(async (manager) => {
        const branchRepo = manager.getRepository(Branch_1.Branch);
        const addressRepo = manager.getRepository(Address_1.Address);
        const branch = branchRepo.create(branchData);
        await branchRepo.save(branch);
        const address = addressRepo.create({
            ...addressData,
            branch: branch,
        });
        await addressRepo.save(address);
        branch.address = address;
        return branch;
    });
};
exports.createBranchWithAddress = createBranchWithAddress;
const getAllBranch = async () => {
    console.log("DB");
    const repoBranch = database_1.AppDataSource.getRepository(Branch_1.Branch);
    const branches = await repoBranch.find({
        relations: {
            address: true
        }
    });
    console.log(branches);
    return branches;
};
exports.getAllBranch = getAllBranch;
const updateBranchWithAddress = async (branchId, payload) => {
    return await database_1.AppDataSource.transaction(async (manager) => {
        const branchRepo = manager.getRepository(Branch_1.Branch);
        const addressRepo = manager.getRepository(Address_1.Address);
        const branch = await branchRepo.findOne({
            where: { id: branchId },
            relations: { address: true },
        });
        if (!branch)
            throw new Error("Branch not found");
        if (payload.address && branch.address) {
            addressRepo.merge(branch.address, payload.address);
            await addressRepo.save(branch.address);
        }
        if (payload.branch) {
            branchRepo.merge(branch, payload.branch);
            await branchRepo.save(branch);
        }
        return branch;
    });
};
exports.updateBranchWithAddress = updateBranchWithAddress;
const deleteBranch = async (branchId) => {
    const repo = database_1.AppDataSource.getRepository(Branch_1.Branch);
    const result = await repo.delete(branchId);
    if (result.affected === 0) {
        throw new Error("Branch not found");
    }
    return { message: "Branch deleted" };
};
exports.deleteBranch = deleteBranch;
