import ApiError from "../utils/apiError.js";

const errorHandler = (error, _req, res, next) => {
  if (res.headersSent) {
    return next(error);
  }

  const isClientError =
    Number.isInteger(error.status) && error.status >= 400 && error.status < 500;
  const statusCode = error instanceof ApiError
    ? error.statusCode
    : isClientError
      ? error.status
      : 500;
  let message = "Internal server error";
  if (error instanceof ApiError) {
    message = error.message;
  } else if (error.type === "entity.too.large") {
    message = "Request body is too large.";
  } else if (statusCode === 400) {
    message = "Invalid request body.";
  }

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
