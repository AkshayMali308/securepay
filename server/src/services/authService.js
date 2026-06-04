const crypto = require("crypto");
const User = require("../models/User");
const Wallet = require("../models/Wallet");
const KYCVerification = require("../models/KYCVerification");
const { generateAccessToken, generateRefreshToken } = require("../utils/generateToken");
const { createAuditLog } = require("./auditService");
const sendEmail = require("../utils/sendEmail");

const registerUser = async ({ fullName, username, email, password, phone }) => {
  const existingUser = await User.findOne({ $or: [{ email }, { username }] });
  if (existingUser) throw new Error("Email or username already in use");

  const customerId = `SP${Date.now().toString().slice(-8)}`;
  const user = await User.create({ fullName, username, email, password, phone, customerId });

  await Wallet.create({ userId: user._id });
  await KYCVerification.create({ userId: user._id });

  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);
  user.refreshTokens.push({ token: refreshToken });
  await user.save();

  return { user: user.toSafeObject(), accessToken, refreshToken };
};

const loginUser = async ({ email, password, req }) => {
  const user = await User.findOne({ email });
  if (!user || !(await user.comparePassword(password))) {
    throw new Error("Invalid email or password");
  }
  if (user.isFrozen) throw new Error("Account is frozen. Contact support.");

  user.lastLogin = new Date();
  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);
  user.refreshTokens.push({ token: refreshToken });
  if (user.refreshTokens.length > 5) user.refreshTokens.shift();
  await user.save();

  await createAuditLog({ actorId: user._id, actorRole: user.role, action: "LOGIN", req });

  return { user: user.toSafeObject(), accessToken, refreshToken };
};

const refreshAccessToken = async (refreshToken) => {
  const jwt = require("jsonwebtoken");
  const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
  const user = await User.findById(decoded.id);
  if (!user) throw new Error("User not found");
  const tokenExists = user.refreshTokens.some((t) => t.token === refreshToken);
  if (!tokenExists) throw new Error("Invalid refresh token");
  return generateAccessToken(user._id);
};

const forgotPassword = async (email) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error("No account with that email");
  const token = crypto.randomBytes(32).toString("hex");
  user.resetPasswordToken = crypto.createHash("sha256").update(token).digest("hex");
  user.resetPasswordExpires = Date.now() + 3600000;
  await user.save();

  const resetUrl = `${process.env.CLIENT_URL}/reset-password/${token}`;
  await sendEmail({
    to: email,
    subject: "SecurePay Password Reset",
    html: `<p>Click <a href="${resetUrl}">here</a> to reset your password. This link expires in 1 hour.</p><p>If you did not request this, ignore this email.</p>`,
  });
  return token;
};

const resetPassword = async (token, newPassword) => {
  const hashed = crypto.createHash("sha256").update(token).digest("hex");
  const user = await User.findOne({
    resetPasswordToken: hashed,
    resetPasswordExpires: { $gt: Date.now() },
  });
  if (!user) throw new Error("Invalid or expired token");
  user.password = newPassword;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  user.refreshTokens = [];
  await user.save();
};

module.exports = { registerUser, loginUser, refreshAccessToken, forgotPassword, resetPassword };
