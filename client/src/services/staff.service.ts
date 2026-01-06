// src/services/staff.service.ts
import API from "../api/axois.config";

export const getAllStaff = async (keyword = "") => {
  const res = await API.get("/staff", {
    params: keyword ? { keyword } : {},
  });
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
export const lockStaff = async (id: number) => {
  const res = await API.patch(`/staff/${id}/lock`);
  return res.data;
};
export const unlockStaff = async (id: number) => {
  const res = await API.patch(`/staff/${id}/unlock`);
  return res.data;
};
