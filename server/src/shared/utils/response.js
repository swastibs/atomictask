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

  // 🔍 Log success response before sending
  const req = res.req; // Express attaches the request object to the response
  console.log("----- SUCCESS RESPONSE -----");
  console.log(JSON.stringify(response, null, 2));

  return res.status(statusCode).json(response);
};

export const errorResponse = (res, statusCode, message, errors = null) => {
  const response = {
    success: false,
    message,
  };
  if (errors) response.errors = errors;

  const req = res.req;
  console.log("----- ERROR RESPONSE -----");
  console.log(JSON.stringify(response, null, 2));

  return res.status(statusCode).json(response);
};
