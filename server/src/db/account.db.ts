import { AppDataSource } from "../config/database";
import { Account } from "../entity/Account";
import { Customer } from "../entity/Customer";
import { GoogleAccount } from "../entity/GoogleAccount";
import { User } from "../entity/User";
import { EmailVerification } from "../entity/EmailVerification";
import { LessThan } from "typeorm";

export const createAccount = async (account: Account) => {
  //console.log("Creating account for username:", username);
  const repo = AppDataSource.getRepository(Account);
  const acc = repo.create(account);
  await repo.save(acc);
  return acc;
};

export const createUser = async (user: Customer) => {
  const repo = AppDataSource.getRepository(Customer);
  const newUser = repo.create(user);
  await repo.save(newUser);
  return newUser;
};

export const deletedUserNotVerified = async () => {
  const thirtyMinsAgo = new Date(Date.now() - 30 * 60 * 1000);

  const verRepo = AppDataSource.getRepository(EmailVerification);
  const accRepo = AppDataSource.getRepository(Account);

  // Tìm account chưa verify
  const pending = await verRepo.find({
    where: {
      isVerified: false,
      verifiedAt: LessThan(thirtyMinsAgo),
    },
    relations: ["account"],
  });

  // Xoá account -> auto xoá user + verification
  for (const v of pending) {
    await accRepo.delete(v.account!.id!);
  }
};

export const findAccountByUsername = async (username: string) => {
  const repo = AppDataSource.getRepository(Account);
  return await repo.findOne({
    where: { username },
  });
};

export const findUserByAccountId = async (id: number) => {
  const repo = AppDataSource.getRepository(User);
  return await repo.findOne({
    where: { account: { id: id } },
  });
};

export const updatePassword = async (hash: string, id: number) => {
  const accountRepo = AppDataSource.getRepository(Account);
  await accountRepo.update({ id }, { password: hash });
};

export const findUserByEmail = async (email: string) => {
  const repo = AppDataSource.getRepository(User);
  const user = await repo.findOne({
    where: { email },
    relations: ["account"],
  });
  return user ?? null;
};


export const isPhoneNumberTaken = async (phoneNumber: string) => {
  const repo = AppDataSource.getRepository(User);
  const user = await repo.findOne({
    where: { phoneNumber },
  });
  return !!user;
};

export const socialAuthRepo = {
  findSocialAccount: async (providerUserId: string) => {
    const repo = AppDataSource.getRepository(GoogleAccount);

    return await repo.findOne({
      where: { provider_user_id: providerUserId },
      relations: ["account"],
    });
  },

  linkSocialAccount: async (
    providerUserId: string,
    email: string,
    accountId: number
  ) => {
    const repo = AppDataSource.getRepository(GoogleAccount);

    const acc = repo.create({
      provider_user_id: providerUserId,
      email,
      account: { id: accountId },
    });

    await repo.save(acc);
  },
};
