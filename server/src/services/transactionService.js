const User = require("../models/User");
const Wallet = require("../models/Wallet");
const Transaction = require("../models/Transaction");
const { createNotification } = require("./notificationService");
const { createAuditLog } = require("./auditService");

const transferMoney = async ({ senderId, receiverIdentifier, amount, note = "", req }) => {
  // Find receiver by email or username
  const receiver = await User.findOne({
    $or: [{ email: receiverIdentifier }, { username: receiverIdentifier }],
  });

  if (!receiver) throw new Error("Receiver not found");
  if (receiver._id.toString() === senderId.toString())
    throw new Error("Cannot transfer to yourself");
  if (receiver.isFrozen) throw new Error("Receiver account is frozen");

  const senderWallet = await Wallet.findOne({ userId: senderId });
  const receiverWallet = await Wallet.findOne({ userId: receiver._id });

  if (!senderWallet || !senderWallet.isActive) throw new Error("Your wallet is not active");
  if (!receiverWallet || !receiverWallet.isActive)
    throw new Error("Receiver wallet is not active");

  // Check daily transfer limit
  senderWallet.resetDailyLimitIfNeeded();
  const remaining = senderWallet.dailyTransferLimit - senderWallet.dailyTransferUsed;
  if (amount > remaining)
    throw new Error(`Daily transfer limit exceeded. Remaining: Rs.${remaining}`);

  // Check balance
  if (senderWallet.balance < amount) throw new Error("Insufficient balance");

  // Debit sender wallet
  senderWallet.balance -= amount;
  senderWallet.dailyTransferUsed += amount;
  await senderWallet.save();

  // Credit receiver wallet
  receiverWallet.balance += amount;
  await receiverWallet.save();

  // Record the transaction
  const txn = await Transaction.create({
    senderId,
    receiverId: receiver._id,
    amount,
    type: "transfer",
    status: "success",
    note,
  });

  // Send notifications to both users
  const sender = await User.findById(senderId);
  await createNotification({
    userId: senderId,
    title: "Transfer Successful",
    message: `Rs.${amount} sent to ${receiver.fullName}.`,
    type: "transaction",
    relatedId: txn._id,
  });
  await createNotification({
    userId: receiver._id,
    title: "Money Received",
    message: `Rs.${amount} received from ${sender.fullName}.`,
    type: "transaction",
    relatedId: txn._id,
  });

  // Audit log
  await createAuditLog({
    actorId: senderId,
    actorRole: "user",
    action: "TRANSFER",
    targetId: receiver._id,
    targetModel: "User",
    details: { amount, referenceId: txn.referenceId },
    req,
  });

  // Real-time socket update for receiver
  try {
    const { getIO } = require("../config/socketConfig");
    const io = getIO();
    io.to(receiver._id.toString()).emit("balance_update", {
      newBalance: receiverWallet.balance,
    });
  } catch (_) {}

  return txn;
};

const getTransactions = async ({
  userId,
  page = 1,
  limit = 10,
  type,
  status,
  startDate,
  endDate,
  minAmount,
  maxAmount,
}) => {
  const query = { $or: [{ senderId: userId }, { receiverId: userId }] };
  if (type) query.type = type;
  if (status) query.status = status;
  if (startDate || endDate) {
    query.createdAt = {};
    if (startDate) query.createdAt.$gte = new Date(startDate);
    if (endDate) query.createdAt.$lte = new Date(endDate);
  }
  if (minAmount || maxAmount) {
    query.amount = {};
    if (minAmount) query.amount.$gte = parseFloat(minAmount);
    if (maxAmount) query.amount.$lte = parseFloat(maxAmount);
  }

  const total = await Transaction.countDocuments(query);
  const transactions = await Transaction.find(query)
    .populate("senderId", "fullName username email")
    .populate("receiverId", "fullName username email")
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(parseInt(limit));

  return {
    transactions,
    pagination: {
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      pages: Math.ceil(total / limit),
    },
  };
};

module.exports = { transferMoney, getTransactions };