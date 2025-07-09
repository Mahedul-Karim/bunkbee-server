const { User } = require("../model/user");
const { asyncWrapper } = require("../util/asyncWrapper");
const AppError = require("../util/error");
const { getToken } = require("../util/util");

exports.createUser = asyncWrapper(async (req, res, next) => {
  const { fullName, email, avatar } = req.body;

  const user = await User.create({ fullName, email, avatar });

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

  res.cookie("token", token, cookieOptions).status(201).json({
    success: true,
    user,
    token,
  });
});
