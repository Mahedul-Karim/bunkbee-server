const { Meals } = require("../model/meals");
const { asyncWrapper } = require("../util/asyncWrapper");
const { uploadToCloudinary } = require("../config/cloudinary");
const AppError = require("../util/error");

exports.addMeal = asyncWrapper(async (req, res, next) => {
  if (!req.file) {
    return next(new AppError("Meal image is required"));
  }

  const user = req.user;

  if (user.role !== "admin") {
    return next(new AppError("Only admins can add meal", 401));
  }

  const { title, category, ingredients, description, price, status } = req.body;

  const result = await uploadToCloudinary(req.file);

  const meal = await Meals.create({
    title,
    category,
    image: result.secure_url,
    image_id: result.public_id,
    ingredients,
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
    meal,
  });
});
