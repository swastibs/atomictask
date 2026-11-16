import Joi from "joi";
import BaseDto from "../../../common/dto/baseDto.js";

class EmailDto extends BaseDto {
  static schema = Joi.object({
    email: Joi.string().trim().lowercase().email().max(254).required(),
  });
}

export default EmailDto;
