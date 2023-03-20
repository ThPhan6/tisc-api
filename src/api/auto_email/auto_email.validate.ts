import { TOPIC_TYPES, TARGETED_FOR_TYPES } from "@/constants";
import * as Joi from "joi";
import {
  errorMessage,
  requireStringValidation,
} from "@/validates/common.validate";

export default {
  update: {
    params: { id: requireStringValidation("Email autoresponders id") },
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
        .error(errorMessage("Topic type is required")),
      targeted_for: Joi.number()
        .valid(
          TARGETED_FOR_TYPES.TISC_TEAM,
          TARGETED_FOR_TYPES.BRAND,
          TARGETED_FOR_TYPES.DESIGN_FIRM,
          TARGETED_FOR_TYPES.DISTRIBUTOR,
          TARGETED_FOR_TYPES.GENERAL
        )
        .required()
        .error(errorMessage("Targeted for type is required")),
      title: requireStringValidation("Title"),
      message: requireStringValidation("Message"),
    },
  },
};
