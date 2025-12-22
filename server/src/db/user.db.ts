// db/user.ts (cho các operations với single user)
import { AppDataSource } from '../config/database';
import { User } from '../entity/User';

// Interface cho User (dữ liệu trả về từ DB, không bao gồm password, khớp với entity fields có sẵn)
export interface UserResponse {
  id: number;
  fullName: string;
  email: string;
  phoneNumber: string;
  dateOfBirth: string;
  avatar: string | null;
}

// Interface cho updates (tùy chọn, chỉ update fields có giá trị, khớp với entity)
export interface UpdateUserPayload {
  fullName?: string;
  email?: string;
  phoneNumber?: string;
  dateOfBirth?: string;
  avatar?: string;
}

const userRepository = AppDataSource.getRepository(User);

// Helper để format dateOfBirth thành string (YYYY-MM-DD)
function formatDate(date?: Date): string {
  if (!date) return '';
  return date.toISOString().split('T')[0]; // YYYY-MM-DD
}

// Lấy thông tin user theo ID (không select password để bảo mật)
export async function getUserById(userId: number): Promise<UserResponse | null> {
  const user = await userRepository.findOne({
    where: { id: userId },
    select: {
      id: true,
      fullName: true,
      email: true,
      phoneNumber: true,
      dateOfBirth: true,
      avatarURL: true,
    },
  });
  if (!user || !user.id) return null;  // Check id để type narrow thành number

  return {
    id: user!.id,
    fullName: user.fullName || '',
    email: user.email || '',
    phoneNumber: user.phoneNumber || '',
    dateOfBirth: formatDate(user.dateOfBirth),
    avatar: user.avatarURL || null,
  };
}

// Cập nhật thông tin user
export async function updateUser(userId: number, updates: UpdateUserPayload): Promise<UserResponse | null> {
  if (Object.keys(updates).length === 0) {
    return null; // Không có field nào để update
  }

  const user = await userRepository.findOne({ where: { id: userId } });
  if (!user) {
    return null;
  }

  // Map updates để khớp entity fields (sử dụng undefined thay vì null để khớp type ?)
  if (updates.fullName !== undefined) user.fullName = updates.fullName;
  if (updates.email !== undefined) user.email = updates.email;
  if (updates.phoneNumber !== undefined) user.phoneNumber = updates.phoneNumber;
  if (updates.dateOfBirth !== undefined) {
    user.dateOfBirth = updates.dateOfBirth ? new Date(updates.dateOfBirth) : undefined;
  }
  if (updates.avatar !== undefined) user.avatarURL = updates.avatar;
  

  
  const savedUser = await userRepository.save(user);
  if (!savedUser || !savedUser.id) {  // Check id sau save
    return null;
  }
  // Trả về response đã map
  return {
    id: savedUser!.id,
    fullName: savedUser.fullName || '',
    email: savedUser.email || '',
    phoneNumber: savedUser.phoneNumber || '',
    dateOfBirth: formatDate(savedUser.dateOfBirth),
    avatar: savedUser.avatarURL || null,
  };
}

export async function getById(id: number): Promise<User | null> {
  return await userRepository.findOne({ where: { id } });
}