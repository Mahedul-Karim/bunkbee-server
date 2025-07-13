const express = require("express");

const { verifyUser } = require("../middleware/auth");
const {
  createReview,
  getAllReviews,
  deleteReview,
} = require("../controller/reviews");

const router = express.Router();

router
  .route("/")
  .post(verifyUser, createReview)
  .get(verifyUser, getAllReviews)
  .delete(verifyUser, deleteReview);

exports.reviewRoutes = router;
