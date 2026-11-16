import Joi from "joi";
import BaseDto from "../../../common/dto/baseDto.js";

class LoginDto extends BaseDto {
  static schema = Joi.object({
    email: Joi.string().trim().lowercase().email().max(254).required(),
    password: Joi.string().min(1).max(128).required(),
  });
}

export default LoginDto;
