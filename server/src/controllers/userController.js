const asyncHandler = require("../middlewares/asyncHandler");
const User = require("../models/User");
const KYCVerification = require("../models/KYCVerification");
const { successResponse } = require("../utils/apiResponse");

const getMe = asyncHandler(async (req, res) => {
  const kyc = await KYCVerification.findOne({ userId: req.user._id });
  successResponse(res, 200, "Profile fetched", {
    user: req.user.toSafeObject(),
    kyc,
  });
});

const updateMe = asyncHandler(async (req, res) => {
  const { fullName, phone, address, avatar } = req.body;
  const user = await User.findByIdAndUpdate(
    req.user._id,
    { fullName, phone, address, avatar },
    { new: true, runValidators: true }
  );
  successResponse(res, 200, "Profile updated", { user: user.toSafeObject() });
});

const updateKYC = asyncHandler(async (req, res) => {
  const { panNumber, aadhaarLast4, dob } = req.body;
  const kyc = await KYCVerification.findOneAndUpdate(
    { userId: req.user._id },
    { panNumber, aadhaarLast4, dob, status: "pending" },
    { new: true, upsert: true }
  );
  successResponse(res, 200, "KYC submitted", { kyc });
});

const searchUsers = asyncHandler(async (req, res) => {
  const { q } = req.query;
  if (!q || q.length < 2) {
    res.status(400);
    throw new Error("Search query too short");
  }
  const users = await User.find({
    $or: [{ email: new RegExp(q, "i") }, { username: new RegExp(q, "i") }],
    _id: { $ne: req.user._id },
    isFrozen: false,
  })
    .select("fullName username email customerId")
    .limit(10);
  successResponse(res, 200, "Search results", { users });
});

module.exports = { getMe, updateMe, updateKYC, searchUsers };
