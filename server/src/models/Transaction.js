const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    referenceId: {
      type: String,
      unique: true,
      default: () => `TXN${Date.now()}${Math.random().toString(36).substr(2, 5).toUpperCase()}`,
    },
    senderId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    receiverId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    amount: { type: Number, required: true, min: 1 },
    fee: { type: Number, default: 0 },
    type: { type: String, enum: ["transfer", "deposit", "withdrawal"], required: true },
    status: { type: String, enum: ["pending", "success", "failed"], default: "pending" },
    failureReason: { type: String, default: "" },
    note: { type: String, default: "" },
    flagged: { type: Boolean, default: false },
    flagReason: { type: String, default: "" },
    metadata: { type: mongoose.Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
);

transactionSchema.index({ senderId: 1, createdAt: -1 });
transactionSchema.index({ receiverId: 1, createdAt: -1 });
transactionSchema.index({ referenceId: 1 });

module.exports = mongoose.model("Transaction", transactionSchema);
