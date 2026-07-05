const router = require("express").Router();
const ctrl = require("../controllers/userController");
const { protect } = require("../middlewares/authMiddleware");

router.use(protect);
router.get("/me", ctrl.getMe);
router.put("/me", ctrl.updateMe);
router.put("/me/kyc", ctrl.updateKYC);
router.get("/search", ctrl.searchUsers);

module.exports = router;
