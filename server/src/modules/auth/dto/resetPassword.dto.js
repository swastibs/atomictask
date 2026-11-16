import Joi from "joi";
import BaseDto from "../../../common/dto/baseDto.js";
import passwordSchema from "./password.schema.js";

class ResetPasswordDto extends BaseDto {
  static schema = Joi.object({
    token: Joi.string().hex().length(64).required(),
    password: passwordSchema.required(),
  });
}

export default ResetPasswordDto;
