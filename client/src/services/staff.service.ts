// src/services/staff.service.ts
import API from "../api/axois.config";

export const getAllStaff = async () => {
  const res = await API.get("/staff");
  return res.data;
};

export const createStaff = async (data: any) => {
  const res = await API.post("/staff", data);
  return res.data;
};

export const updateStaff = async (id: number, data: any) => {
  const res = await API.patch(`/staff/${id}`, data);
  return res.data;
};

export const deleteStaff = async (id: number) => {
  const res = await API.delete(`/staff/${id}`);
  return res.data;
};
