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
            order: Joi.number(),
            options: Joi.array().items({
              id: Joi.string(),
              quantity: Joi.number(),
            }),
          })
        )
        .required()
        .error(errorMessage("Step is required")),
    },
  },
  getStep: {
    query: {
      product_id: Joi.string(),
      specification_id: Joi.string(),
    },
  },
  getLinkageRestOptions: {
    query: Joi.object({
      option_ids: Joi.string(),
      except_option_ids: Joi.string(),
    }).custom((value, _helper) => {
      return {
        option_ids: value.option_ids.split(","),
        except_option_ids: value.except_option_ids.split(","),
      };
    }),
  },
};
