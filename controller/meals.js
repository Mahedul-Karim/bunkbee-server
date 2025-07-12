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

exports.getAllMeals = asyncWrapper(async (req, res, next) => {
  const { search, category, price, page } = req.query;

  const limit = 10;

  const query = {};

  if (search) {
    query.$text = {
      $search: search,
    };
  }

  if (category && category !== "all") {
    query.category = {
      $regex: category,
      $options: "i",
    };
  }

  if (price) {
    const splittedPrice = price?.split("-");

    const minPrice = Number(splittedPrice?.at(0));
    const maxPrice = Number(splittedPrice?.at(1));

    query.price = {
      $gte: minPrice,
      $lte: maxPrice,
    };
  }

  const meals = await Meals.find(query)
    .skip((page - 1) * limit)
    .limit(limit + 1);

  const hasMore = meals?.length > limit;

  if (hasMore) {
    meals.pop();
  }

  return res.status(200).json({
    success: true,
    meals,
    hasMore,
  });
});
