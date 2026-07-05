import api from "./axios";
export const getAdminUsers = (params) => api.get("/admin/users", { params });
export const freezeUser = (id) => api.patch(`/admin/users/${id}/freeze`);
export const unfreezeUser = (id) => api.patch(`/admin/users/${id}/unfreeze`);
export const verifyKYC = (id, action, rejectionReason) =>
  api.patch(`/admin/kyc/${id}/verify`, { action, rejectionReason });
export const getAdminTransactions = (params) =>
  api.get("/admin/transactions", { params });
export const flagTransaction = (id, flagReason) =>
  api.patch(`/admin/transactions/${id}/flag`, { flagReason });
export const getAnalytics = () => api.get("/admin/analytics");
