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
    const res = await API.post("/branch/create", data)
    return res.data
};

// GET ALL
export const getBranches = async () => {
    const res = await API.get("/branch/branches");
    return res.data
}
// UPDATE
export const updateBranch = async (
    id: Number,
    data: any
) => {
    const res = await API.put(`/branch/update/${id}`, data);
    return res.data
}
// DELETE
export const deleteBranch = async (id: number) => {
    const res = await API.delete(`/branch/delete/${id}`)
    return res.data
};
