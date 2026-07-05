const asyncHandler = require("../middlewares/asyncHandler");
const walletService = require("../services/walletService");
const { transferMoney } = require("../services/transactionService");
const { successResponse } = require("../utils/apiResponse");

const getWallet = asyncHandler(async (req, res) => {
  const wallet = await walletService.getWallet(req.user._id);
  successResponse(res, 200, "Wallet fetched", { wallet });
});

const addMoney = asyncHandler(async (req, res) => {
  const { amount } = req.body;
  if (!amount || amount <= 0) {
    res.status(400);
    throw new Error("Invalid amount");
  }
  const result = await walletService.addMoney(req.user._id, parseFloat(amount));
  successResponse(res, 200, "Money added successfully", result);
});

const withdrawMoney = asyncHandler(async (req, res) => {
  const { amount } = req.body;
  if (!amount || amount <= 0) {
    res.status(400);
    throw new Error("Invalid amount");
  }
  const result = await walletService.withdrawMoney(req.user._id, parseFloat(amount));
  successResponse(res, 200, "Withdrawal successful", result);
});

const transfer = asyncHandler(async (req, res) => {
  const txn = await transferMoney({
    senderId: req.user._id,
    ...req.body,
    req,
  });
  successResponse(res, 200, "Transfer successful", { transaction: txn });
});

module.exports = { getWallet, addMoney, withdrawMoney, transfer };
