import api from "./axios";
export const getWallet = () => api.get("/wallet");
export const addMoney = (amount) => api.post("/wallet/add-money", { amount });
export const withdrawMoney = (amount) => api.post("/wallet/withdraw", { amount });
export const transferMoney = (data) => api.post("/wallet/transfer", data);
