const asyncHandler = require("../middlewares/asyncHandler");
const User = require("../models/User");
const Transaction = require("../models/Transaction");
const KYCVerification = require("../models/KYCVerification");
const { createAuditLog } = require("../services/auditService");
const { successResponse } = require("../utils/apiResponse");

const getAllUsers = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, search, isFrozen } = req.query;
  const query = {};
  if (search) {
    query.$or = [
      { email: new RegExp(search, "i") },
      { username: new RegExp(search, "i") },
      { fullName: new RegExp(search, "i") },
    ];
  }
  if (isFrozen !== undefined) query.isFrozen = isFrozen === "true";
  const total = await User.countDocuments(query);
  const users = await User.find(query)
    .select("-password -refreshTokens")
    .skip((page - 1) * limit)
    .limit(parseInt(limit))
    .sort({ createdAt: -1 });
  successResponse(res, 200, "Users fetched", { users, total });
});

const freezeUser = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndUpdate(
    req.params.id,
    { isFrozen: true },
    { new: true }
  );
  if (!user) { res.status(404); throw new Error("User not found"); }
  await createAuditLog({
    actorId: req.user._id,
    actorRole: "admin",
    action: "FREEZE_ACCOUNT",
    targetId: user._id,
    targetModel: "User",
    req,
  });
  successResponse(res, 200, "Account frozen", { user: user.toSafeObject() });
});

const unfreezeUser = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndUpdate(
    req.params.id,
    { isFrozen: false },
    { new: true }
  );
  if (!user) { res.status(404); throw new Error("User not found"); }
  await createAuditLog({
    actorId: req.user._id,
    actorRole: "admin",
    action: "UNFREEZE_ACCOUNT",
    targetId: user._id,
    targetModel: "User",
    req,
  });
  successResponse(res, 200, "Account unfrozen", { user: user.toSafeObject() });
});

const verifyKYC = asyncHandler(async (req, res) => {
  const { action, rejectionReason } = req.body;
  const kyc = await KYCVerification.findOneAndUpdate(
    { userId: req.params.id },
    {
      status: action === "approve" ? "verified" : "rejected",
      rejectionReason: rejectionReason || "",
      verifiedAt: new Date(),
      verifiedBy: req.user._id,
    },
    { new: true }
  );
  successResponse(res, 200, "KYC updated", { kyc });
});

const getAllTransactions = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, flagged, status } = req.query;
  const query = {};
  if (flagged !== undefined) query.flagged = flagged === "true";
  if (status) query.status = status;
  const total = await Transaction.countDocuments(query);
  const transactions = await Transaction.find(query)
    .populate("senderId receiverId", "fullName username email")
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(parseInt(limit));
  successResponse(res, 200, "Transactions fetched", { transactions, total });
});

const flagTransaction = asyncHandler(async (req, res) => {
  const { flagReason } = req.body;
  const txn = await Transaction.findByIdAndUpdate(
    req.params.id,
    { flagged: true, flagReason },
    { new: true }
  );
  successResponse(res, 200, "Transaction flagged", { transaction: txn });
});

const getAnalytics = asyncHandler(async (req, res) => {
  const [totalUsers, totalTransactions, successTxn, failedTxn, flaggedTxn, frozenUsers] =
    await Promise.all([
      User.countDocuments({ role: "user" }),
      Transaction.countDocuments(),
      Transaction.countDocuments({ status: "success" }),
      Transaction.countDocuments({ status: "failed" }),
      Transaction.countDocuments({ flagged: true }),
      User.countDocuments({ isFrozen: true }),
    ]);

  const volumeResult = await Transaction.aggregate([
    { $match: { status: "success", type: "transfer" } },
    { $group: { _id: null, total: { $sum: "$amount" } } },
  ]);
  const totalVolume = volumeResult[0]?.total || 0;

  successResponse(res, 200, "Analytics fetched", {
    totalUsers,
    totalTransactions,
    successTxn,
    failedTxn,
    flaggedTxn,
    frozenUsers,
    totalVolume,
  });
});

module.exports = {
  getAllUsers,
  freezeUser,
  unfreezeUser,
  verifyKYC,
  getAllTransactions,
  flagTransaction,
  getAnalytics,
};
