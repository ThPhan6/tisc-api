import Joi from "joi";
import { commonFailValidatedMessageFunction } from "../../validate/common.validate";
export default {
  paramProjectId: {
    params: {
      project_id: Joi.string()
        .required()
        .error(
          commonFailValidatedMessageFunction("Project ID is required")
        ),
    },
  },
};
