import * as Joi from "joi";
import { commonFailValidatedMessageFunction } from "../../validate/common.validate";

export default {
  create: {
    payload: {
      project_id: Joi.string()
        .trim()
        .required()
        .error(commonFailValidatedMessageFunction("Project is required")),
      name: Joi.string()
        .trim()
        .required()
        .error(commonFailValidatedMessageFunction("Zone is required")),
      area: Joi.array().items(
        Joi.object({
          name: Joi.string().trim(),
          room: Joi.array().items(
            Joi.object({
              room_name: Joi.string().trim(),
              room_id: Joi.string().trim(),
              room_size: Joi.number(),
              quantity: Joi.number(),
            })
          ),
        })
      ),
    },
  },
};
