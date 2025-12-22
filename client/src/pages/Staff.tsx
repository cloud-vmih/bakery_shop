import { useEffect, useState, FormEvent } from "react";
import { createStaff, getAllStaff, deleteStaff, updateStaff } from "../services/staff.service";
import toast from "react-hot-toast";
import "../styles/auth.css";

export default function StaffPage() {
  const [staffList, setStaffList] = useState<any[]>([]);
  const [isEditing, setIsEditing] = useState(false);

  const [form, setForm] = useState({
    id: "",           
    fullName: "",
    email: "",
    phoneNumber: "",
    role: "Staff",
    dateOfBirth: "",
  });

  const load = async () => {
    try {
      const res = await getAllStaff();
      setStaffList(res);
    } catch (err: any) {
      toast.error("Không thể tải danh sách nhân viên");
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      const payload = {
        fullName: form.fullName,
        email: form.email,
        phoneNumber: form.phoneNumber,
        role: form.role,
        dateOfBirth: form.dateOfBirth ? new Date(form.dateOfBirth) : undefined, // 🔹 convert string → Date
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
      load();
    } catch (err: any) {
      toast.error(err.message || "Có lỗi xảy ra");
    }
  };

  const editStaff = (staff: any) => {
    setIsEditing(true);
    setForm({
      id: staff.id,
      fullName: staff.fullName,
      email: staff.email,
      phoneNumber: staff.phoneNumber,
      role: staff.type,
      dateOfBirth: staff.dateOfBirth ? new Date(staff.dateOfBirth).toISOString().slice(0, 10) : "", // 🔹 format yyyy-mm-dd
    });
  };

  const removeStaff = async (id: number) => {
    if (!window.confirm("Bạn chắc chắn muốn xóa?")) return;

    await deleteStaff(id);
    toast.success("Xóa nhân viên thành công!");
    load();
  };

  return (
    <div className="auth-container">
      <div className="auth-card" style={{ maxWidth: 600 }}>
        <h2 className="text-3xl font-bold text-cyan-800 mb-4 text-center">
          Quản lý nhân viên
        </h2>

        {/* FORM ADD / EDIT */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            className="input-box"
            placeholder="Họ và tên"
            value={form.fullName}
            onChange={(e) => setForm({ ...form, fullName: e.target.value })}
            required
          />

          <input
            type="email"
            className="input-box"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />

          <input
            type="text"
            className="input-box"
            placeholder="Số điện thoại"
            value={form.phoneNumber}
            onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })}
            required
          />

          <input
            type="date"
            className="input-box"
            placeholder="Ngày sinh"
            value={form.dateOfBirth}
            onChange={(e) => setForm({ ...form, dateOfBirth: e.target.value })}
            required
          />

          <select
            className="input-box"
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
          >
            <option value="Staff">Nhân viên</option>
            <option value="Manager">Quản lý</option>
          </select>

          <button type="submit" className="auth-btn">
            {isEditing ? "Lưu thay đổi" : "Thêm nhân viên"}
          </button>
        </form>

        <hr className="my-6" />

        {/* DANH SÁCH NHÂN VIÊN */}
        <h3 className="text-lg font-semibold text-cyan-700 mb-3">Danh sách nhân viên</h3>

        {staffList.map((staff) => (
          <div key={staff.id} className="flex justify-between items-center bg-gray-100 p-3 mb-2 rounded">
            <div>
              <p><b>{staff.fullName}</b></p>
              <p>{staff.email}</p>
              <p>{staff.phoneNumber}</p>
              <p>{staff.dateOfBirth ? new Date(staff.dateOfBirth).toLocaleDateString() : ""}</p>
            </div>

            <div className="flex gap-2">
              <button
                className="auth-btn"
                style={{ padding: "6px 12px" }}
                onClick={() => editStaff(staff)}
              >
                Sửa
              </button>

              <button
                className="auth-btn"
                style={{ backgroundColor: "#d9534f", padding: "6px 12px" }}
                onClick={() => removeStaff(staff.id)}
              >
                Xóa
              </button>
            </div>
          </div>
        ))}

      </div>
    </div>
  );
}
