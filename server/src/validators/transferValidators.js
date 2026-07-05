const { body } = require("express-validator");

const transferValidator = [
  body("receiverIdentifier")
    .trim()
    .notEmpty()
    .withMessage("Receiver identifier is required"),
  body("amount")
    .isFloat({ min: 1 })
    .withMessage("Amount must be at least ₹1"),
  body("note").optional().trim().isLength({ max: 200 }),
];

module.exports = { transferValidator };
