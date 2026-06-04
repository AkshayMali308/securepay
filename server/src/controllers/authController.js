const asyncHandler = require("../middlewares/asyncHandler");
const authService = require("../services/authService");
const { successResponse } = require("../utils/apiResponse");

const register = asyncHandler(async (req, res) => {
  const result = await authService.registerUser(req.body);
  res.cookie("refreshToken", result.refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
  successResponse(res, 201, "Registration successful", {
    user: result.user,
    accessToken: result.accessToken,
  });
});

const login = asyncHandler(async (req, res) => {
  const result = await authService.loginUser({ ...req.body, req });
  res.cookie("refreshToken", result.refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
  successResponse(res, 200, "Login successful", {
    user: result.user,
    accessToken: result.accessToken,
  });
});

const refresh = asyncHandler(async (req, res) => {
  const token = req.cookies.refreshToken || req.body.refreshToken;
  if (!token) {
    res.status(401);
    throw new Error("No refresh token");
  }
  const accessToken = await authService.refreshAccessToken(token);
  successResponse(res, 200, "Token refreshed", { accessToken });
});

const logout = asyncHandler(async (req, res) => {
  res.clearCookie("refreshToken");
  successResponse(res, 200, "Logged out successfully");
});

const forgotPassword = asyncHandler(async (req, res) => {
  await authService.forgotPassword(req.body.email);
  successResponse(res, 200, "Reset link sent. Check server console in dev mode.");
});

const resetPassword = asyncHandler(async (req, res) => {
  await authService.resetPassword(req.params.token, req.body.password);
  successResponse(res, 200, "Password reset successfully");
});

module.exports = { register, login, refresh, logout, forgotPassword, resetPassword };
