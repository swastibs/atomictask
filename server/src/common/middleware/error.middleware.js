import ApiError from "../utils/apiError.js";

const errorHandler = (error, _req, res, next) => {
  if (res.headersSent) {
    return next(error);
  }

  const statusCode = error instanceof ApiError ? error.statusCode : 500;
  const message =
    error instanceof ApiError ? error.message : "Internal server error";

  if (statusCode === 500) {
    console.error(error);
  }

  return res.status(statusCode).json({
    success: false,
    message,
    ...(error instanceof ApiError && error.errors
      ? { errors: error.errors }
      : {}),
  });
};

export default errorHandler;
