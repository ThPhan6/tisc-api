import { commonFailValidatedMessageFunction } from "@/validate/common.validate";
import * as Joi from "joi";

export default {
  assignProductToProject: {
    payload: {
      entire_allocation: Joi.boolean(),
      product_id: Joi.string()
        .required()
        .error(commonFailValidatedMessageFunction("Product id is required")),
      project_id: Joi.string()
        .required()
        .error(commonFailValidatedMessageFunction("Project id is required")),
      allocation: Joi.array().items(Joi.string()),
    },
  },
  getProjectAssignZoneByProduct: {
    params: {
      project_id: Joi.string()
        .required()
        .error(commonFailValidatedMessageFunction("Project id is required")),
      product_id: Joi.string()
        .required()
        .error(commonFailValidatedMessageFunction("Product id is required")),
    },
  },
  getConsideredProducts: {
    params: {
      project_id: Joi.string()
        .required()
        .error(commonFailValidatedMessageFunction("Project id is required")),
    },
    query: Joi.object({
      zone_order: Joi.string().valid("ASC", "DESC"),
      area_order: Joi.string().valid("ASC", "DESC"),
      room_order: Joi.string().valid("ASC", "DESC"),
      brand_order: Joi.string().valid("ASC", "DESC"),
    }).custom((value) => {
      return {
        zone_order: value.zone_order ?? "ASC",
        area_order: value.area_order ?? "ASC",
        room_order: value.room_order ?? "ASC",
        brand_order: value.brand_order ?? "ASC",
      };
    }),
  },
};
