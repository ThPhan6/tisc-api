import { getEnumKeys } from "@/helper/common.helper";
import { ActionTaskModel, ActionTaskStatus } from "@/types/action_task.type";
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
        //ActionTaskModel
        .valid(...getEnumKeys(ActionTaskModel))
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
        .valid(
          ActionTaskStatus.To_do_list,
          ActionTaskStatus.In_progress,
          ActionTaskStatus.Canceled,
          ActionTaskStatus.Completed
        )
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
        //ActionTaskModel
        .valid(...getEnumKeys(ActionTaskModel))

        .required()
        .error(commonFailValidatedMessageFunction("Model name is missing")),
    },
  },
};
