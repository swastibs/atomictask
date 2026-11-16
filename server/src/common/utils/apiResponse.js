class ApiResponse {
  static ok(res, message, data, fields = {}) {
    return this.send(res, 200, message, data, fields);
  }

  static created(res, message, data, fields = {}) {
    return this.send(res, 201, message, data, fields);
  }

  static send(res, statusCode, message, data, fields) {
    return res.status(statusCode).json({
      ...fields,
      success: true,
      message,
      ...(data === undefined ? {} : { data }),
    });
  }
}

export default ApiResponse;
