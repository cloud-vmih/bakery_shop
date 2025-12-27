import { Branch } from "../entity/Branch";
import { Address } from "../entity/Address";
import * as branchRepo from "../db/branch.db";

export const createBranch = async (
  name: string,
  placeId: string,
  formattedAddress?: string,
  latitude?: number,
  longitude?: number
) => {
  try {
    const branch = new Branch();
    branch.name = name;

    const address = new Address();
    address.placeId = placeId;
    address.fullAddress = formattedAddress!;
    address.lat = latitude!;
    address.lng = longitude!;
    address.branch = branch;
    return await branchRepo.createBranchWithAddress(branch, address);
  } catch (err) {
    throw err;
  }
};

export const getAllBranchService = async () => {
  return await branchRepo.getAllBranch();
};

export const updateBranch = async (
  branchId: number,
  payload: {
    branch?: Partial<Branch>;
    address?: Partial<Address>;
  }
) => {
  if (!branchId) throw new Error("Branch id is required");

  return await branchRepo.updateBranchWithAddress(branchId, payload);
};

export const deleteBranchService = async (branchId: number) => {
  if (!branchId) throw new Error("Branch id is required");

  return await branchRepo.deleteBranch(branchId);
};
