import { getEnumKeys, getEnumValues } from "@/helper/common.helper";
import {
  ActionTaskModelEnum,
  ActionTaskStatus,
} from "@/types/action_task.type";
import { commonFailValidatedMessageFunction } from "@/validate/common.validate";
import Joi from "joi";

export default {
  create: {
    payload: {
      common_type_ids: Joi.array().items(
        Joi.string()
          .required()
          .error(
            commonFailValidatedMessageFunction("Actions/tasks is required")
          )
      ),
      model_id: Joi.string()
        .required()
        .error(commonFailValidatedMessageFunction("Model is missing")),
      model_name: Joi.string()
        //ActionTaskModelEnum
        .valid(...getEnumKeys(ActionTaskModelEnum))
        .required()
        .error(commonFailValidatedMessageFunction("Model name is missing")),
    },
  },
  update: {
    params: {
      id: Joi.string()
        .trim()
        .required()
        .error(commonFailValidatedMessageFunction("Action task is required")),
    },
    payload: {
      status: Joi.number()
        .valid(...getEnumValues(ActionTaskStatus))
        .required()
        .error(commonFailValidatedMessageFunction("Status is required")),
    },
  },
  getList: {
    query: {
      model_id: Joi.string()
        .required()
        .error(commonFailValidatedMessageFunction("Model is missing")),
      model_name: Joi.string()
        //ActionTaskModelEnum
        .valid(...getEnumKeys(ActionTaskModelEnum))

        .required()
        .error(commonFailValidatedMessageFunction("Model name is missing")),
    },
  },
};
