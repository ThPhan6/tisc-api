import { getEnumValues } from "@/helper/common.helper";
import { commonFailValidatedMessageFunction } from "@/validate/common.validate";
import * as Joi from "joi";
import {
  OrderMethod,
  ProductConsiderStatus,
  ProductSpecifyStatus,
} from "./project_product.type";

const requiredConsideredId = Joi.string()
  .required()
  .error(commonFailValidatedMessageFunction("Considered product is required"));
const requiredProductId = Joi.string()
  .required()
  .error(commonFailValidatedMessageFunction("Product id is required"));
const requiredProjectId = Joi.string()
  .required()
  .error(commonFailValidatedMessageFunction("Project id is required"));

export const orderValidate = Joi.string().valid("ASC", "DESC");

export default {
  assignProductToProject: {
    payload: {
      entire_allocation: Joi.boolean(),
      product_id: requiredProductId,
      project_id: requiredProjectId,
      allocation: Joi.array().items(Joi.string()),
    },
  },
  getProjectAssignZoneByProduct: {
    params: {
      project_id: requiredProjectId,
      product_id: requiredProductId,
    },
  },
  getConsideredProducts: {
    params: {
      project_id: requiredProjectId,
    },
    query: Joi.object({
      zone_order: orderValidate,
      area_order: orderValidate,
      room_order: orderValidate,
      brand_order: orderValidate,
    }).custom((value) => {
      return {
        zone_order: value.zone_order ?? "ASC",
        area_order: value.area_order ?? "ASC",
        room_order: value.room_order ?? "ASC",
        brand_order: value.brand_order ?? "ASC",
      };
    }),
  },
  updateConsiderProductStatus: {
    params: { id: requiredConsideredId },
    payload: {
      consider_status: Joi.number()
        .valid(...getEnumValues(ProductConsiderStatus))
        .required()
        .error(commonFailValidatedMessageFunction("Status is required")),
    },
  },
  updateProductSpecifyStatus: {
    params: { id: requiredConsideredId },
    payload: {
      specified_status: Joi.number()
        .valid(...getEnumValues(ProductSpecifyStatus))
        .required()
        .error(commonFailValidatedMessageFunction("Status is required")),
    },
  },
  deleteConsiderProduct: {
    params: { id: requiredConsideredId },
  },
  specifyProduct: {
    params: { id: requiredConsideredId },
    payload: {
      specification: Joi.object({
        is_refer_document: Joi.boolean()
          .valid(true, false)
          .required()
          .error(
            commonFailValidatedMessageFunction(
              "Is refer to document is missing"
            )
          ),
        attribute_groups: Joi.array().items({
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
      entire_allocation: Joi.boolean(),
      allocation: Joi.array().items(Joi.string().allow("")),
      material_code_id: Joi.string()
        .trim()
        .required()
        .error(commonFailValidatedMessageFunction("Material code is required")),
      suffix_code: Joi.string()
        .trim()
        .required()
        .error(commonFailValidatedMessageFunction("Suffix code is required")),
      description: Joi.string()
        .trim()
        .required()
        .error(commonFailValidatedMessageFunction("Description is required")),
      finish_schedules: Joi.array().items(Joi.string().trim().allow(null)),
      quantity: Joi.number()
        .required()
        .error(commonFailValidatedMessageFunction("Quantity is required")),
      unit_type_id: Joi.string().trim().allow(""),
      order_method: Joi.number().valid(...getEnumValues(OrderMethod)),
      requirement_type_ids: Joi.array().items(Joi.string().trim().allow(null)),
      instruction_type_ids: Joi.array().items(Joi.string().trim().allow(null)),
      special_instructions: Joi.string().allow(""),
    },
  },
  getListByBrand: {
    params: { project_id: requiredProjectId },
    query: Joi.object({
      brand_order: Joi.string().valid("ASC", "DESC"),
    }).custom((value) => {
      return {
        brand_order: value.brand_order ? value.brand_order : "ASC",
      };
    }),
  },
  getListByMaterial: {
    params: { project_id: requiredProjectId },
    query: Joi.object({
      material_order: Joi.string().valid("ASC", "DESC"),
      brand_order: Joi.string().valid("ASC", "DESC"),
    }).custom((value) => {
      return {
        brand_order: value.brand_order ? value.brand_order : undefined,
        material_order: value.material_order ? value.material_order : undefined,
      };
    }),
  },
};
