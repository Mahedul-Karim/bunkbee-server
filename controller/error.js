const AppError = require("../util/error");

exports.handleError = (err, req, res, next) => {
  const status = err.status || 500;

  let error = { ...err };

  error.message = err.message;

  if (err.name === "ValidationError") {
    const missingField = Object.keys(err.errors)[0];
    error = new AppError(`${missingField} is required`, 400);
  }

  if (err.name === "CastError") {
    const message = "No query has been found for the provided id";
    error = new AppError(message, 404);
  }

  if (err.code === 11000) {
    const message = `Duplicate ${Object.keys(err.keyValue)}`;
    error = new AppError(message, 400);
  }

   if (err.name === "JsonWebTokenError") {
      const message = "Your token is invalid! Please login again";
      error = new AppError(message, 400);
    }

    if (err.name === "TokenExpired") {
      const message = "Your token has expired! Please login again!";
      error = new AppError(message, 400);
    }

  res.status(status).json({
    success: false,
    message: error.message || "Internel Server error",
    // error: err,
    // stack: err.stack,
  });
};