const { Meals } = require("../model/meals");
const { Reviews } = require("../model/reviews");
const { asyncWrapper } = require("../util/asyncWrapper");
const {
  uploadToCloudinary,
  deleteFromCloudinary,
} = require("../config/cloudinary");
const AppError = require("../util/error");
const { Requestes } = require("../model/requestedMeals");
const { Transactions } = require("../model/transactions");
const { User } = require("../model/user");
const { UpcomingMeals } = require("../model/upcomingMeals");

exports.addMeal = asyncWrapper(async (req, res, next) => {
  if (!req.file) {
    return next(new AppError("Meal image is required"));
  }

  const user = req.user;

  if (user.role !== "admin") {
    return next(new AppError("Only admins can add meal", 401));
  }

  const { title, category, ingredients, description, price } = req.body;

  const result = await uploadToCloudinary(req.file);

  const meal = await Meals.create({
    title,
    category,
    image: result.secure_url,
    image_id: result.public_id,
    ingredients,
    description,
    price,
    distributor_name: user.fullName,
    distributor_email: user.email,
    distributor_avatar: user.avatar,
  });

  await User.findByIdAndUpdate(user._id, {
    $inc: {
      mealsAdded: 1,
    },
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
    .limit(limit + 1)
    .sort({ postTime: -1 });

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

exports.getSingleMeals = asyncWrapper(async (req, res, next) => {
  const { mealId } = req.params;

  const meal = await Meals.findById(mealId);
  const reviews = await Reviews.find({ mealId });

  res.status(200).json({
    success: true,
    meal,
    reviews,
  });
});

exports.likeMeals = asyncWrapper(async (req, res, next) => {
  const { id } = req.body;

  const meal = await Meals.findByIdAndUpdate(
    id,
    {
      $inc: {
        likes: 1,
      },
    },
    {
      new: true,
    }
  );

  return res.status(200).json({
    success: true,
  });
});

exports.requestMeals = asyncWrapper(async (req, res, next) => {
  const user = req.user;

  const { title, category, image, likes, reviews_count, price } = req.body;

  const requestePromise = Requestes.create({
    title,
    category,
    image,
    requesterName: user.fullName,
    requesterAvatar: user?.avatar,
    requesterEmail: user?.email,
    likes,
    reviews_count,
    price,
    requesterId: user._id,
  });

  const transactionPromise = Transactions.create({
    title,
    type: "meal",
    category,
    price,
    userId: user._id,
  });

  await Promise.all([requestePromise, transactionPromise]);

  res.status(201).json({
    success: true,
    message: "Your meal request was posted successfully",
  });
});

exports.getUserRequestedMeals = asyncWrapper(async (req, res) => {
  const user = req.user;

  const meals = await Requestes.find({ requesterId: user._id });

  res.status(200).json({
    success: true,
    meals,
  });
});

exports.deleteRequestedMeal = asyncWrapper(async (req, res) => {
  const { mealId } = req.body;

  await Requestes.findByIdAndDelete(mealId);

  res.status(200).json({
    success: true,
    message: "The requested meal has been deleted successfully",
  });
});

exports.adminAllMeals = asyncWrapper(async (req, res, next) => {
  const user = req.user;

  const { sortBy } = req.query;

  const sortObject = {};

  if (sortBy === "likes") {
    sortObject.likes = -1;
  } else if (sortBy === "reviews_count") {
    sortObject.reviews_count = -1;
  } else {
    sortObject.postTime = -1;
  }

  const meals = await Meals.find({
    distributor_email: {
      $regex: user.email,
      $options: "i",
    },
  }).sort(sortObject);

  res.status(200).json({
    success: true,
    meals,
  });
});

exports.updateMeals = asyncWrapper(async (req, res, next) => {
  const { mealId } = req.params;

  const data = { ...req.body };

  if (req.file) {
    if (data.image_id) {
      await deleteFromCloudinary(data.image_id);
    }

    const result = await uploadToCloudinary(req.file);

    data.image = result.secure_url;
    data.image_id = result.public_id;
  }

  await Meals.findByIdAndUpdate(mealId, data);

  res.status(200).json({
    success: true,
    message: "Meal updated successfully",
  });
});

exports.deleteMeal = asyncWrapper(async (req, res, next) => {
  const { mealId } = req.params;

  const meal = await Meals.findByIdAndDelete(mealId);

  if (meal.image_id) {
    await deleteFromCloudinary(meal.image_id);
  }

  if (!meal) {
    return next(new AppError("No meal found", 404));
  }

  if (meal.reviews_count > 0) {
    await Reviews.deleteMany({ mealId });
  }

  res.status(200).json({
    success: true,
    message: "Meal delete successfully",
  });
});

exports.allRequestedMeals = asyncWrapper(async (req, res, next) => {
  const { search } = req.query;

  const query = {};

  if (search) {
    query.$or = [
      {
        requesterName: {
          $regex: search,
          $options: "i",
        },
      },
      {
        requesterEmail: {
          $regex: search,
          $options: "i",
        },
      },
    ];
  }

  const requestedMeals = await Requestes.find(query);

  res.status(200).json({
    success: true,
    requestedMeals,
  });
});

exports.updateRequestedMeals = asyncWrapper(async (req, res, next) => {
  const { mealId } = req.body;

  await Requestes.findByIdAndUpdate(mealId, {
    status: "delivered",
  });

  res.status(200).json({
    success: true,
    message: "Meal has been served",
  });
});

exports.addUpcomingMeal = asyncWrapper(async (req, res, next) => {
  if (!req.file) {
    return next(new AppError("Meal image is required"));
  }

  const user = req.user;

  if (user.role !== "admin") {
    return next(new AppError("Only admins can add meal", 401));
  }

  const { title, category, ingredients, description, price } = req.body;

  const result = await uploadToCloudinary(req.file);

  const meal = await UpcomingMeals.create({
    title,
    category,
    image: result.secure_url,
    image_id: result.public_id,
    ingredients,
    description,
    price,
    distributor_name: user.fullName,
    distributor_email: user.email,
    distributor_avatar: user.avatar,
  });

  res.status(201).json({
    success: true,
    message: "Upcoming Meals created successfully",
  });
});

exports.getUpcomingMeals = asyncWrapper(async (req, res) => {
  const meals = await UpcomingMeals.find().sort({
    likes: -1,
  });

  res.status(200).json({
    success: true,
    meals,
  });
});

exports.updateUpcomingMeals = asyncWrapper(async (req, res, next) => {
  const { mealId } = req.body;

  const meal = await UpcomingMeals.findById(mealId);

  if (!meal) {
    return next(new AppError("No upcoming meals found!", 404));
  }

  await Meals.create(meal.toObject());

  await UpcomingMeals.findByIdAndDelete(mealId);

  res.status(200).json({
    success: true,
    message: "Meal published successfully",
  });
});

exports.manageUpcomingMealsLikes = asyncWrapper(async (req, res, next) => {
  const user = req.user;

  const { mealId } = req.body;

  const upcomingMeal = await UpcomingMeals.findById(mealId);

  if (!upcomingMeal) {
    return next(new AppError("No meal found!", 404));
  }

  const userAlreadyLiked = upcomingMeal.likedBy.includes(user._id);

  if (userAlreadyLiked) {
    upcomingMeal.likes = upcomingMeal.likes - 1;
    upcomingMeal.likedBy = upcomingMeal.likedBy.filter(
      (id) => id?.toString() !== user._id?.toString()
    );

    await upcomingMeal.save();

    return res.status(200).json({
      success: true,
    });
  }

  upcomingMeal.likes = upcomingMeal.likes + 1;
  upcomingMeal.likedBy.push(user._id);
  await upcomingMeal.save();

  if (upcomingMeal.likes === 10) {
    const mealObject = upcomingMeal.toObject();

    await Meals.create(mealObject);
    await UpcomingMeals.findByIdAndDelete(mealId);

    return res.status(200).json({
      success: true,
      message: "This meal has been published",
    });
  }

  res.status(200).json({
    success: true,
  });
});
