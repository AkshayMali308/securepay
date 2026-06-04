import api from "./axios";
export const getTransactions = (params) => api.get("/transactions", { params });
export const getTransaction = (id) => api.get(`/transactions/${id}`);
export const exportTransactions = () =>
  api.get("/transactions/export", { responseType: "blob" });
