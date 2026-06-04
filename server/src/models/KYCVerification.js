const mongoose = require("mongoose");

const kycSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    panNumber: { type: String, default: "" },
    aadhaarLast4: { type: String, default: "" },
    dob: { type: Date },
    status: {
      type: String,
      enum: ["not_submitted", "pending", "verified", "rejected"],
      default: "not_submitted",
    },
    rejectionReason: { type: String, default: "" },
    verifiedAt: { type: Date },
    verifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("KYCVerification", kycSchema);
