import Joi from "joi";
import BaseDto from "../../../common/dto/baseDto.js";

class OAuthCodeDto extends BaseDto {
  static schema = Joi.object({
    code: Joi.string().hex().length(64).required(),
  });
}

export default OAuthCodeDto;
