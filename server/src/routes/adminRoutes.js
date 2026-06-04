const router = require("express").Router();
const ctrl = require("../controllers/adminController");
const { protect } = require("../middlewares/authMiddleware");
const { restrictTo } = require("../middlewares/roleMiddleware");

router.use(protect, restrictTo("admin"));
router.get("/users", ctrl.getAllUsers);
router.patch("/users/:id/freeze", ctrl.freezeUser);
router.patch("/users/:id/unfreeze", ctrl.unfreezeUser);
router.patch("/kyc/:id/verify", ctrl.verifyKYC);
router.get("/transactions", ctrl.getAllTransactions);
router.patch("/transactions/:id/flag", ctrl.flagTransaction);
router.get("/analytics", ctrl.getAnalytics);

module.exports = router;
