import Joi from "joi";

const passwordSchema = Joi.string()
  .min(12)
  .custom((value, helpers) =>
    Buffer.byteLength(value, "utf8") <= 72
      ? value
      : helpers.error("string.max", { limit: 72 }),
  );

export default passwordSchema;
