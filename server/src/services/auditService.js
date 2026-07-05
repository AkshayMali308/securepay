const AuditLog = require("../models/AuditLog");

const createAuditLog = async ({
  actorId,
  actorRole,
  action,
  targetId,
  targetModel,
  details,
  req,
}) => {
  try {
    await AuditLog.create({
      actorId,
      actorRole,
      action,
      targetId,
      targetModel,
      details,
      ipAddress: req?.ip,
      userAgent: req?.headers?.["user-agent"],
    });
  } catch (err) {
    console.error("Audit log creation failed:", err.message);
  }
};

module.exports = { createAuditLog };
