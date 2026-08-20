import { nodeEnv } from "../config/envConfig.js";

export const successResponse = (res, options = {}) => {
  const {
    statusCode = 200,
    message = "Success",
    data = null,
    ...extra
  } = options;

  const response = {
    success: true,
    message,
    ...extra,
  };

  if (data !== null && data !== undefined) response.data = data;

  if (nodeEnv === "development") {
    console.log("----- SUCCESS RESPONSE -----");
    console.log(JSON.stringify(response, null, 2));
  }

  return res.status(statusCode).json(response);
};

export const errorResponse = (res, statusCode, message, errors = null) => {
  const response = {
    success: false,
    message,
  };
  if (errors) response.errors = errors;

  console.log("----- ERROR RESPONSE -----");
  console.log(JSON.stringify(response, null, 2));

  return res.status(statusCode).json(response);
};
