import { Branch } from "../entity/Branch";
import { Address } from "../entity/Address";
import * as branchRepo from "../db/db.branch";

export const createBranch = async (name: string, placeId: Number, formattedAddress?: string, latitude?: number, longitude?: number) => {
  try{ 
    const branch = new Branch();
    branch.name = name;

    const address = new Address()
    address.placeId = placeId;
    address.formattedAddress = formattedAddress;
    address.latitude = latitude;
    address.longitude = longitude;
    address.branch = branch
    await branchRepo.createBranchWithAddress(branch, address)
    return ({message: "Branch added successfully!"})
  }
  catch (err) {
    throw err
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
