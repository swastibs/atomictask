import Joi from "joi";
import BaseDto from "../../../common/dto/baseDto.js";

class UpdateProfileDto extends BaseDto {
  static schema = Joi.object({
    name: Joi.string().trim().min(2).max(80),
  }).min(1);
}

export default UpdateProfileDto;
