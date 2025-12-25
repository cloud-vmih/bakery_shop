import { useEffect, useState, FormEvent, useCallback, useMemo } from "react";
import {
  createStaff,
  getAllStaff,
  deleteStaff,
  updateStaff,
  lockStaff,
  unlockStaff,
} from "../services/staff.service";
import toast from "react-hot-toast";
import "../styles/auth.css";
// Helper function
const formatDateForInput = (date: string | Date | undefined): string => {
  if (!date) return '';
  const d = new Date(date);
  return isNaN(d.getTime()) ? '' : d.toISOString().slice(0, 10);
};

// 🔹 Định nghĩa interface cho typing
interface Staff {
  id: number;
  fullName: string;
  email: string;
  phoneNumber: string;
  role: "staff" | "manager";
  dateOfBirth?: string | Date; // Backend có thể return string hoặc Date
  status?: "locked" | "active"; // Giả định status
}

interface FormData {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  role: "staff" | "manager";
  dateOfBirth: string;
}

export default function StaffPage() {
  const [staffList, setStaffList] = useState<Staff[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [keyword, setKeyword] = useState("");
  const [isLoading, setIsLoading] = useState(false); // 🔹 Thêm loading

  const [form, setForm] = useState<FormData>({
    id: "",
    fullName: "",
    email: "",
    phoneNumber: "",
    role: "staff",
    dateOfBirth: "",
  });

  // 🔹 Debounce search (gọi load sau 300ms không gõ)
  const debouncedSearch = useMemo(
    () => {
      let timeoutId: NodeJS.Timeout;
      return (searchKey: string) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => load(searchKey), 300);
      };
    },
    []
  );

  const load = useCallback(async (searchKey = "") => {
  setIsLoading(true);
  try {
    const res = await getAllStaff(searchKey);
    console.log("API Response (raw):", res);  // ← Debug: Xem structure nested

    // Map nested → flat, safe với fallback
    const flatList: Staff[] = res.map((item: any) => {
      const user = item.account?.user;  // ← Access user từ join
      console.log("Mapping item:", item, "User:", user);  // ← Debug từng item

      return {
        id: item.id || 0,
        fullName: user?.fullName || 'Không có tên',  // ← Fallback nếu null
        email: user?.email || 'Không có email',
        phoneNumber: user?.phoneNumber || 'Không có SĐT',
        role: item.role || 'staff',
        dateOfBirth: user?.dateOfBirth || '',
        status: item.status || 'active',
      };
    });
    console.log("Flat List:", flatList);  // ← Debug final list

    setStaffList(flatList);
  } catch (error) {
    console.error("Load error:", error);  // ← Log nếu API fail
    toast.error("Không thể tải danh sách nhân viên");
  } finally {
    setIsLoading(false);
  }
}, []);

  useEffect(() => {
    load();
  }, [load]);

  // 🔹 Search onChange với debounce
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setKeyword(value);
    debouncedSearch(value);
  };

  const handleSubmit = async (e: FormEvent) => {
  e.preventDefault();

  // 🔹 Cải thiện validation email (regex đơn giản hơn)
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email) || !/^\d{10,11}$/.test(form.phoneNumber)) {
    toast.error("Email hoặc SĐT không hợp lệ");
    return;
  }

  const date = form.dateOfBirth ? new Date(form.dateOfBirth) : undefined;
  if (date && isNaN(date.getTime())) {
    toast.error("Ngày sinh không hợp lệ");
    return;
  }

  // 🔹 Thêm check id khi editing
  if (isEditing && !form.id) {
    toast.error("ID nhân viên không hợp lệ");
    return;
  }

  // 🔹 Disable button tạm (nếu có ref)
  // const submitBtn = document.querySelector('button[type="submit"]') as HTMLButtonElement;
  // submitBtn.disabled = true;

  try {
    const payload = {
      fullName: form.fullName,
      email: form.email,
      phoneNumber: form.phoneNumber,
      role: form.role,
      dateOfBirth: form.dateOfBirth || undefined,
    };

    if (isEditing) {
      await updateStaff(Number(form.id), payload);
      toast.success("Cập nhật thành công!");
    } else {
      await createStaff(payload);
      toast.success("Thêm nhân viên thành công!");
    }

    setForm({ id: "", fullName: "", email: "", phoneNumber: "", role: "staff", dateOfBirth: "" });
    setIsEditing(false);
    load(keyword);
  } catch (err: any) {
    // 🔹 Fix chính: Parse axios error đúng (response.data.error từ backend)
    let errorMessage = "Có lỗi xảy ra";
    if (err.response?.data?.error) {
      errorMessage = err.response.data.error;  // "Email đã tồn tại" từ controller
    } else if (err.message) {
      errorMessage = err.message;  // Fallback generic
    }
    toast.error(errorMessage);
  } finally {
    // 🔹 Re-enable button
    // submitBtn.disabled = false;
  }
};

  const editStaff = (staff: any) => {
  setIsEditing(true);
  setForm({
    id: staff.id?.toString() || "",
    fullName: staff.fullName || "",
    email: staff.email || "",
    phoneNumber: (staff.phoneNumber || "").toString().trim(),  // Trim + handle undefined
    role: "staff",
    dateOfBirth: formatDateForInput(staff.dateOfBirth),  // Safe format
  });
};

  const removeStaff = async (id: number) => {
    if (!window.confirm("Bạn chắc chắn muốn xóa?")) return;

    try {
      await deleteStaff(id);
      toast.success("Xóa nhân viên thành công!");
      load(keyword); // 🔹 Giữ search
    } catch {
      toast.error("Xóa thất bại");
    }
  };

  const toggleLock = async (staff: Staff) => {
    const isLocked = staff.status === "locked";

    if (
      !window.confirm(
        isLocked
          ? "Bạn muốn gỡ khóa nhân viên này?"
          : "Bạn muốn khóa nhân viên này?"
      )
    )
      return;

    try {
      if (isLocked) {
        await unlockStaff(staff.id);
        toast.success("Gỡ khóa thành công!");
      } else {
        await lockStaff(staff.id);
        toast.success("Khóa tài khoản thành công!");
      }
      load(keyword);
    } catch {
      toast.error("Thao tác thất bại");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <h1 className="text-3xl font-bold mb-6 text-emerald-800 text-center">
        Quản lý nhân viên
      </h1>

      {/* Form Add/Edit */}
      <div className="bg-gradient-to-r from-emerald-50 to-green-50 p-6 rounded-2xl shadow-lg mb-8">
        <h2 className="text-xl font-semibold text-gray-700 mb-4 text-center">
          {isEditing ? "Chỉnh sửa nhân viên" : "Thêm nhân viên mới"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Họ và tên</label>
            <input
              type="text"
              className="w-full rounded-lg border-gray-300 shadow-sm p-2 focus:ring-emerald-300 focus:border-emerald-500"
              value={form.fullName}
              onChange={(e) => setForm({ ...form, fullName: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              className="w-full rounded-lg border-gray-300 shadow-sm p-2 focus:ring-emerald-300 focus:border-emerald-500"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Số điện thoại</label>
            <input
              type="tel"
              className="w-full rounded-lg border-gray-300 shadow-sm p-2 focus:ring-emerald-300 focus:border-emerald-500"
              value={form.phoneNumber}
              onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Ngày sinh</label>
            <input
              type="date"
              className="w-full rounded-lg border-gray-300 shadow-sm p-2 focus:ring-emerald-300 focus:border-emerald-500"
              value={form.dateOfBirth}
              onChange={(e) => setForm({ ...form, dateOfBirth: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Vai trò</label>
            <select
              className="w-full rounded-lg border-gray-300 shadow-sm p-2 focus:ring-emerald-300 focus:border-emerald-500"
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value as "staff" | "manager" })}
            >
              <option value="staff">Nhân viên</option>
              <option value="manager">Quản lý</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-emerald-600 text-white font-semibold py-2 rounded-lg shadow hover:bg-emerald-700 transition"
            disabled={isLoading}
          >
            {isLoading ? "Đang xử lý..." : isEditing ? "Lưu thay đổi" : "Thêm nhân viên"}
          </button>
        </form>
      </div>

      {/* Search */}
      <input
        className="w-full mb-4 p-2 rounded-lg border border-gray-300 shadow-sm focus:ring-emerald-300 focus:border-emerald-500"
        placeholder="Tìm theo tên, email hoặc SĐT..."
        value={keyword}
        onChange={handleSearchChange}
      />

      {/* Staff List */}
      {isLoading ? (
        <p className="text-center py-6 text-gray-500">Đang tải danh sách...</p>
      ) : staffList.length === 0 ? (
        <p className="text-center py-6 text-gray-500">Không có nhân viên nào.</p>
      ) : (
        <div className="space-y-4">
          {staffList.map((staff) => {
            const dobDisplay = staff.dateOfBirth ? new Date(staff.dateOfBirth).toLocaleDateString("vi-VN") : "";
            return (
              <div
                key={staff.id}
                className="bg-white p-4 rounded-2xl shadow hover:shadow-md transition flex justify-between items-center"
              >
                <div>
                  <p className="font-medium text-gray-800">{staff.fullName}</p>
                  <p className="text-sm text-gray-500">{staff.email}</p>
                  <p className="text-sm text-gray-500">{staff.phoneNumber}</p>
                  <p className="text-sm text-gray-500">Ngày sinh: {dobDisplay}</p>
                  <p className="text-sm">
                    Trạng thái:{" "}
                    <span className={staff.status === "locked" ? "text-red-500" : "text-green-600"}>
                      {staff.status === "locked" ? "Đã khóa" : "Hoạt động"}
                    </span>
                  </p>
                </div>

                <div className="flex gap-2">
                  <button
                    className={`py-1 px-3 rounded-lg text-white font-medium shadow ${
                      staff.status === "locked" ? "bg-gray-400 cursor-not-allowed" : "bg-emerald-500 hover:bg-emerald-600"
                    }`}
                    onClick={() => editStaff(staff)}
                    disabled={staff.status === "locked"}
                  >
                    Sửa
                  </button>

                  <button
                    className={`py-1 px-3 rounded-lg text-white font-medium shadow ${
                      staff.status === "locked" ? "bg-emerald-500 hover:bg-emerald-600" : "bg-yellow-500 hover:bg-yellow-600"
                    }`}
                    onClick={() => toggleLock(staff)}
                  >
                    {staff.status === "locked" ? "Gỡ khóa" : "Khóa"}
                  </button>

                  <button
                    className="py-1 px-3 rounded-lg bg-red-500 hover:bg-red-600 text-white font-medium shadow"
                    onClick={() => removeStaff(staff.id)}
                  >
                    Xóa
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}