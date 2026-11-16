import Joi from "joi";
import BaseDto from "../../../common/dto/baseDto.js";
import passwordSchema from "./password.schema.js";

class RegisterDto extends BaseDto {
  static schema = Joi.object({
    name: Joi.string().trim().min(2).max(80).required(),
    email: Joi.string().trim().lowercase().email().max(254).required(),
    password: passwordSchema.required(),
  });
}

export default RegisterDto;
