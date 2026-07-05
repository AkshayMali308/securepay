const Wallet = require("../models/Wallet");
const Transaction = require("../models/Transaction");
const { createNotification } = require("./notificationService");

const getWallet = async (userId) => {
  const wallet = await Wallet.findOne({ userId });
  if (!wallet) throw new Error("Wallet not found");
  return wallet;
};

const addMoney = async (userId, amount) => {
  if (amount <= 0) throw new Error("Amount must be positive");
  const wallet = await Wallet.findOne({ userId });
  if (!wallet || !wallet.isActive) throw new Error("Wallet not available");
  wallet.balance += amount;
  await wallet.save();

  const txn = await Transaction.create({
    senderId: userId,
    receiverId: userId,
    amount,
    type: "deposit",
    status: "success",
  });
  await createNotification({
    userId,
    title: "Money Added",
    message: `₹${amount} added to your wallet.`,
    type: "transaction",
    relatedId: txn._id,
  });
  return { wallet, transaction: txn };
};

const withdrawMoney = async (userId, amount) => {
  if (amount <= 0) throw new Error("Amount must be positive");
  const wallet = await Wallet.findOne({ userId });
  if (!wallet || !wallet.isActive) throw new Error("Wallet not available");
  if (wallet.balance < amount) throw new Error("Insufficient balance");
  wallet.balance -= amount;
  await wallet.save();

  const txn = await Transaction.create({
    senderId: userId,
    amount,
    type: "withdrawal",
    status: "success",
  });
  await createNotification({
    userId,
    title: "Withdrawal Successful",
    message: `₹${amount} withdrawn from your wallet.`,
    type: "transaction",
    relatedId: txn._id,
  });
  return { wallet, transaction: txn };
};

module.exports = { getWallet, addMoney, withdrawMoney };
