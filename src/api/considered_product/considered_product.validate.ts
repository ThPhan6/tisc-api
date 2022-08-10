import * as Joi from "joi";
import { CONSIDERED_PRODUCT_STATUS } from "../../constant/common.constant";
import { commonFailValidatedMessageFunction } from "../../validate/common.validate";

export default {
  getList: {
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
        zone_order: value.zone_order ? value.zone_order : "ASC",
        area_order: value.area_order ? value.area_order : "ASC",
        room_order: value.room_order ? value.room_order : "ASC",
        brand_order: value.brand_order ? value.brand_order : "ASC",
      };
    }),
  },
  getListAssignedProject: {
    params: {
      project_id: Joi.string()
        .required()
        .error(commonFailValidatedMessageFunction("Project id is required")),
      product_id: Joi.string()
        .required()
        .error(commonFailValidatedMessageFunction("Product id is required")),
    },
  },

  updateConsiderProductStatus: {
    params: {
      id: Joi.string()
        .required()
        .error(
          commonFailValidatedMessageFunction("Consider product id is required")
        ),
      project_id: Joi.string()
        .required()
        .error(commonFailValidatedMessageFunction("Project id is required")),
      product_id: Joi.string()
        .required()
        .error(commonFailValidatedMessageFunction("Product id is required")),
    },
    payload: {
      status: Joi.number()
        .valid(
          CONSIDERED_PRODUCT_STATUS.CONSIDERED,
          CONSIDERED_PRODUCT_STATUS.RE_CONSIDERED,
          CONSIDERED_PRODUCT_STATUS.UNLISTED
        )
        .required()
        .error(commonFailValidatedMessageFunction("Status is required")),
    },
  },
  deleteConsiderProduct: {
    params: {
      id: Joi.string()
        .required()
        .error(
          commonFailValidatedMessageFunction("Consider product id is required")
        ),
      project_id: Joi.string()
        .required()
        .error(commonFailValidatedMessageFunction("Project id is required")),
      product_id: Joi.string()
        .required()
        .error(commonFailValidatedMessageFunction("Product id is required")),
    },
  },
};
