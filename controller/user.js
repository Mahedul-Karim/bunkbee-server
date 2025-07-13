const { uploadToCloudinary } = require("../config/cloudinary");
const { Reviews } = require("../model/reviews");
const { User } = require("../model/user");
const { Meals } = require("../model/meals");
const { asyncWrapper } = require("../util/asyncWrapper");
const AppError = require("../util/error");
const { getToken } = require("../util/util");
const { Transactions } = require("../model/transactions");

exports.createUser = asyncWrapper(async (req, res, next) => {
  if (!req.file) {
    return next(new AppError("Profile picture is required"), 400);
  }

  const { fullName, email } = req.body;

  const result = await uploadToCloudinary(req.file);

  const user = await User.create({
    fullName,
    email,
    avatar: result.secure_url,
    avatar_id: result.public_id,
  });

  const token = getToken({ email });

  const cookieOptions = {
    httpOnly: true,
    expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
    // secure:true,
    // sameSite:'none'
  };

  res.cookie("token", token, cookieOptions).status(201).json({
    success: true,
    user,
    token,
    message: "User created successfully!",
  });
});

exports.getMe = asyncWrapper(async (req, res, next) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(200).json({
      success: true,
      user: null,
    });
  }

  const token = getToken({ email });

  const cookieOptions = {
    httpOnly: true,
    expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
    // secure:true,
    // sameSite:'none'
  };

  res.cookie("token", token, cookieOptions).status(200).json({
    success: true,
    user,
    token,
  });
});

exports.logout = asyncWrapper(async (req, res, next) => {
  const cookieOptions = {
    httpOnly: true,
    expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
    // secure:true,
    // sameSite:'none'
  };

  res.clearCookie("token", cookieOptions);

  res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
});

exports.googleSignin = asyncWrapper(async (req, res, next) => {
  const { email, fullName } = req.body;

  const existingUser = await User.findOne({ email });

  const token = getToken({ email });

  const cookieOptions = {
    httpOnly: true,
    expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
    // secure:true,
    // sameSite:'none'
  };

  if (existingUser) {
    return res.cookie("token", token, cookieOptions).status(200).json({
      success: true,
      user: existingUser,
      token,
    });
  }

  const user = await User.create({
    email,
    fullName,
  });

  res.cookie("token", token, cookieOptions).status(201).json({
    success: true,
    user,
    token,
  });
});

exports.getUserReviews = asyncWrapper(async (req, res, next) => {
  const user = req.user;

  const reviews = await Reviews.find({ reviewerId: user._id });

  res.status(200).json({
    success: true,
    reviews,
  });
});

exports.updateReview = asyncWrapper(async (req, res, next) => {
  const { review, rating, reviewId } = req.body;

  await Reviews.findByIdAndUpdate(reviewId, {
    rating,
    review,
  });

  res.status(200).json({
    success: true,
    message: "Review updated successfully",
  });
});

exports.deleteReview = asyncWrapper(async (req, res) => {
  const { reviewId } = req.body;

  const review = await Reviews.findByIdAndDelete(reviewId);

  await Meals.findByIdAndUpdate(review.mealId, {
    $inc: {
      reviews_count: -1,
    },
  });

  res.status(200).json({
    success: true,
    message: "Review deleted successfully",
  });
});

exports.userTransactions = asyncWrapper(async (req, res) => {
  const user = req.user;

  const transactions = await Transactions.find({
    userId: user._id,
  });

  res.status(200).json({
    success: true,
    transactions,
  });
});

exports.getAllUsers = asyncWrapper(async (req, res, next) => {
  const user = req.user;

  if (user.role !== "admin") {
    return next(
      new AppError("You are not eligible to access this resources", 401)
    );
  }

  const { search } = req.query;

  const query = {
    $and: [
      {
        _id: {
          $ne: user._id,
        },
      },
    ],
  };

  if (search) {
    query.$and.push({
      $or: [
        {
          fullName: {
            $regex: search,
            $options: "i",
          },
        },
        {
          email: {
            $regex: search,
            $options: "i",
          },
        },
      ],
    });
  }

  const users = await User.find(query);

  res.status(200).json({
    success: true,
    users,
  });
});

exports.updateUserToRole = asyncWrapper(async (req, res, next) => {
  const user = req.user;

  const { userId } = req.body;

  if (user.role !== "admin") {
    return next(
      new AppError("You are not eligible to access this resources", 401)
    );
  }

  const existingUser = await User.findById(userId);

  if (existingUser.role === "user") {
    existingUser.role = "admin";
  } else {
    existingUser.role = "user";
  }

  await existingUser.save();

  res.status(200).json({
    success: true,
    message: "User role updated successfully",
  });
});
