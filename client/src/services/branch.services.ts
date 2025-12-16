import API from "../api/axois.config";

interface CreateResponse {
    name: string;
    placeId: string;
    formattedAddress: string;
    latitude: number;
    longitude: number;
}
// CREATE
export const createBranch = async (data: CreateResponse) => {
    const res = await API.post("/branchs/create", data)
    return res.data.message;
};

// GET ALL
export const getBranches = async () => {
    const res = await API.get("/branchs");
    return res.data;
}
// UPDATE
export const updateBranch = async (
    id: Number,
    data: any
) => {
    const res = await API.put(`/branchs/update/${id}`, data);
    return res.data.message;
}
// DELETE
export const deleteBranch = async (id: number) => {
    const res = await API.delete(`/branchs/delete/${id}`)
    return res.data.message;
};
