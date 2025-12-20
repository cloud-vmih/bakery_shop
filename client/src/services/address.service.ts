import API from "../api/axois.config";

export const getMyAddresses = async () => {
  const res = await API.get("/address/my");
  return res.data;
};
