const mongoose = require("mongoose");

const walletSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    balance: { type: Number, default: 0, min: 0 },
    accountNumber: { type: String, unique: true },
    currency: { type: String, default: "INR" },
    dailyTransferLimit: { type: Number, default: 50000 },
    dailyTransferUsed: { type: Number, default: 0 },
    lastResetDate: { type: Date, default: Date.now },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

walletSchema.pre("save", function (next) {
  if (!this.accountNumber) {
    this.accountNumber = Math.floor(1000000000 + Math.random() * 9000000000).toString();
  }
  next();
});

walletSchema.methods.resetDailyLimitIfNeeded = function () {
  const today = new Date().setHours(0, 0, 0, 0);
  const lastReset = new Date(this.lastResetDate).setHours(0, 0, 0, 0);
  if (today > lastReset) {
    this.dailyTransferUsed = 0;
    this.lastResetDate = new Date();
  }
};

module.exports = mongoose.model("Wallet", walletSchema);
