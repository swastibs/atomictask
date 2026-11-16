import Joi from "joi";
import BaseDto from "../../../common/dto/baseDto.js";

class TokenDto extends BaseDto {
  static schema = Joi.object({
    token: Joi.string().hex().length(64).required(),
  });
}

export default TokenDto;
