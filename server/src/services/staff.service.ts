import bcrypt from "bcryptjs";
import {
  findUserByEmail,
  findAccountByUsername,
  createAccount,
  createUser,
  createStaff,
  findStaffById,
  findUserByAccountId,
  saveAccount,
  saveUser,
  saveStaff,
  removeStaff,
  removeUser,
  removeAccount,
  searchStaff,
} from "../db/staff.db";

// ===== DTO =====
interface CreateStaffDto {
  fullName: string;
  email: string;
  phoneNumber: string;
  dateOfBirth?: string;
  role: "staff" | "manager";
}

interface UpdateStaffDto {
  fullName?: string;
  email?: string;
  phoneNumber?: string;
  dateOfBirth?: string;
  role?: "staff" | "manager";
}

// ===== CREATE =====
export const createStaffService = async (
  data: CreateStaffDto
): Promise<any> => {
  const { fullName, email, phoneNumber, dateOfBirth, role } = data;

  if (await findUserByEmail(email)) throw new Error("Email đã tồn tại");
  if (await findAccountByUsername(email)) throw new Error("Username đã tồn tại");

  const tempPassword = "123456";
  const hashedPassword = await bcrypt.hash(tempPassword, 10);

  const account = await createAccount({
    username: email,
    password: hashedPassword,
  });

  const staff = await createStaff({
    fullName,
    email,
    phoneNumber,
    dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : undefined,
      status: "active",
    account,
  });

  // const staff = await createStaff({
  //   status: "active",
  //   account,
  // });

  return staff;
};

// ===== GET ALL =====
export const getAllStaffService = async (keyword?: string) => {
  return searchStaff(keyword);
};

// ===== GET BY ID =====
export const getStaffByIdService = async (id: number) => {
  const staff = await findStaffById(id);
  if (!staff) throw new Error("Staff not found");
  return staff;
};

// ===== UPDATE =====
export const updateStaffService = async (
  id: number,
  data: UpdateStaffDto
) => {
  const staff = await findStaffById(id);
  if (!staff?.account?.id) throw new Error("Staff not found");

  const user = await findUserByAccountId(staff.account.id);
  if (!user) throw new Error("User not found");

  if (data.email && data.email !== user.email) {
    if (await findUserByEmail(data.email)) throw new Error("Email đã tồn tại");
    user.email = data.email;
    staff.account.username = data.email;
    await saveAccount(staff.account);
  }

  if (data.fullName) user.fullName = data.fullName;
  if (data.phoneNumber) user.phoneNumber = data.phoneNumber;
  if (data.dateOfBirth) user.dateOfBirth = new Date(data.dateOfBirth);

  await saveStaff(user);

  // if (data.role) {
  //   staff.role = data.role;
  //   await saveStaff(staff);
  // }

  return staff;
};

// ===== DELETE =====
export const deleteStaffService = async (id: number) => {
  const staff = await findStaffById(id);
  if (!staff?.account?.id) throw new Error("Staff not found");

  const user = await findUserByAccountId(staff.account.id);

  return await removeStaff(staff);
  // if (user) await removeUser(user);
  // await removeAccount(staff.account);
};

// ===== LOCK / UNLOCK =====
export const lockStaffService = async (id: number) => {
  const staff = await findStaffById(id);
  if (!staff) throw new Error("Staff not found");
  staff.status = "locked";
  return await saveStaff(staff);
};

export const unlockStaffService = async (id: number) => {
  const staff = await findStaffById(id);
  if (!staff) throw new Error("Staff not found");
  staff.status = "active";
  return saveStaff(staff);
};

// ===== EXPORT CHO CONTROLLER =====
export {
  createStaffService as createStaff,
  getAllStaffService as getAllStaff,
  getStaffByIdService as getStaffById,
  updateStaffService as updateStaff,
  deleteStaffService as deleteStaff,
  lockStaffService as lockStaff,
  unlockStaffService as unlockStaff,
};
