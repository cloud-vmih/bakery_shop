import API from "../api/axois.config";

export const verifyEmail = async (token: string) => {
    const res= await API.get(`/verify-email?token=${token}`)
    return res.data
}