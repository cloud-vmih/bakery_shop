import API from "../api/axois.config";

interface CreateResponse {
    name: string;
    placeId: string;
    formattedAddress: string;
    latitude: number;
    longitude: number;
}

export type Branch = {
  id: number;
  name: string;
  lat: number;
  lng: number;
  address: string;
};

// CREATE
export const createBranch = async (data: CreateResponse) => {
    try {
        const res = await API.post("/branchs/create", data)
        return res.data.message;
    }
    catch (err: any) {
        throw err;
    }
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
    try {
        const res = await API.put(`/branchs/update/${id}`, data);
        return res.data.message;
    }
    catch (err: any) {
        throw err;
    }
}
// DELETE
export const deleteBranch = async (id: number) => {
    try {
        const res = await API.delete(`/branchs/delete/${id}`)
        return res.data.message;
    }
    catch (err: any) {
       throw err;
    }
};
