const { Meals } = require("../model/meals");
const { asyncWrapper } = require("../util/asyncWrapper");
const AppError = require("../util/error");

exports.addMeal = asyncWrapper(async (req, res, next) => {
  const user = req.user;

  if (user.role !== "admin") {
    return next(new AppError("Only admins can add meal", 401));
  }

  const { title, category, image, ingredients, description, price, status } =
    req.body;

  await Meals.create({
    title,
    category,
    image,
    ingredient,
    description,
    price,
    status,
    distributor_name: user.fullName,
    distributor_email: user.email,
    distributor_avatar: user.avatar,
  });

  res.status(201).json({
    success: true,
    message: "Meals created successfully",
  });
});
