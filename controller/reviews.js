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

  const avg = averageRating?.[0]?.avgRating || 0;

  const meal = await Meals.findById(mealId);

  meal.rating = avg;
  meal.reviews_count =
    typeof meal.reviews_count === "number"
      ? meal.reviews_count + 1
      : Number(meal.reviews_count) + 1;

  await meal.save();

  res.status(200).json({
    success: true,
    message: "Your review has been posted successfully",
  });
});
