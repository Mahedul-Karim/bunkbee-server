const { uploadToCloudinary } = require("../config/cloudinary");
const { User } = require("../model/user");
const { asyncWrapper } = require("../util/asyncWrapper");
const AppError = require("../util/error");
const { getToken } = require("../util/util");

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
