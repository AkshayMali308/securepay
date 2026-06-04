import api from "./axios";
export const getMe = () => api.get("/users/me");
export const updateMe = (data) => api.put("/users/me", data);
export const updateKYC = (data) => api.put("/users/me/kyc", data);
export const searchUsers = (q) => api.get("/users/search", { params: { q } });
