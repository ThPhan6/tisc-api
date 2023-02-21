import { getEnumKeys, getEnumValues } from "@/helpers/common.helper";
import { ActionTaskModelEnum, ActionTaskStatus } from "@/types";
import {
  errorMessage,
  requireStringValidation,
} from "@/validates/common.validate";
import Joi from "joi";

export default {
  create: {
    payload: {
      common_type_ids: Joi.array().items(
        requireStringValidation("Actions/tasks")
      ),
      model_id: requireStringValidation("Model"),
      model_name: Joi.string()
        .valid(...getEnumKeys(ActionTaskModelEnum))
        .required()
        .error(errorMessage("Model name is required")),
    },
  },
  update: {
    params: {
      id: requireStringValidation("Action task"),
    },
    payload: {
      status: Joi.number()
        .valid(...getEnumValues(ActionTaskStatus))
        .required()
        .error(errorMessage("Status is required")),
    },
  },
  getList: {
    query: {
      model_id: requireStringValidation("Model"),
      model_name: Joi.string()
        .valid(...getEnumKeys(ActionTaskModelEnum))
        .required()
        .error(errorMessage("Model name is required")),
    },
  },
};
