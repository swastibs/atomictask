import { nodeEnv } from "../../config/envConfig.js";

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

  // 🔍 Log success response only in development
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

  // You may also want to log errors only in development,
  // or keep error logs in all environments (recommended).
  // Uncomment the condition if you want the same behavior.
  //
  // if (nodeEnv === "development") {
  //   console.log("----- ERROR RESPONSE -----");
  //   console.log(JSON.stringify(response, null, 2));
  // }

  // For now, error logs remain always visible (as before)
  console.log("----- ERROR RESPONSE -----");
  console.log(JSON.stringify(response, null, 2));

  return res.status(statusCode).json(response);
};
