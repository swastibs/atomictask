import { nodeEnv } from "../config/envConfig.js";

const debugResponses = process.env.DEBUG_API_RESPONSES === "true";

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

  if (nodeEnv === "development" && debugResponses) {
    console.log("----- SUCCESS RESPONSE -----", {
      statusCode,
      message,
      hasData: data !== null && data !== undefined,
    });
  }

  return res.status(statusCode).json(response);
};

export const errorResponse = (res, statusCode, message, errors = null) => {
  const response = {
    success: false,
    message,
  };
  if (errors) response.errors = errors;

  if (nodeEnv === "development" && debugResponses) {
    console.log("----- ERROR RESPONSE -----", { statusCode, message });
  }

  return res.status(statusCode).json(response);
};
