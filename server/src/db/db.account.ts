import { AppDataSource } from "../config/database";
import { Account } from "../entity/Account";
import { Customer } from "../entity/Customer";
import { GoogleAccount } from "../entity/GoogleAccount";
import { User } from "../entity/User";

export const createAccount = async (account: Account) => {
  //console.log("Creating account for username:", username);
  const repo = AppDataSource.getRepository(Account);
  const acc = repo.create(account);
  await repo.save(acc);
  return acc;
}

export const createUser = async (user: User) => {
  const repo = AppDataSource.getRepository(User);
  const newUser = repo.create(user);
  await repo.save(newUser);
  return newUser;
}

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
}

export const socialAuthRepo = {
  findSocialAccount: async (providerUserId: string) => {
    const repo = AppDataSource.getRepository(GoogleAccount);

    return await repo.findOne({
      where: { provider_user_id: providerUserId },
      relations: ["account"],
    });
  },

  linkSocialAccount: async (providerUserId: string, email: string, accountId: number) => {
    const repo = AppDataSource.getRepository(GoogleAccount);

    const acc = repo.create({
      provider_user_id: providerUserId,
      email,
      account: { id: accountId },
    });

    await repo.save(acc);
  },
};
