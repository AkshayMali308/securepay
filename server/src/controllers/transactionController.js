const asyncHandler = require("../middlewares/asyncHandler");
const { getTransactions } = require("../services/transactionService");
const Transaction = require("../models/Transaction");
const { successResponse } = require("../utils/apiResponse");

const listTransactions = asyncHandler(async (req, res) => {
  const result = await getTransactions({ userId: req.user._id, ...req.query });
  successResponse(res, 200, "Transactions fetched", result);
});

const getTransaction = asyncHandler(async (req, res) => {
  const txn = await Transaction.findOne({
    _id: req.params.id,
    $or: [{ senderId: req.user._id }, { receiverId: req.user._id }],
  }).populate("senderId receiverId", "fullName username email");
  if (!txn) {
    res.status(404);
    throw new Error("Transaction not found");
  }
  successResponse(res, 200, "Transaction found", { transaction: txn });
});

const exportTransactions = asyncHandler(async (req, res) => {
  const { transactions } = await getTransactions({
    userId: req.user._id,
    limit: 1000,
    page: 1,
  });

  const rows = transactions.map((t) => ({
    referenceId: t.referenceId,
    type: t.type,
    amount: t.amount,
    status: t.status,
    note: t.note,
    createdAt: t.createdAt,
  }));

  const { Parser } = require("json2csv");
  const fields = ["referenceId", "type", "amount", "status", "note", "createdAt"];
  const parser = new Parser({ fields });
  const csv = parser.parse(rows);

  res.header("Content-Type", "text/csv");
  res.attachment("transactions.csv");
  res.send(csv);
});

module.exports = { listTransactions, getTransaction, exportTransactions };
