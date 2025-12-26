import { AppDataSource } from "../config/database";
import { User } from "../entity/User";
import { Account } from "../entity/Account";
import { Staff } from "../entity/Staff";

// ===== REPOS =====
const userRepo = () => AppDataSource.getRepository(User);
const accountRepo = () => AppDataSource.getRepository(Account);
const staffRepo = () => AppDataSource.getRepository(Staff);

// ===== FIND =====
export const findUserByEmail = async (email: string) => {
  return userRepo().findOne({ where: { email } });
};

export const findAccountByUsername = async (username: string) => {
  return accountRepo().findOne({ where: { username } });
};

export const findStaffById = async (id: number) => {
  return staffRepo().findOne({
    where: { id },
    relations: ["account", "account.user"],
  });
};

export const findUserByAccountId = async (accountId: number) => {
  return staffRepo().findOne({
    where: { account: { id: accountId } },
  });
};

// ===== CREATE =====
export const createAccount = async (data: Partial<Account>) => {
  const acc = accountRepo().create(data);
  return accountRepo().save(acc);
};

export const createUser = async (data: Partial<User>) => {
  const user = userRepo().create(data);
  return userRepo().save(user);
};

export const createStaff = async (data: Partial<Staff>) => {
  const staff = staffRepo().create(data);
  return staffRepo().save(staff);
};

// ===== UPDATE =====
export const saveUser = async (user: User) => {
  return userRepo().save(user);
};

export const saveAccount = async (account: Account) => {
  return accountRepo().save(account);
};

export const saveStaff = async (staff: Staff) => {
  return staffRepo().save(staff);
};

// ===== DELETE =====
export const removeStaff = async (staff: Staff) => {
  return staffRepo().remove(staff);
};

export const removeUser = async (user: User) => {
  return userRepo().remove(user);
};

export const removeAccount = async (account: Account) => {
  return accountRepo().remove(account);
};

// ===== QUERY =====
export const searchStaff = async (keyword?: string) => {
  const qb = staffRepo()
    .createQueryBuilder("staff")
    .leftJoinAndSelect("staff.account", "account")
    .leftJoinAndSelect("account.user", "user");

  if (keyword && keyword.trim() !== "") {
    qb.where(
      "(user.fullName ILIKE :kw OR user.email ILIKE :kw OR user.phoneNumber ILIKE :kw)",
      { kw: `%${keyword}%` }
    );
  }

  return qb.getMany();
};
