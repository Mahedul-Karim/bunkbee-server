const { asyncWrapper } = require("../util/asyncWrapper");
const AppError = require("../util/error");
const jwt = require("jsonwebtoken");
const { User } = require("../model/user");

exports.verifyUser = asyncWrapper(async (req, res, next) => {
  const token = req.cookies?.token
    ? req.cookies?.token
    : req.header("Authorization")?.split(" ")[1];

  if (!token) {
    return next(
      new AppError("No token has been found! Please login again", 401)
    );
  }

  const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

  const user = await User.findOne({ email: decodedToken.email });

  req.user = user;

  next();
});
