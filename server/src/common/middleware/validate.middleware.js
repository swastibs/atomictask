import ApiError from "../utils/apiError.js";

const validate = (DtoClass) => (req, _res, next) => {
  const { errors, value } = DtoClass.validate(req.body);

  if (errors) {
    return next(ApiError.badRequest("Validation failed", errors));
  }

  req.body = value;
  return next();
};

export default validate;
