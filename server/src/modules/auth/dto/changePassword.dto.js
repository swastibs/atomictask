import Joi from "joi";
import BaseDto from "../../../common/dto/baseDto.js";
import passwordSchema from "./password.schema.js";

class ChangePasswordDto extends BaseDto {
  static schema = Joi.object({
    currentPassword: Joi.string()
      .min(1)
      .custom((value, helpers) =>
        Buffer.byteLength(value, "utf8") <= 72
          ? value
          : helpers.error("string.max", { limit: 72 }),
      )
      .required(),
    newPassword: passwordSchema
      .invalid(Joi.ref("currentPassword"))
      .required(),
  });
}

export default ChangePasswordDto;
