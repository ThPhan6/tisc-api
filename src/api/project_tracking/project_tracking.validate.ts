import { commonFailValidatedMessageFunction } from "@/validate/common.validate";
import * as Joi from "joi";

const requiredProductId = Joi.string()
  .required()
  .error(commonFailValidatedMessageFunction("Product id is required"));
const requiredProjectId = Joi.string()
  .required()
  .error(commonFailValidatedMessageFunction("Project id is required"));

export default {
  createProjectRequest: {
    payload: {
      product_id: requiredProductId,
      project_id: requiredProjectId,
      title: Joi.string()
        .required()
        .error(commonFailValidatedMessageFunction("Title is required")),
      message: Joi.string()
        .required()
        .error(commonFailValidatedMessageFunction("Message is required")),
      request_for_ids: Joi.array()
        .items(Joi.string())
        .required()
        .error(commonFailValidatedMessageFunction("Request for is required")),
    },
  },
};
