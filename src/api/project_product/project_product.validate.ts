import { getEnumValues } from "@/helpers/common.helper";
import {
  errorMessage,
  requireStringValidation,
  stringValidation,
} from "@/validates/common.validate";
import Joi from "joi";
import {
  OrderMethod,
  ProductConsiderStatus,
  ProductSpecifyStatus,
} from "./project_product.type";

const requiredConsideredId = requireStringValidation("Considered product");
const requiredProductId = requireStringValidation("Product id");
const requiredProjectId = requireStringValidation("Project id");

export const orderValidate = Joi.string().valid("ASC", "DESC");

export default {
  assignProductToProject: {
    payload: {
      entire_allocation: Joi.boolean(),
      product_id: requiredProductId,
      project_id: requiredProjectId,
      allocation: Joi.array().items(Joi.string()),
      custom_product: Joi.boolean().allow(null),
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
    }).custom((value) => ({
      ...value,
      area_order: value.area_order || "ASC",
      room_order: value.room_order || "ASC",
    })),
  },
  updateConsiderProductStatus: {
    params: { id: requiredConsideredId },
    payload: {
      consider_status: Joi.number()
        .valid(...getEnumValues(ProductConsiderStatus))
        .required()
        .error(errorMessage("Status is required")),
    },
  },
  updateProductSpecifyStatus: {
    params: { id: requiredConsideredId },
    payload: {
      specified_status: Joi.number()
        .valid(...getEnumValues(ProductSpecifyStatus))
        .required()
        .error(errorMessage("Status is required")),
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
          .error(errorMessage("Is refer to document is missing")),
        attribute_groups: Joi.array().items({
          id: Joi.string(),
          configuration_steps: Joi.array().items(
            Joi.object({
              step_id: Joi.string(),
              options: Joi.array().items({
                id: Joi.string(),
                quantity: Joi.number().min(1),
                pre_option: Joi.any(),
              }),
            })
          ),
          step_selections: Joi.any(),
          attributes: Joi.array().items({
            id: Joi.string(),
            basis_option_id: Joi.string(),
          }),
        }),
      }),
      brand_location_id: requireStringValidation("Brand location"),
      distributor_location_id: stringValidation(),
      entire_allocation: Joi.boolean(),
      allocation: Joi.array().items(Joi.string().allow("")),
      material_code_id: requireStringValidation("Material code"),
      suffix_code: requireStringValidation("Suffix code"),
      description: requireStringValidation("Description"),
      quantity: Joi.number()
        .required()
        .error(errorMessage("Quantity is required")),
      unit_type_id: Joi.string().trim().allow(""),
      order_method: Joi.number().valid(...getEnumValues(OrderMethod)),
      requirement_type_ids: Joi.array().items(Joi.string().trim().allow(null)),
      instruction_type_ids: Joi.array().items(Joi.string().trim().allow(null)),
      special_instructions: Joi.string().allow(""),
      finish_schedules: Joi.array()
        .items(
          Joi.object({
            floor: Joi.boolean(),
            base: Joi.object({
              ceiling: Joi.boolean(),
              floor: Joi.boolean(),
            }),
            front_wall: Joi.boolean(),
            left_wall: Joi.boolean(),
            back_wall: Joi.boolean(),
            right_wall: Joi.boolean(),
            ceiling: Joi.boolean(),
            door: Joi.object({
              frame: Joi.boolean(),
              panel: Joi.boolean(),
            }),
            cabinet: Joi.object({
              carcass: Joi.boolean(),
              door: Joi.boolean(),
            }),
          })
        )
        .error(errorMessage("Please update Finish Schedule!")),
      custom_product: Joi.boolean().allow(null),
      is_done_assistance_request: Joi.boolean().allow(null),
    },
  },
  getListByBrand: {
    params: { project_id: requiredProjectId },
    query: Joi.object({
      brand_order: Joi.string().valid("ASC", "DESC"),
      brand_id: Joi.string().allow(""),
    }).custom((value) => {
      return {
        ...value,
        brand_order: value.brand_order || "ASC",
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
  getFinishScheduleByRoom: {
    params: Joi.object({
      project_product_id: requiredConsideredId,
    }),
    query: Joi.object({
      roomIds: Joi.string().trim(),
    }).custom((value) => {
      return {
        roomIds:
          value.roomIds && value.roomIds.split ? value.roomIds.split(",") : [],
      };
    }),
  },
  getUsedMaterialCodes: {
    params: Joi.object({
      project_product_id: requiredConsideredId,
    }),
  },
};
