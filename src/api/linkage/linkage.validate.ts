import { ConfigurationStepType } from "@/types";
import { errorMessage } from "@/validates/common.validate";
import Joi from "joi";

export default {
  upsertLinkages: {
    payload: {
      data: Joi.array()
        .items(
          Joi.object({
            pair: Joi.string(),
            is_pair: Joi.boolean(),
          })
        )
        .required()
        .error(errorMessage("Linkage is required")),
    },
  },
  pair: {
    payload: {
      pair: Joi.string(),
      is_pair: Joi.boolean(),
    },
  },
  getLinkage: {
    params: {
      option_id: Joi.string(),
    },
  },
  upsertStep: {
    payload: {
      data: Joi.array()
        .items(
          Joi.object({
            product_id: Joi.string(),
            specification_id: Joi.string(),
            name: Joi.string(),
            order: Joi.number().min(1),
            options: Joi.array().items({
              id: Joi.string(),
              pre_option: Joi.any(),
              replicate: Joi.number().min(1),
              picked: Joi.boolean().default(false),
            }),
          })
        )
        .required()
        .error(errorMessage("Step is required")),
    },
  },
  upsertConfigurationStep: {
    payload: {
      project_id: Joi.any(),
      product_id: Joi.any(),
      user_id: Joi.any(),
      data: Joi.array()
        .items(
          Joi.object({
            step_id: Joi.string(),
            options: Joi.array().items({
              id: Joi.string(),
              quantity: Joi.number().min(1),
            }),
          })
        )
        .required()
        .error(errorMessage("Step is required")),
    },
  },
  getStep: {
    query: {
      product_id: Joi.string()
        .required()
        .error(errorMessage("Product is required")),
      specification_id: Joi.string()
        .required()
        .error(errorMessage("Specification is required")),
    },
  },
  getConfigurationStep: {
    query: {
      product_id: Joi.string()
        .required()
        .error(errorMessage("Product is required")),
      project_id: Joi.any(),
      specification_id: Joi.string()
        .required()
        .error(errorMessage("Specification is required")),
    },
  },
  getLinkageRestOptions: {
    query: Joi.object({
      option_ids: Joi.string()
        .required()
        .error(errorMessage("Options is required")),
      except_option_ids: Joi.string(),
    }).custom((value, _helper) => {
      return {
        option_ids: value.option_ids.split(","),
        except_option_ids: value.except_option_ids
          ? value.except_option_ids.split(",")
          : undefined,
      };
    }),
  },
};
