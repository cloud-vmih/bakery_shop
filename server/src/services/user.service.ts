import { getUserById, updateUser, UserResponse, UpdateUserPayload, getAllAdminAndStaff, getAllCustomer } from '../db/user.db';

// Lấy profile
export async function getProfile(userId: number): Promise<UserResponse> {
  const user = await getUserById(userId);
  if (!user) throw new Error('Không tìm thấy người dùng!');
  return user;
}

// Cập nhật profile
export async function updateProfile(userId: number, updates: UpdateUserPayload): Promise<UserResponse> {

  const updatedUser = await updateUser(userId, updates); // được join làm sạch, nếu không có file nào update thì trả về null
  if (!updatedUser) throw new Error('Không có thay đổi nào hoặc người dùng không tồn tại!');
  return updatedUser;
}

export const getAdminAndStaffIds = async (): Promise<number[]> => {
  const users = await getAllAdminAndStaff();
  return users.map(u => u.id!);
};

export const getCustomerIds = async (): Promise<number[]> => {
  const users = await getAllCustomer();
  return users.map(u => u.id!);
};
