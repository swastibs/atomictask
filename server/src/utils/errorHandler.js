import { ValidationError } from "express-validation";
import ApiError from "./ApiError.js";
import { errorResponse } from "./response.js";

export const globalErrorHandler = (err, req, res, next) => {
  console.error("ERROR:", err);

  if (err instanceof ValidationError) {
    const allMessages = Object.values(err.details || {})
      .flat()
      .map((e) => e.message);

    const message = allMessages.length
      ? allMessages.join(", ")
      : "Validation failed";

    return errorResponse(res, 400, message, err.details);
  }

  if (err.type === "entity.parse.failed") {
    return errorResponse(res, 400, "Invalid JSON payload");
  }

  if (err.code === 11000) {
    const field = err.keyValue ? Object.keys(err.keyValue)[0] : "field";
    const message = `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`;
    return errorResponse(res, 409, message);
  }

  if (err.name === "ValidationError") {
    const message = Object.values(err.errors)
      .map((e) => e.message)
      .join(", ");
    return errorResponse(res, 400, message, err.errors);
  }

  if (err.name === "CastError") {
    return errorResponse(res, 400, "Invalid ID format");
  }

  if (err instanceof ApiError) {
    return errorResponse(res, err.statusCode, err.message, err.errors);
  }

  return errorResponse(res, 500, "Internal server error");
};
