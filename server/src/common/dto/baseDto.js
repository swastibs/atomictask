import Joi from "joi";

class BaseDto {
  static schema = Joi.object({});

  static validate(data) {
    const { error, value } = this.schema.validate(data, {
      abortEarly: false,
      stripUnknown: true,
    });

    return {
      errors: error?.details.map((detail) => detail.message) ?? null,
      value: error ? null : value,
    };
  }
}

export default BaseDto;
