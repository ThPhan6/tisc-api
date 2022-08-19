import * as Joi from "joi";
import {
  ORDER_METHOD,
  SPECIFIED_PRODUCT_STATUS,
} from "../../constant/common.constant";
import { commonFailValidatedMessageFunction } from "../../validate/common.validate";

export default {
  getOne: {
    params: {
      considered_product_id: Joi.string()
        .required()
        .error(
          commonFailValidatedMessageFunction("Considered Product is required")
        ),
    },
  },
  getListByBrand: {
    params: {
      project_id: Joi.string()
        .required()
        .error(commonFailValidatedMessageFunction("Project is required")),
    },
    query: Joi.object({
      brand_order: Joi.string().valid("ASC", "DESC"),
    }).custom((value) => {
      return {
        brand_order: value.brand_order ? value.brand_order : "ASC",
      };
    }),
  },
  getListByMaterial: {
    params: {
      project_id: Joi.string()
        .required()
        .error(commonFailValidatedMessageFunction("Project is required")),
    },
    query: Joi.object({
      brand_order: Joi.string().valid("ASC", "DESC"),
      material_order: Joi.string().valid("ASC", "DESC"),
    }).custom((value) => {
      return {
        brand_order: value.brand_order ? value.brand_order : undefined,
        material_order: value.material_order ? value.material_order : undefined,
      };
    }),
  },
  getListByZone: {
    params: {
      project_id: Joi.string()
        .required()
        .error(commonFailValidatedMessageFunction("Project is required")),
    },
    query: Joi.object({
      brand_order: Joi.string().valid("ASC", "DESC"),
      zone_order: Joi.string().valid("ASC", "DESC"),
      area_order: Joi.string().valid("ASC", "DESC"),
      room_order: Joi.string().valid("ASC", "DESC"),
    }).custom((value) => {
      return {
        brand_order: value.brand_order ? value.brand_order : "ASC",
        zone_order: value.zone_order ? value.zone_order : "ASC",
        area_order: value.area_order ? value.area_order : "ASC",
        room_order: value.room_order ? value.room_order : "ASC",
      };
    }),
  },
  specify: {
    payload: {
      considered_product_id: Joi.string()
        .trim()
        .required()
        .error(
          commonFailValidatedMessageFunction("Considered Product is missing")
        ),
      specification: Joi.object({
        is_refer_document: Joi.boolean()
          .valid(true, false)
          .required()
          .error(
            commonFailValidatedMessageFunction(
              "Is refer to document is missing"
            )
          ),
        specification_attribute_groups: Joi.array().items({
          id: Joi.string(),
          attributes: Joi.array().items({
            id: Joi.string(),
            basis_option_id: Joi.string(),
          }),
        }),
      }),
      brand_location_id: Joi.string()
        .trim()
        .required()
        .error(commonFailValidatedMessageFunction("Brand location is missing")),
      distributor_location_id: Joi.string()
        .trim()
        .required()
        .error(
          commonFailValidatedMessageFunction("Distributor location is missing")
        ),

      // is_entire: Joi.boolean()
      //   .valid(true, false)
      //   .required()
      //   .error(
      //     commonFailValidatedMessageFunction("Distributor location is missing")
      //   ),
      // project_zone_ids: Joi.array().items(Joi.string().allow("")),
      material_code_id: Joi.string()
        .trim()
        .required()
        .error(commonFailValidatedMessageFunction("Material code is missing")),
      suffix_code: Joi.string()
        .trim()
        .required()
        .error(commonFailValidatedMessageFunction("Suffix code is missing")),
      description: Joi.string().allow(""),
      quantity: Joi.number()
        .required()
        .error(commonFailValidatedMessageFunction("Quantity is missing")),
      unit_type_id: Joi.string()
        .trim()
        .required()
        .error(commonFailValidatedMessageFunction("Unit type is missing")),
      order_method: Joi.number()
        .valid(ORDER_METHOD.DIRECT_PURCHASE, ORDER_METHOD.CUSTOM_ORDER)
        .required()
        .error(commonFailValidatedMessageFunction("Order method is missing")),
      requirement_type_ids: Joi.array()
        .items(
          Joi.string()
            .trim()
            .required()
            .error(
              commonFailValidatedMessageFunction(
                "Approval requirements prior to fabrication is missing"
              )
            )
        )
        .required()
        .error(
          commonFailValidatedMessageFunction(
            "Approval requirements prior to fabrication is missing"
          )
        ),
      instruction_type_ids: Joi.array()
        .items(
          Joi.string()
            .trim()
            .required()
            .error(
              commonFailValidatedMessageFunction(
                "General instructions is missing"
              )
            )
        )
        .required()
        .error(
          commonFailValidatedMessageFunction("General instructions is missing")
        ),
      special_instructions: Joi.string().allow(""),
      variant: Joi.string().allow(""),
    },
  },
  updateStatusProductSpecified: {
    params: {
      id: Joi.string()
        .required()
        .error(
          commonFailValidatedMessageFunction("Specified product is required")
        ),
    },
    payload: {
      status: Joi.number()
        .valid(
          SPECIFIED_PRODUCT_STATUS.CANCELLED,
          SPECIFIED_PRODUCT_STATUS.RE_SPECIFIED,
          SPECIFIED_PRODUCT_STATUS.SPECIFIED
        )
        .required()
        .error(commonFailValidatedMessageFunction("Status is required")),
    },
  },
};
