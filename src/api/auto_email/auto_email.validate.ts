import {
  TOPIC_TYPES,
  TARGETED_FOR_TYPES,
} from "../../constant/common.constant";
import * as Joi from "joi";
import { commonFailValidatedMessageFunction } from "../../validate/common.validate";

export default {
  update: {
    params: {
      id: Joi.string()
        .required()
        .error(
          commonFailValidatedMessageFunction(
            "Email autoresponders id is required"
          )
        ),
    },
    payload: {
      topic: Joi.number()
        .valid(
          TOPIC_TYPES.MARKETING,
          TOPIC_TYPES.MESSAGES,
          TOPIC_TYPES.ONBOARD,
          TOPIC_TYPES.OPERATION,
          TOPIC_TYPES.OTHER
        )
        .required()
        .error(commonFailValidatedMessageFunction("Topic type is required")),
      targeted_for: Joi.number()
        .valid(
          TARGETED_FOR_TYPES.TISC_TEAM,
          TARGETED_FOR_TYPES.BRAND,
          TARGETED_FOR_TYPES.DESIGN_FIRM,
          TARGETED_FOR_TYPES.DISTRIBUTOR,
          TARGETED_FOR_TYPES.GENERAL
        )
        .required()
        .error(
          commonFailValidatedMessageFunction("Targeted for type is required")
        ),
      title: Joi.string()
        .trim()
        .required()
        .error(commonFailValidatedMessageFunction("Title is required")),
      message: Joi.string()
        .required()
        .error(commonFailValidatedMessageFunction("Message is required")),
    },
  },
};
