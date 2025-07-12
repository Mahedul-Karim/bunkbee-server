const express = require("express");

const {
  createUser,
  getMe,
  logout,
  googleSignin,
  getUserReviews,
  updateReview,
  deleteReview,
  userTransactions,
} = require("../controller/user");
const { upload } = require("../config/multer");
const { verifyUser } = require("../middleware/auth");

const router = express.Router();

router.route("/").post(upload.single("image"), createUser);
router.route("/me").post(getMe);
router.route("/logout").post(logout);
router.route("/google").post(googleSignin);
router
  .route("/reviews")
  .get(verifyUser, getUserReviews)
  .patch(verifyUser, updateReview)
  .delete(verifyUser, deleteReview);

router.route("/transactions").get(verifyUser, userTransactions);

exports.userRoutes = router;
