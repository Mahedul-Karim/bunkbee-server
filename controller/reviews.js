const { Meals } = require("../model/meals");
const { asyncWrapper } = require("../util/asyncWrapper");
const AppError = require("../util/error");
const { Reviews } = require("../model/reviews");

exports.createReview = asyncWrapper(async (req, res, next) => {
  const user = req.user;

  const { title, likes, rating, reviews_count, review, mealId } = req.body;

  await Reviews.create({
    title,
    likes,
    rating,
    reviews_count,
    review,
    mealId,
    reviewerName: user.fullName,
    reviewerAvatar: user.avatar,
    reviewerEmail: user.email,
    reviewerId: user._id,
  });

  const averageRating = await Reviews.aggregate([
    {
      $match: { mealId },
    },
    {
      $group: {
        _id: null,
        avgRating: {
          $avg: "$rating",
        },
      },
    },
  ]);

  const avg = averageRating?.[0]?.avgRating;

  const meal = await Meals.findByIdAndUpdate(mealId, {
    rating: avg ? Number(avg?.toFixed(1)) : 0,
    $inc: {
      reviews_count: 1,
    },
  });

  res.status(200).json({
    success: true,
    message: "Your review has been posted successfully",
  });
});

exports.getAllReviews = asyncWrapper(async (req, res) => {
  const reviews = await Reviews.find();

  res.status(200).json({
    success: true,
    reviews,
  });
});

exports.deleteReview = asyncWrapper(async (req, res) => {
  const { reviewId } = req.body;

  await Reviews.findByIdAndDelete(reviewId);

  res.status(200).json({
    success: true,
    message: "Review deleted successfully",
  });
});
