import {
  getListValidation,
  requireStringValidation,
} from "@/validates/common.validate";
import Joi from "joi";

const InventoryId = Joi.object({
  id: requireStringValidation("Inventory id"),
});

const volumePricesSchema = Joi.array()
  .allow(null)
  .items(
    Joi.object({
      discount_rate: Joi.number().strict().min(0).max(100).required().messages({
        "number.base": "Discount rate must be a number.",
        "number.min": "Discount rate cannot be less than 0.",
        "number.max": "Discount rate cannot exceed 100.",
        "any.required": "Discount rate is required.",
      }),
      min_quantity: Joi.number().strict().min(1).required().messages({
        "number.base": "Minimum quantity must be a number.",
        "any.required": "Minimum quantity is required.",
        "number.min": "Minium quantity cannot be less than 1.",
      }),
      max_quantity: Joi.number()
        .strict()
        .greater(Joi.ref("min_quantity"))
        .required()
        .messages({
          "number.base": "Maximum quantity must be a number.",
          "number.greater":
            "Maximum quantity must be greater than minimum quantity.",
          "any.required": "Maximum quantity is required.",
        }),
    }).and("discount_rate", "min_quantity", "max_quantity")
  );

const InventoryCreateRequest = Joi.object({
  sku: requireStringValidation("Inventory sku"),
  inventory_category_id: requireStringValidation("Inventory category id"),
  image: Joi.string().allow(null).allow(""),
  description: Joi.string().allow(null).allow(""),
  unit_price: Joi.number().min(1).strict().required().messages({
    "any.required": "Unit price is required",
    "any.min": "Unit price is must be greater than 0",
  }),
  unit_type: requireStringValidation("Unit type"),
  volume_prices: volumePricesSchema,
})
  .and("unit_price", "unit_type")
  .messages({
    "object.and":
      "Unit price, unit type, and volume prices must all be provided together.",
  });

const InventoryUpdateRequest = Joi.object({
  image: Joi.string().allow(null).allow(""),
  sku: Joi.string().allow(null),
  description: Joi.string().allow(null).allow(""),
  unit_price: Joi.number().min(1).strict().allow(null),
  unit_type: Joi.string().allow(null),
  volume_prices: volumePricesSchema,
});

export default {
  get: {
    params: {
      id: Joi.string().required(),
    },
  },
  getList: getListValidation({
    query: {
      category_id: Joi.string().allow(null),
      limit: Joi.number().allow(null),
      offset: Joi.number().allow(null),
      order: Joi.string().allow(null),
      sort: Joi.string().allow(null),
      search: Joi.string().allow(null),
    },
    custom: (value) => ({
      sort: value.sort || "sku",
      order: value.order || "DESC",
    }),
  }),
  create: {
    payload: InventoryCreateRequest,
  },
  delete: {
    params: InventoryId,
  },
  update: {
    params: InventoryId,
    payload: InventoryUpdateRequest,
  },
  updateInventories: {
    payload: Joi.object()
      .required()
      .pattern(
        Joi.string().required(),
        Joi.object({
          unit_price: Joi.number().min(1).strict().required(),
          unit_type: Joi.string().required(),
          volume_prices: volumePricesSchema,
        }).required()
      ),
  },
  exchange: {
    params: Joi.object({
      id: Joi.string().required(),
    }),
    payload: Joi.object({
      to_currency: Joi.string().required(),
    }),
  },
  getSummary: {
    params: {
      id: Joi.string().required(),
    },
  },
};
