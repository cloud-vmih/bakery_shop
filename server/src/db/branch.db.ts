import { Branch } from "../entity/Branch";
import { Address } from "../entity/Address";
import { AppDataSource } from "../config/database";

export const createBranchWithAddress = async (
  branchData: Partial<Branch>,
  addressData: Partial<Address>
) => {
  return await AppDataSource.transaction(async (manager) => {
    const branchRepo = manager.getRepository(Branch);
    const addressRepo = manager.getRepository(Address);

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

export const getAllBranch = async () => {
  const repoBranch = AppDataSource.getRepository(Branch);
  const branches = await repoBranch.find({
    relations: {
      address: true,
    },
  });

  return branches;
};

export const updateBranchWithAddress = async (
  branchId: number,
  payload: {
    branch?: Partial<Branch>;
    address?: Partial<Address>;
  }
) => {
  return await AppDataSource.transaction(async (manager) => {
    const branchRepo = manager.getRepository(Branch);
    const addressRepo = manager.getRepository(Address);

    const branch = await branchRepo.findOne({
      where: { id: branchId },
      relations: { address: true },
    });

    if (!branch) throw new Error("Branch not found");

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

export const deleteBranch = async (branchId: number) => {
  const repo = AppDataSource.getRepository(Branch);
  const result = await repo.delete(branchId);
  if (result.affected === 0) {
    throw new Error("Branch not found");
  }
  return { message: "Branch deleted" };
};
